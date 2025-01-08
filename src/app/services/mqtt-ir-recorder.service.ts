import {Injectable, signal} from "@angular/core";
import {MqttWrapperService} from "./mqtt-wrapper.service";
import {IMqttMessage} from "ngx-mqtt";

@Injectable()
export class MqttIrRecorderService {

  private readonly cmdTopic: string = "cmd";

  private readonly cmdPayload = JSON.stringify({
    "cmd": "record"
  });

  private readonly irRecordStatus: string = "recording";

  private readonly irDataTopic: string = "data";
  private readonly statusTopic: string = "status";

  public readonly irDeviceReady = signal<boolean>(false);

  constructor(private mqttWrapper: MqttWrapperService) {
  }

  public initIrDevice(deviceId: string): void {
    const cmdTopic = `${deviceId}/${this.cmdTopic}`;
    const statusTopic = `${deviceId}/${this.statusTopic}`;
    const dataTopic = `${deviceId}/${this.irDataTopic}`;

    this.mqttWrapper.publish(cmdTopic, this.cmdPayload);
    this.mqttWrapper.topic(statusTopic).subscribe(message => {
      const payload = JSON.parse(message.payload.toString());
      if (payload.status !== this.irRecordStatus) {
        this.irDeviceReady.set(false);
        return;
      }

      this.irDeviceReady.set(true);
      console.log(payload);
    });

    // this.mqttWrapper.topic(dataTopic).subscribe(message => {
    //   const payload = JSON.parse(message.payload.toString());
    //
    // })
  }
}
