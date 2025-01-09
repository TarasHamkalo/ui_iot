import {Injectable, signal} from "@angular/core";
import {IMqttMessage, IMqttServiceOptions, MqttService} from "ngx-mqtt";
import {Observable} from "rxjs";

@Injectable({providedIn: "root"})
export class MqttWrapperService {

  public readonly mqttServiceOptions: IMqttServiceOptions = {
    hostname: import.meta.env.NG_APP_MQTT_HOSTNAME,
    port: import.meta.env.NG_APP_MQTT_PORT,
    protocol: import.meta.env.NG_APP_MQTT_PROTOCOL == "wss" ? "wss" : "ws",

    username: import.meta.env.NG_APP_MQTT_USERNAME,
    password: import.meta.env.NG_APP_MQTT_PASSWORD,
  };

  // e.g. room topic
  public readonly baseTopic: string = import.meta.env.NG_APP_MQTT_BASE_TOPIC;

  public readonly isConnected = signal<boolean>(false);

  constructor(private mqttService: MqttService) {}

  public connect(): void {
    try {
      this.mqttService.connect(this.mqttServiceOptions as IMqttServiceOptions);
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
