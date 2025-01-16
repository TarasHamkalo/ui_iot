import {Component} from "@angular/core";
import {MatStepper, MatStepperModule} from "@angular/material/stepper";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  Validators
} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MqttIrService} from "../../services/mqtt-ir.service";
import {first, map, timeout} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {IMqttMessage} from "ngx-mqtt";
import {MatTooltip} from "@angular/material/tooltip";
import {MatCheckbox} from "@angular/material/checkbox";
import {MqttActionRepositoryService} from "../../repository/mqtt-action-repository.service";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {MqttAction} from "../../types/mqtt-action";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-action-registration",
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    // MatFormField,
    // MatInput,
    MatButton,
    // MatHint,
    MatFormFieldModule,
    MatInput,
    MatTabGroup,
    MatTab,
    MatProgressSpinner,
    MatIcon,
    MatTooltip,
    MatCheckbox,
    NgIf,

  ],
  templateUrl: "./action-registration.component.html",
  styleUrl: "./action-registration.component.css"
})
export class ActionRegistrationComponent {

  public readonly STATUS_CHANGE_TIMEOUT: number = 15_000;

  public readonly DATA_READ_TIMEOUT: number = 3_000;

  public readonly IR_SEND_COMMAND = "send";

  protected readonly basicInfoForm: FormGroup;

  protected readonly payloadForm: FormGroup;

  protected payloadTabIndex = 0;

  protected deviceState: "connected" | "connecting" | "disconnected" = "disconnected";

  constructor(private mqttIrService: MqttIrService,
              private mqttActionRepository: MqttActionRepositoryService,
              private roomControlContext: RoomControlContextService,
              private formBuilder: FormBuilder) {

    this.basicInfoForm = this.formBuilder.group({
      actionName: ["", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z ]*")]],
      mqttTopic: ["", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z/0-9]*")]],
      mqttRetain: [false],
    });

    this.payloadForm = this.formBuilder.group({
      mqttPayload: ["", [Validators.required, Validators.maxLength(2000), this.jsonValidator]],
      irDeviceId: [""],
    });
  }

  protected recordIrSignal() {
    this.deviceState = "connecting";
    this.mqttIrService.record(this.payloadForm.controls["irDeviceId"].value).pipe(
      timeout({first: this.STATUS_CHANGE_TIMEOUT}),
      first()
    ).subscribe({
      next: () => {
        //TODO: assumed the only status change could appear is "online" -> "recording"
        this.deviceState = "connected";
        console.log("device is ready");
      },
      error: (e) => {
        this.deviceState = "disconnected";
        console.error(e);
      }
    });
  }


  protected captureIrSignal() {
    this.mqttIrService.capture(this.payloadForm.controls["irDeviceId"].value).pipe(
      timeout({first: this.DATA_READ_TIMEOUT}),
      first(),
      map((message: IMqttMessage) => {
        const payload = JSON.parse(message.payload.toString());
        if (Object.hasOwn(payload, "data")) {
          return message;
        }

        throw new Error("Payload does not contain data field");
      })
    ).subscribe({
      next: (message: IMqttMessage) => {
        const payload = {
          cmd: this.IR_SEND_COMMAND,
          args: {
          ...JSON.parse(message.payload.toString())
          }
        };
        console.log(payload);
        this.payloadForm.controls["mqttPayload"].setValue(JSON.stringify(payload));
        this.payloadTabIndex = 0;
        console.log(payload);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  protected stopRecording() {
    if (this.deviceState == "connected") {
      this.mqttIrService.stopRecording(this.payloadForm.controls["irDeviceId"].value);
    }
    this.deviceState = "disconnected";
  }

  protected registerAction(stepper: MatStepper) {
    try {
      const payload = JSON.parse(this.payloadForm.controls["mqttPayload"].value);

      this.mqttActionRepository.add({
        // id: Date.now(),
        // roomId: this.roomControlContext.getControlledRoom()().id,
        displayName: this.basicInfoForm.controls["actionName"].value,
        mqttTopic: this.basicInfoForm.controls["mqttTopic"].value,
        mqttRetain: this.basicInfoForm.controls["mqttRetain"].value,
        mqttPayload: JSON.stringify(payload)
      }).subscribe({
        next: (action: MqttAction) => {
          this.roomControlContext.addActionToContext(action);
        },
        error: console.error
      });
      this.resetStepper(stepper);
    } catch {
      console.error("Invalid json format");
    }
  }

  protected onStepChange(event: StepperSelectionEvent) {
    console.log(event);
    if (event.selectedIndex == 1) {
      this.stopRecording();
    }
  }

  protected resetStepper(stepper: MatStepper) {
    this.stopRecording();
    stepper.reset();
  }

  protected jsonValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    try {
      JSON.parse(control.value);
      return null;
    } catch {
      return { invalidJson: true };
    }
  }
}
