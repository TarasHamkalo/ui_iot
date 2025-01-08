import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {MatButton} from "@angular/material/button";
import {IMqttServiceOptions, MqttModule} from "ngx-mqtt";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MqttWrapperService} from "./services/mqtt-wrapper.service";


const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: import.meta.env.NG_APP_MQTT_HOSTNAME,
  port: import.meta.env.NG_APP_MQTT_PORT,
  protocol: import.meta.env.NG_APP_MQTT_PROTOCOL == "wss" ? "wss" : "ws",

  username: import.meta.env.NG_APP_MQTT_USERNAME,
  password: import.meta.env.NG_APP_MQTT_PASSWORD,
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButton,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
  ],
  providers: [MqttWrapperService],
  bootstrap: [AppComponent],
})
export class AppModule { }
