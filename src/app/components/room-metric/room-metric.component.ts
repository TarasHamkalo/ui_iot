import {Component, effect, inject, Input, OnDestroy, signal} from "@angular/core";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {StringModalComponent} from "../base/string-modal/string-modal.component";
import {concatMap, Subject, Subscription, takeUntil, throwError} from "rxjs";
import {MqttWrapperService} from "../../services/mqtt-wrapper.service";
import {IMqttMessage} from "ngx-mqtt";
import {Metric} from "../../types/metric";

@Component({
  selector: "app-room-metric",
  imports: [
    MatTooltip,
    MatIcon,
    MatIconButton
  ],
  templateUrl: "./room-metric.component.html",
  styleUrl: "./room-metric.component.css"
})
export class RoomMetricComponent implements OnDestroy {

  public readonly METRIC_FIELD: string = "metrics";

  @Input({required: true}) public sensorName!: string;

  @Input({required: true}) public metricName!: string;

  @Input() public deviceId = signal<string | undefined>(undefined);

  protected metricValue = signal<string | undefined>(undefined);

  private dialog = inject(MatDialog);

  private destroy$ = new Subject<void>();

  constructor(private mqttWrapper: MqttWrapperService) {
    effect(() => {
      console.log("effect");
      console.log(this.deviceId());
      if (this.deviceId() !== undefined) {
        this.subscribeToDeviceId(this.deviceId()!);
      }
    });
  }

  protected openDeviceInfoUpdateModal(): void {
    const placeholder = this.deviceId() ? this.deviceId() : "Provide device id";
    const dialogRef = this.dialog.open(StringModalComponent, {
      data: {
        title: "Update device info",
        placeholder: placeholder,
        pattern: "[a-zA-z0-9/]+"
      },
    });

    if (this.destroy$.observed) {
      this.destroy$.next();
    }

    dialogRef.afterClosed()
      .pipe(
        concatMap((deviceId) => {
          if (deviceId) {
            this.deviceId.set(deviceId);
            return this.mqttWrapper.topic(deviceId);
          }
          throw new Error("Cancel device ID update");
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (message: IMqttMessage) => {
          this.metricValue.set(this.extractMetricValue(message));
        },
        error: (error) => console.error(`Error updating device info:`, error),
      });

  }

  private extractMetricValue(message: IMqttMessage): string | undefined {
    try {
      const payload = JSON.parse(message.payload.toString());
      const metricsField = payload?.[this.METRIC_FIELD];
      if (!Array.isArray(metricsField)) {
        return undefined;
      }

      const metric = (payload.metrics as Metric[]).find(m => m.name === this.metricName);
      console.log(`metric ${metric?.value}`);
      return metric?.value;
    } catch {
      return undefined;
    }
  }

  private subscribeToDeviceId(deviceId: string): void {
    this.mqttWrapper
      .topic(deviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message: IMqttMessage) => {
          this.metricValue.set(this.extractMetricValue(message));
        },
        error: (error) => console.error(`Error with topic subscription:`, error),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
