import {Component, signal} from "@angular/core";
import {SurfaceComponent} from "../base/surface/surface.component";
import {RoomMetricComponent} from "../room-metric/room-metric.component";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MqttIrService} from "../../services/mqtt-ir.service";
import {filter, first, timeout} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {IMqttMessage} from "ngx-mqtt";
import {AcAutoModeConfig} from "../../types/ac-auto-mode-config";
import {ActionGroup} from "../../types/action-group";

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
  ],
  templateUrl: "./ac-auto-mode.component.html",
  styleUrl: "./ac-auto-mode.component.css"
})
export class AcAutoModeComponent {

  public readonly PULL_CONFIG_TIMEOUT = 3_000;

  public readonly AC_AUTO_CONfIG_FIELD = "ac_auto_mode_config";

  protected hermeticitySensorId = signal<string | undefined>(undefined);

  protected vocSensorId = signal<string | undefined>(undefined);

  protected co2SensorId = signal<string | undefined>(undefined);

  protected onGroupFormControl: FormControl = new FormControl(null, [Validators.required]);

  protected offGroupFormControl: FormControl = new FormControl(null, [Validators.required]);

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
          return JSON.parse(message.payload.toString()).hasOwn(this.AC_AUTO_CONfIG_FIELD);
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
      .find(g => g.id === config.on_action_group_id);

    this.onGroupFormControl.setValue(onGroup ?? null);
    this.offGroupFormControl.setValue(offGroup ?? null);
  }
}
