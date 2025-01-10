export interface MqttAction {

  id: number;

  roomId: number;
  displayName: string;

  mqttTopic: string;
  mqttPayload: string;  // json
  mqttRetain: boolean;

}
