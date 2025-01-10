import {Injectable} from "@angular/core";
import {MqttWrapperService} from "./mqtt-wrapper.service";
import {Observable} from "rxjs";
import {IMqttMessage} from "ngx-mqtt";

@Injectable({
  providedIn: "root"
})
export class MqttIrService {

  public readonly IR_TOPICS = {
    cmd: (deviceId: string) => `${deviceId}/cmd`,
    data: (deviceId: string) => `${deviceId}/data`,
    status: (deviceId: string) => `${deviceId}/status`,
  };

  public readonly IR_PAYLOADS = {
    recordCmd: JSON.stringify({cmd: "record"}),
    stopRecordingCmd: JSON.stringify({cmd: "standby"}),
    recordingStatus: JSON.stringify({status: "recording"})
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

  public stopRecording(deviceId: string) {
    this.mqttWrapper.publish(this.IR_TOPICS.cmd(deviceId), this.IR_PAYLOADS.stopRecordingCmd);
  }
}
