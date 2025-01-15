import {Component, effect, inject, Input, OnDestroy, signal} from "@angular/core";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {StringModalComponent} from "../base/string-modal/string-modal.component";
import {concatMap, first, Observable, shareReplay, Subject, takeUntil} from "rxjs";
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

  public readonly METRIC_DATA_TOPIC: string = "data";

  @Input({required: true}) public sensorName!: string;

  @Input({required: true}) public metricName!: string;

  @Input() public deviceId = signal<string | undefined>(undefined);

  protected metricValue = signal<string | undefined>(undefined);

  private dialog = inject(MatDialog);

  private destroy$ = new Subject<void>();

  constructor(private mqttWrapper: MqttWrapperService) {
    effect(() => {
      if (this.deviceId() !== undefined) {
        this.subscribeToDevice(this.deviceId()!);
      } else {
        this.destroy$.next();
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

    dialogRef.afterClosed().subscribe({
      next: (deviceId: string) => {
        if (deviceId !== undefined) {
          console.log("Setting metric device id", deviceId);
          this.deviceId.set(deviceId);
        }
      },
      error: (error) => console.error(`Error updating device info:`, error),
    });
  }

  private extractMetricValue(message: IMqttMessage): string | undefined {
    try {
      const payload = JSON.parse(message.payload.toString());
      if (!Array.isArray(payload)) {
        return undefined;
      }
      console.log(payload);
      const metric = (payload as Metric[]).filter(m => m.name === this.metricName)
        .sort((m1, m2) => m2.dt - m1.dt)
        .at(0);
      console.log(`metric ${metric?.dt}`);
      return metric?.value;
    } catch {
      return undefined;
    }
  }

  private subscribeToDevice(deviceId: string): void {
    const topic = `${deviceId}/${this.METRIC_DATA_TOPIC}`;
    this.mqttWrapper.topic(topic, true)
      .pipe(first())
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
