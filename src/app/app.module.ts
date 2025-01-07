import {NgModule} from '@angular/core';
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {MatButton} from "@angular/material/button";
import {MqttIrService} from "./services/mqtt-ir.service";
import {IMqttServiceOptions, MqttModule} from "ngx-mqtt";

// const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
//   // hostname: '147.232.205.176',
//   // hostname: "mosquitto",
//   hostname: "localhost",
//   // hostname: 'mosquitto',
//   port: 8000,
//   path: '/',
//   protocol: 'ws',
//
//   clientId: 'th776no',
//
//   // username: 'maker',
//   // password: 'mother.mqtt.password',
//
//   // url: 'ws://147.232.205.176:8000/ws',
//   // connectOnCreate: false
// };

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  // hostname: "localhost", // Or use "mosquitto" if that's the hostname in your Docker network
  hostname: '127.0.0.1',
  // hostname: 'mosquitto',
  port: 8000,
  path: '/', // Default path as Mosquitto is not configured for a custom path
  protocol: 'ws', // WebSocket protocol
  clientId: 'th776no', // Unique client ID
};
@NgModule({
  declarations: [
    AppComponent, // Declare your AppComponent here
  ],
  imports: [
    BrowserModule,
    MatButton,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS), // Include MQTT configuration
  ],
  providers: [MqttIrService], // Add the service to providers
  bootstrap: [AppComponent], // Set AppComponent as the bootstrap component
})
export class AppModule { }
