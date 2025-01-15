import {Component, effect, OnDestroy, signal, WritableSignal} from "@angular/core";
import {SurfaceComponent} from "../base/surface/surface.component";
import {RoomMetricComponent} from "../room-metric/room-metric.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MqttIrService} from "../../services/mqtt-ir.service";
import {first, Subject, switchMap, takeUntil, tap, timer} from "rxjs";
import {WindowBlindsAutoModeConfig} from "../../types/window-blinds-auto-mode-config";
import {MqttBlindsService} from "../../services/mqtt-blinds.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {MqttService} from "ngx-mqtt";

@Component({
  selector: "app-window-blinds-auto-mode",
  imports: [
    SurfaceComponent,
    RoomMetricComponent,
    MatButton,
    MatFormField,
    MatInput,
    MatProgressSpinner,
    MatLabel,
    MatIconButton,
    MatTooltip,
    MatIcon
  ],
  templateUrl: "./window-blinds-auto-mode.component.html",
  styleUrl: "./window-blinds-auto-mode.component.css"
})
export class WindowBlindsAutoModeComponent implements OnDestroy {

  protected mode: "init" | "config" = "init";

  protected blindsMotorId = signal<string | undefined>(undefined);

  protected blindsControllerId = signal<string | undefined>(undefined);

  protected loadingConfig = false;

  protected autoModeEnabled = signal(false);

  protected destroy$ = new Subject<void>();

  constructor(protected mqttBlindsService: MqttBlindsService) {
    effect(() => {
      if (this.blindsControllerId() !== undefined) {
        this.mode = "config";
      } else {
        this.blindsMotorId.set(undefined);
        this.mode = "init";
        this.destroy$.next();
      }
    });
  }

  protected toggleAutoMode() {
    this.mqttBlindsService.setAutoMode(this.blindsControllerId()!, !this.autoModeEnabled());
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
          return this.mqttBlindsService.isAutoModeEnabled(this.blindsControllerId()!)
            .pipe(takeUntil(this.destroy$));
        }),
      ).subscribe(this.autoModeEnabled.set);

  }

  protected uploadConfiguration() {
    if (this.blindsMotorId()) {
      this.mqttBlindsService.publishWindowBlindsAutoModeConfig(
        this.blindsControllerId()!,
        {
          blinds_motor_id: this.blindsMotorId()!,
        }
      );
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
