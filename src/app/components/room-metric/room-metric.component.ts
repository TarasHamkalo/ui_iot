import {Component, inject, Input, signal} from "@angular/core";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {StringModalComponent} from "../base/string-modal/string-modal.component";
import {concatMap, throwError} from "rxjs";
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
export class RoomMetricComponent {

  public readonly METRIC_FIELD: string = "metrics";

  @Input({required: true}) public sensorName!: string;

  @Input({required: true}) public metricName!: string;

  protected deviceId = signal<string | undefined>(undefined);

  protected metricValue = signal<string | undefined>(undefined);

  private dialog = inject(MatDialog);

  constructor(private mqttWrapper: MqttWrapperService) {
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


    dialogRef.afterClosed().pipe(
      concatMap(deviceId => {
        if (deviceId !== undefined) {
          return this.mqttWrapper.topic(deviceId);
        }

        throw throwError(() => new Error("Cancel device id update"));
      }),
    ).subscribe({
      next: (message: IMqttMessage) => {
        this.metricValue.set(this.extractMetricValue(message));
      },
      error: console.error
    });
  }

  private extractMetricValue(message: IMqttMessage): string | undefined {
    try {
      const payload = JSON.parse(message.payload.toString());
      console.log(payload);
      const metricsField = payload?.[this.METRIC_FIELD];
      console.log(metricsField);
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

}
