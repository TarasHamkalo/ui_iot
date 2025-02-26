import {Injectable} from "@angular/core";
import {MqttWrapperService} from "./mqtt-wrapper.service";
import {first, map, Observable, throwError, timeout} from "rxjs";
import {IMqttMessage} from "ngx-mqtt";
import {AcAutoModeConfig} from "../types/ac-auto-mode-config";
import {PersistentSignal} from "../types/persistent-signal";

@Injectable({
  providedIn: "root"
})
export class MqttIrService {

  public readonly IR_TOPICS = {
    cmd: (deviceId: string) => `${deviceId}/cmd`,
    set: (deviceId: string) => `${deviceId}/set`,
    data: (deviceId: string) => `${deviceId}/data`,
    status: (deviceId: string) => `${deviceId}/status`,
    config: (deviceId: string) => `${deviceId}/status`,
  };

  public readonly IR_PAYLOADS = {
    recordCmd: JSON.stringify({cmd: "record", args: {}}),

    stopRecordingCmd: JSON.stringify({cmd: "standby", args: {}}),

    setConfigCmd: (acAutoModeConfig: AcAutoModeConfig) => JSON.stringify({
        ac_auto_mode_config: acAutoModeConfig,
    }),

    persistSignalsCmd: (groupName: string, signals: PersistentSignal[]) => JSON.stringify({
      cmd: "persist",
      args: {
        group_name: groupName,
        signals: signals,
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

  public readonly AC_AUTO_CONfIG_FIELD = "ac_auto_mode_config";

  public readonly PULL_CONFIG_TIMEOUT = 3_000;

  constructor(private mqttWrapper: MqttWrapperService) {
  }

  public record(deviceId: string): Observable<IMqttMessage> {
    this.mqttWrapper.publish(this.IR_TOPICS.cmd(deviceId), this.IR_PAYLOADS.recordCmd);
    return this.mqttWrapper.topic(this.IR_TOPICS.status(deviceId), false);
  }

  public capture(deviceId: string): Observable<IMqttMessage> {
    return this.mqttWrapper.topic(this.IR_TOPICS.data(deviceId), false);
  }

  public stopRecording(deviceId: string): void {
    this.mqttWrapper.publish(this.IR_TOPICS.cmd(deviceId), this.IR_PAYLOADS.stopRecordingCmd);
  }

  public publishAcAutoModeConfig(deviceId: string, acAutoModeConfig: AcAutoModeConfig): void {
    console.log("Config is ", acAutoModeConfig);

    this.mqttWrapper.publish(
      this.IR_TOPICS.set(deviceId), this.IR_PAYLOADS.setConfigCmd(acAutoModeConfig)
    );
  }

  public pullAcAutoModeConfig(deviceId: string): Observable<Partial<AcAutoModeConfig>> {
    return this.mqttWrapper.topic(this.IR_TOPICS.config(deviceId), true)
      .pipe(
        first(),
        timeout(this.PULL_CONFIG_TIMEOUT),
        map((message: IMqttMessage) => {
          const payload = JSON.parse(message.payload.toString());
          if (Object.hasOwn(payload, this.AC_AUTO_CONfIG_FIELD)) {
            return payload[this.AC_AUTO_CONfIG_FIELD] as Partial<AcAutoModeConfig>;
          }
          throw throwError(() => new Error("Payload do not contain auto config field"));
        })
      );
  }

  public persistSignals(deviceId: string, groupName: "on" | "off", signals: PersistentSignal[]) {
    this.mqttWrapper.publish(
      this.IR_TOPICS.cmd(deviceId),
      this.IR_PAYLOADS.persistSignalsCmd(groupName, signals)
    );
  }

  public setAutoMode(deviceId: string, enabled: boolean) {
    console.log(deviceId, enabled);
    this.mqttWrapper.publish(
      this.IR_TOPICS.cmd(deviceId),
      this.IR_PAYLOADS.setAutoModeCmd(enabled)
    );

  }

  public isAutoModeEnabled(deviceId: string) {
    return this.mqttWrapper.topic(this.IR_TOPICS.status(deviceId), true).pipe(
      map((message: IMqttMessage) => {
        console.log(message.payload.toString());
        const payload = JSON.parse(message.payload.toString());
        if (Object.hasOwn(payload, "status")) {
          return payload.status;
        }

        return null;
      }),
      map(status => {
        return status === this.AUTO_MODE_STATUS;
      })
    );
  }
}
