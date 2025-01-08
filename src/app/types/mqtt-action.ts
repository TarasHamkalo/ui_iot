export interface MqttAction {

  id: number;
  displayName: string;

  mqttTopic: string;
  mqttPayload: string;  // json
  mqttRetain: boolean;

}
