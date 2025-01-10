import {ApplicationConfig, provideZoneChangeDetection} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideRouter} from "@angular/router";
import {routes} from "./app.routes";
import {IMqttServiceOptions, MqttClientService, MqttServiceConfig} from "ngx-mqtt";

const mqttServiceOptions: IMqttServiceOptions = {
  hostname: import.meta.env.NG_APP_MQTT_HOSTNAME,
  port: import.meta.env.NG_APP_MQTT_PORT,
  protocol: import.meta.env.NG_APP_MQTT_PROTOCOL == "wss" ? "wss" : "ws",

  username: import.meta.env.NG_APP_MQTT_USERNAME,
  password: import.meta.env.NG_APP_MQTT_PASSWORD,

  connectOnCreate: false,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MqttServiceConfig,
      useValue: mqttServiceOptions
    },
    {
      provide: MqttClientService,
      useValue: null
    }
  ]
};
