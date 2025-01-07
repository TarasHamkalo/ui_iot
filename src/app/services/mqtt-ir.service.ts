import {Injectable} from '@angular/core';
import {IMqttMessage, MqttService} from 'ngx-mqtt'

@Injectable({
  providedIn: 'root'
})
export class MqttIrService {

  constructor(private mqttService: MqttService) {
  }

  createConnection() {
    // this.mqttService.connect();

    // this.mqttService.onConnect.subscribe(() => {
    //   console.log('MQTT connected successfully');
    // });
    //
    // this.mqttService.onError.subscribe((error) => {
    //   console.error('MQTT connection error:', error);
    // });
    //
    // this.mqttService.onMessage.subscribe((message: IMqttMessage) => {
    //   console.log(
    //     `Message received on topic ${message.topic}: ${message.payload.toString()}`
    //   );
    // });
  }

  publish(topic: string, message: string): void {

    this.mqttService.publish(topic, 'Hello, MQTT!');
    this.mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
    console.log(`Message "${message}" published to topic "${topic}"`);
  }

  // Subscribe to a topic
  subscribe(topic: string): void {
    this.mqttService.observe(topic).subscribe((message: IMqttMessage) => {
      console.log(
        `Received message "${message.payload.toString()}" on topic "${message.topic}"`
      );
    });
  }

  // Disconnect from the broker
  disconnect(): void {
    this.mqttService.disconnect();
    console.log('MQTT disconnected');
  }
}
