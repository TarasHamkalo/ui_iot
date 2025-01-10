import {Injectable, Signal, signal} from "@angular/core";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {Observable} from "rxjs";
import {RoomControlContextService} from "../context/room-control-context.service";
import {Room} from "../types/room";

@Injectable({providedIn: "root"})
export class MqttWrapperService {

  // e.g. room topic
  // public readonly baseTopic: string = this.roomControlContext.;

  public readonly isConnected = signal<boolean>(false);

  private controlledRoom: Signal<Partial<Room>>;

  constructor(private mqttService: MqttService,
              private _roomControlContext: RoomControlContextService) {
    this.controlledRoom = this._roomControlContext.getControlledRoom();
  }

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
    this.mqttService.unsafePublish(this.withBaseTopic(topic), message, {qos: 1, retain: true});
  }

  public topic(topic: string): Observable<IMqttMessage> {
    return this.mqttService.observe(this.withBaseTopic(topic));
  }

  public withBaseTopic(topic: string): string {
    const baseTopic = "tmp";
    // const baseTopic = this.controlledRoom().baseMqttTopic;

    if (baseTopic !== undefined) {
      return`${baseTopic}/${topic}`;
    }

    return topic;
  }
}
