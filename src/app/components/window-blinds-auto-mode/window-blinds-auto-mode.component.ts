import {Component, signal, WritableSignal} from "@angular/core";
import {SurfaceComponent} from "../base/surface/surface.component";
import {RoomMetricComponent} from "../room-metric/room-metric.component";
import {MatButton} from "@angular/material/button";
import {MqttIrService} from "../../services/mqtt-ir.service";
import {switchMap, tap} from "rxjs";
import {WindowBlindsAutoModeConfig} from "../../types/window-blinds-auto-mode-config";
import {MqttBlindsService} from "../../services/mqtt-blinds.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: "app-window-blinds-auto-mode",
  imports: [
    SurfaceComponent,
    RoomMetricComponent,
    MatButton,
    MatFormField,
    MatInput,
    MatProgressSpinner,
    MatLabel
  ],
  templateUrl: "./window-blinds-auto-mode.component.html",
  styleUrl: "./window-blinds-auto-mode.component.css"
})
export class WindowBlindsAutoModeComponent {

  protected mode: "init" | "config" = "init";

  protected blindsMotorId = signal<string | undefined>(undefined);

  protected blindsControllerId = signal<string | undefined>(undefined);

  protected loadingConfig = false;

  protected autoModeEnabled = signal(false);

  constructor(protected mqttBlindsService: MqttBlindsService) {
  }

  protected toggleAutoMode() {
    this.mqttBlindsService.setAutoMode(this.blindsControllerId()!, !this.autoModeEnabled())
      .subscribe(this.autoModeEnabled.set);
  }

  protected connectToControllerDevice(deviceId: string) {
    this.loadingConfig = true;
    this.mqttBlindsService.pullWindowBlindsAutoModeConfig(deviceId)
      .pipe(
        tap({
          next: () => {
            this.loadingConfig = false;
            this.mode = "config";
            this.blindsControllerId.set(deviceId);
          },
          error: () => {
            this.loadingConfig = false;
            this.mode = "config";
            this.blindsControllerId.set(deviceId);
          }
        }),
        switchMap((config: WindowBlindsAutoModeConfig) => {
          this.blindsMotorId.set(config.blinds_motor_id);
          console.log("setting config", config, " device id is ", deviceId);
          return this.mqttBlindsService.isAutoModeEnabled(this.blindsControllerId()!);
        })
      ).subscribe(this.autoModeEnabled.set);

  }

  protected uploadConfiguration() {
    if (this.blindsMotorId()) {
      this.mqttBlindsService.publishWindowBlindsAutoModeConfig(
        this.blindsControllerId()!,
        {
          blinds_motor_id: this.blindsControllerId()!,
        }
      );
    }
  }
}
