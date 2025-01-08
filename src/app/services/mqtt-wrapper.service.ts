import {Injectable} from "@angular/core";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {Observable} from "rxjs";

@Injectable()
export class MqttWrapperService {

  // e.g. room topic
  private readonly baseTopic: string = import.meta.env.NG_APP_MQTT_BASE_TOPIC;

  constructor(private mqttService: MqttService) { }

  public publish(topic: string, message: string): void {
    this.mqttService.unsafePublish(`${this.baseTopic}/${topic}`, message, {qos: 1, retain: true});
  }

  public topic(topic: string): Observable<IMqttMessage> {
    return this.mqttService.observe(`${this.baseTopic}/${topic}`);
  }

  public disconnect(): void {
    this.mqttService.disconnect();
  }
}
