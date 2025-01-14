import {Injectable} from "@angular/core";
import {MqttWrapperService} from "./mqtt-wrapper.service";
import {first, map, Observable, switchMap} from "rxjs";
import {IMqttMessage} from "ngx-mqtt";
import {AcAutoModeConfig} from "../types/ac-auto-mode-config";
import {PersistentSignal} from "../types/persistent-signal";

@Injectable({
  providedIn: "root"
})
export class MqttIrService {

  public readonly IR_TOPICS = {
    cmd: (deviceId: string) => `${deviceId}/cmd`,
    data: (deviceId: string) => `${deviceId}/data`,
    status: (deviceId: string) => `${deviceId}/status`,
    config: (deviceId: string) => `${deviceId}/status`,
  };

  public readonly IR_PAYLOADS = {
    recordCmd: JSON.stringify({cmd: "record"}),

    stopRecordingCmd: JSON.stringify({cmd: "standby"}),

    setConfigCmd: (acAutoModeConfig: AcAutoModeConfig) => JSON.stringify({
      cmd: "set",
      args: {
        type: "ac_auto_mode_config",
        value: acAutoModeConfig,
      }
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

  constructor(private mqttWrapper: MqttWrapperService) {
  }

  public record(deviceId: string): Observable<IMqttMessage> {
    this.mqttWrapper.publish(this.IR_TOPICS.cmd(deviceId), this.IR_PAYLOADS.recordCmd);
    return this.mqttWrapper.topic(this.IR_TOPICS.status(deviceId));
  }

  public capture(deviceId: string): Observable<IMqttMessage> {
    return this.mqttWrapper.topic(this.IR_TOPICS.data(deviceId));
  }

  public stopRecording(deviceId: string): void {
    this.mqttWrapper.publish(this.IR_TOPICS.cmd(deviceId), this.IR_PAYLOADS.stopRecordingCmd);
  }

  public publishAcAutoModeConfig(deviceId: string, acAutoModeConfig: AcAutoModeConfig): void {
    this.mqttWrapper.publish(
      this.IR_TOPICS.cmd(deviceId), this.IR_PAYLOADS.setConfigCmd(acAutoModeConfig)
    );
  }

  public pullAcAutoModeConfig(deviceId: string): Observable<IMqttMessage> {
    return this.mqttWrapper.topic(this.IR_TOPICS.config(deviceId));
  }

  public persistSignals(deviceId: string, groupName: "on" | "off", signals: PersistentSignal[]) {
    this.mqttWrapper.publish(
      this.IR_TOPICS.cmd(deviceId),
      this.IR_PAYLOADS.persistSignalsCmd(groupName, signals)
    );
  }

  public setAutoMode(deviceId: string, enabled: boolean) {
    this.mqttWrapper.publish(
      this.IR_TOPICS.cmd(deviceId),
      this.IR_PAYLOADS.setAutoModeCmd(enabled)
    );

    return this.mqttWrapper.topic(this.IR_TOPICS.status(deviceId)).pipe(
      first(),
      switchMap((message: IMqttMessage) => {
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
