export interface MqttAction {

  id: string;

  // roomId: string;
  displayName: string;

  mqttTopic: string;
  mqttPayload: string;  // json
  mqttRetain: boolean;

}
