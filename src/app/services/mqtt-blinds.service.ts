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
    set: (deviceId: string) => `${deviceId}/set`,
    data: (deviceId: string) => `${deviceId}/data`,
    status: (deviceId: string) => `${deviceId}/status`,
    config: (deviceId: string) => `${deviceId}/status`,
  };

  public readonly PAYLOADS = {
    setConfig: (config: WindowBlindsAutoModeConfig) => JSON.stringify({
      window_blinds_auto_mode_config: config,
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
      this.TOPICS.set(deviceId), this.PAYLOADS.setConfig(config)
    );
  }

  public pullWindowBlindsAutoModeConfig(deviceId: string): Observable<WindowBlindsAutoModeConfig> {
    return this.mqttWrapper.topic(this.TOPICS.config(deviceId), true)
      .pipe(
        first(),
        timeout(this.PULL_CONFIG_TIMEOUT),
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
  }

  public isAutoModeEnabled(deviceId: string) {
    return this.mqttWrapper.topic(this.TOPICS.status(deviceId), true).pipe(
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
