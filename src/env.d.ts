declare interface Env {

  readonly NODE_ENV: string;

  readonly NG_APP_MQTT_PROTOCOL: string;
  readonly NG_APP_MQTT_HOSTNAME: string;
  readonly NG_APP_MQTT_PORT: number;

  readonly NG_APP_MQTT_USERNAME: string;
  readonly NG_APP_MQTT_PASSWORD: string;

}

declare interface ImportMeta {

  readonly env: Env;

}
