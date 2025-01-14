import {Injectable} from "@angular/core";
import {AcAutoModeConfig} from "../types/ac-auto-mode-config";
import {WindowBlindsAutoModeConfig} from "../types/window-blinds-auto-mode-config";
import {first, map, Observable, throwError, timeout} from "rxjs";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {MqttWrapperService} from "./mqtt-wrapper.service";

@Injectable({
  providedIn: "root"
})
export class MqttBlindsService {

  public readonly TOPICS = {
    cmd: (deviceId: string) => `${deviceId}/cmd`,
    data: (deviceId: string) => `${deviceId}/data`,
    status: (deviceId: string) => `${deviceId}/status`,
    config: (deviceId: string) => `${deviceId}/status`,
  };

  public readonly PAYLOADS = {
    setConfigCmd: (config: WindowBlindsAutoModeConfig) => JSON.stringify({
      cmd: "set",
      args: {
        type: this.AUTO_CONfIG_FIELD,
        value: config,
      }
    }),

    setAutoModeCmd: (enabled: boolean) => JSON.stringify({
      cmd: "auto",
      args: {
        enabled: enabled
      }
    }),
  };

  public readonly AUTO_MODE_STATUS = "auto";

  public readonly AUTO_CONfIG_FIELD = "window_blinds_auto_mode_config";

  public readonly PULL_CONFIG_TIMEOUT = 3_000;

  constructor(private mqttWrapper: MqttWrapperService) {
  }

  public publishWindowBlindsAutoModeConfig(deviceId: string, config: WindowBlindsAutoModeConfig): void {
    this.mqttWrapper.publish(
      this.TOPICS.cmd(deviceId), this.PAYLOADS.setConfigCmd(config)
    );
  }

  public pullWindowBlindsAutoModeConfig(deviceId: string): Observable<WindowBlindsAutoModeConfig> {
    return this.mqttWrapper.topic(this.TOPICS.config(deviceId), true)
      .pipe(
        timeout(this.PULL_CONFIG_TIMEOUT),
        first(),
        map((message: IMqttMessage) => {
          const payload = JSON.parse(message.payload.toString());
          if (Object.hasOwn(payload, this.AUTO_CONfIG_FIELD)) {
            return payload[this.AUTO_CONfIG_FIELD] as WindowBlindsAutoModeConfig;
          }
          throw throwError(() => new Error("Payload do not contain auto config field"));
        })
      );
  }


  public setAutoMode(deviceId: string, enabled: boolean) {
    console.log(deviceId, enabled);
    this.mqttWrapper.publish(
      this.TOPICS.cmd(deviceId),
      this.PAYLOADS.setAutoModeCmd(enabled)
    );

    return this.isAutoModeEnabled(deviceId);
  }

  public isAutoModeEnabled(deviceId: string) {
    return this.mqttWrapper.topic(this.TOPICS.status(deviceId), true).pipe(
      first(),
      map((message: IMqttMessage) => {
        console.log(message.payload.toString());
        const payload = JSON.parse(message.payload.toString());
        if (Object.hasOwn(payload, "status")) {
          return payload.status;
        }

        return null;
      }),
      map(status => status === this.AUTO_MODE_STATUS)
    );
  }
}
