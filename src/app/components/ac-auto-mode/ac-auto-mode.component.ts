import {Component, signal} from "@angular/core";
import {SurfaceComponent} from "../base/surface/surface.component";
import {RoomMetricComponent} from "../room-metric/room-metric.component";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MqttWrapperService} from "../../services/mqtt-wrapper.service";
import {MqttIrService} from "../../services/mqtt-ir.service";

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
  ],
  templateUrl: "./ac-auto-mode.component.html",
  styleUrl: "./ac-auto-mode.component.css"
})
export class AcAutoModeComponent {

  protected hermeticitySensorId = signal<string | undefined>(undefined);

  protected vocSensorId = signal<string | undefined>(undefined);

  protected co2SensorId = signal<string | undefined>(undefined);

  protected onGroupFormControl: FormControl = new FormControl(null, [Validators.required]);

  protected offGroupFormControl: FormControl = new FormControl(null, [Validators.required]);

  // protected irDeviceId: string;
  protected mode: "init" | "config" = "init";

  constructor(protected roomControlContext: RoomControlContextService,
              private mqttIrService: MqttIrService) {
  }

  protected uploadConfiguration() {
    console.log(this.isConfigValid());
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

  // protected connectToIrDevice(deviceId: string) {
  //   this.mqttIrService.
  // }
}
