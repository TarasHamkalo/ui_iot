import {Injectable} from "@angular/core";
import {MqttWrapperService} from "./mqtt-wrapper.service";
import {Observable} from "rxjs";
import {IMqttMessage} from "ngx-mqtt";
import {AcAutoModeConfig} from "../types/ac-auto-mode-config";

@Injectable({
  providedIn: "root"
})
export class MqttIrService {

  public readonly IR_TOPICS = {
    cmd: (deviceId: string) => `${deviceId}/cmd`,
    data: (deviceId: string) => `${deviceId}/data`,
    status: (deviceId: string) => `${deviceId}/status`,
    config: (deviceId: string) => `${deviceId}/config`,
    cmdStatus: (deviceId: string) => `${deviceId}/cmd/status`,
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
    })

  };

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

}
