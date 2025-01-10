import {Injectable, signal} from "@angular/core";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {Observable} from "rxjs";

@Injectable({providedIn: "root"})
export class MqttWrapperService {

  // e.g. room topic
  public readonly baseTopic: string = import.meta.env.NG_APP_MQTT_BASE_TOPIC;

  public readonly isConnected = signal<boolean>(false);

  constructor(private mqttService: MqttService) {}

  public connect(): void {
    if (this.isConnected()) {
      return;
    }

    try {
      this.mqttService.connect();
    } catch (error) {
      console.error(error);
      return;
    }

    this.mqttService.onConnect.subscribe(() => {
      this.isConnected.set(true);
    });

    this.mqttService.onError.subscribe((error: never) => {
      this.isConnected.set(false);
      console.log("Connection failed", error);
    });
  }

  public publish(topic: string, message: string): void {
    this.mqttService.unsafePublish(`${this.baseTopic}/${topic}`, message, {qos: 1, retain: true});
  }

  public topic(topic: string): Observable<IMqttMessage> {
    return this.mqttService.observe(`${this.baseTopic}/${topic}`);
  }
}
