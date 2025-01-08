import {Injectable} from "@angular/core";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {Observable} from "rxjs";

@Injectable()
export class MqttWrapperService {

  constructor(private mqttService: MqttService) { }

  public publish(topic: string, message: string): void {
    const specificTopic = topic + "/" + this.mqttService.clientId;
    this.mqttService.unsafePublish(specificTopic, message, {qos: 1, retain: true});
  }

  public topic(topic: string): Observable<IMqttMessage> {
    return this.mqttService.observe(topic);
  }

  public disconnect(): void {
    this.mqttService.disconnect();
  }
}
