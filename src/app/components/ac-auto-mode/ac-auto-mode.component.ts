import {Component, signal} from "@angular/core";
import {SurfaceComponent} from "../base/surface/surface.component";
import {RoomMetricComponent} from "../room-metric/room-metric.component";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MqttIrService} from "../../services/mqtt-ir.service";
import {filter, first, takeWhile, timeout, timer} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {IMqttMessage} from "ngx-mqtt";
import {AcAutoModeConfig} from "../../types/ac-auto-mode-config";
import {ActionGroup} from "../../types/action-group";
import {DecimalPipe, NgIf} from "@angular/common";
import {MqttAction} from "../../types/mqtt-action";
import {PersistentSignal} from "../../types/persistent-signal";

@Component({
  selector: "app-ac-auto-mode",
  imports: [
    SurfaceComponent,
    RoomMetricComponent,
    MatButton,
    MatFormField,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatInput,
    MatProgressSpinner,
    DecimalPipe,
    NgIf,
    MatError,
  ],
  templateUrl: "./ac-auto-mode.component.html",
  styleUrl: "./ac-auto-mode.component.scss"
})
export class AcAutoModeComponent {

  public readonly PULL_CONFIG_TIMEOUT = 3_000;

  public readonly AC_AUTO_CONfIG_FIELD = "ac_auto_mode_config";
  public readonly MAX_ACTIONS_ALLOWED = 5;

  protected hermeticitySensorId = signal<string | undefined>(undefined);

  protected vocSensorId = signal<string | undefined>(undefined);

  protected co2SensorId = signal<string | undefined>(undefined);

  protected onGroupFormControl: FormControl = new FormControl<ActionGroup | null>(
    null,
    [
      Validators.required,
      this.maxActionsValidator(this.MAX_ACTIONS_ALLOWED),
      this.irActionsValidator()
    ]
  );

  protected offGroupFormControl: FormControl = new FormControl<ActionGroup | null>(
    null,
    [
      Validators.required,
      this.maxActionsValidator(this.MAX_ACTIONS_ALLOWED),
      this.irActionsValidator()
    ]
  );

  protected mode: "init" | "config" = "init";

  protected irDeviceId = signal<string | undefined>(undefined);

  protected loadingConfig = false;

  constructor(protected roomControlContext: RoomControlContextService,
              private mqttIrService: MqttIrService) {
  }

  protected uploadConfiguration() {
    if (this.isConfigValid()) {
      this.mqttIrService.publishAcAutoModeConfig(
        this.irDeviceId()!,
        {
          on_action_group_id: this.onGroupFormControl.value.id,
          off_action_group_id: this.offGroupFormControl.value.id,
          co2_id: this.co2SensorId()!,
          voc_id: this.vocSensorId()!,
          hermiticity_id: this.hermeticitySensorId()!,
        }
      );

      timer(2000, 2000).pipe(takeWhile((t: number) => t < 2)).subscribe(t => {
        if (t == 0) {
          this.mqttIrService.persistSignals(
            this.irDeviceId()!,
            "on",
            this.getActionGroupPayload(this.onGroupFormControl.value)
          );
        } else {
          this.mqttIrService.persistSignals(
            this.irDeviceId()!,
            "off",
            this.getActionGroupPayload(this.offGroupFormControl.value)
          );
        }
      });
    }
  }

  protected isConfigValid(): boolean {
    return Boolean(
      this.hermeticitySensorId() &&
      this.vocSensorId() &&
      this.co2SensorId() &&
      this.onGroupFormControl.valid &&
      this.offGroupFormControl.valid
    );
  }

  protected connectToIrDevice(deviceId: string) {
    this.loadingConfig = true;
    this.mqttIrService.pullAcAutoModeConfig(deviceId).pipe(
      timeout(this.PULL_CONFIG_TIMEOUT),
      first(),
      filter((message: IMqttMessage) => {
        const payload = JSON.parse(message.payload.toString());
        return Object.hasOwn(payload, this.AC_AUTO_CONfIG_FIELD);
      }),
    ).subscribe({
      next: (message: IMqttMessage) => {
        this.irDeviceId.set(deviceId);
        this.loadingConfig = false;
        this.mode = "config";
        this.setAcAutoConfig(message);
      },
      error: (err) => {
        this.irDeviceId.set(deviceId);
        this.mode = "config";
        this.loadingConfig = false;
        console.error(err);
      },
    });
  }

  // pull auto mode config, no config found at ir/status
  public setAcAutoConfig(message: IMqttMessage) {
    const payload = JSON.parse(message.payload.toString());
    const config: Partial<AcAutoModeConfig> = payload[this.AC_AUTO_CONfIG_FIELD];

    this.vocSensorId.set(config.voc_id);
    this.hermeticitySensorId.set(config.hermiticity_id);
    this.co2SensorId.set(config.co2_id);

    const onGroup: ActionGroup | undefined = this.roomControlContext.getRoomActionGroups()()
      .find(g => g.id === config.on_action_group_id);
    const offGroup: ActionGroup | undefined = this.roomControlContext.getRoomActionGroups()()
      .find(g => g.id === config.off_action_group_id);

    this.onGroupFormControl.setValue(onGroup ?? null);
    this.offGroupFormControl.setValue(offGroup ?? null);
  }


  protected maxActionsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const actionGroup = control.value as ActionGroup | null;

      if (!actionGroup || !actionGroup.actions) {
        return null;
      }

      return actionGroup.actions.length > max ?
        {maxActions: {max: max, actual: actionGroup.actions.length}} : null;
    };
  }

  protected irActionsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const actionGroup = control.value as ActionGroup | null;

      if (!actionGroup || !actionGroup.actions) {
        return null;
      }

      const notIrSignalPresent = actionGroup.actions
        ?.map(action => this.roomControlContext.getRoomActions()().find(s => s.id === action.actionId))
        .filter(action => !this.isValidMqttAction(action)).length > 0;

      return notIrSignalPresent ? {notIrSignalPresent: true} : null;
    };
  }

  private getActionGroupPayload(actionGroup: ActionGroup): PersistentSignal[] {
    return actionGroup.actions
      ?.map(action => this.roomControlContext.getRoomActions()().find(s => s.id === action.actionId))
      .filter(action => this.isValidMqttAction(action))
      .map((action, i) => {
        const data = JSON.parse(action!.mqttPayload.toString()).data;
        return {
          id: i,
          data: data
        } as PersistentSignal;
      });
  }

  private isValidMqttAction(action: MqttAction | undefined): boolean {
    if (action === undefined || action.mqttPayload === undefined) {
      return false;
    }

    try {
      const parsedPayload = JSON.parse(action.mqttPayload);
      return Array.isArray(parsedPayload.data);
    } catch {
      return false;
    }
  }

  private getContentError(control: AbstractControl, errorType: string): string | null {
    if (control.errors) {
      return null;
    }

    switch (errorType) {
      case "maxActions": {
        const maxActionsError = control.getError("maxActions");
        return `Maximum ${maxActionsError.max} actions allowed. Currently selected: ${maxActionsError.actual}.`;
      }
      case "notIrSignalPresent": {
        return "One or more actions do not contain a valid IR signal.";
      }
      default: {
        return null;
      }
    }

  }

}