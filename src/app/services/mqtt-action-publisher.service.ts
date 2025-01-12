import {Injectable} from "@angular/core";
import {MqttWrapperService} from "./mqtt-wrapper.service";
import {MqttAction} from "../types/mqtt-action";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MqttActionPublisherService {

  constructor(protected mqttWrapper: MqttWrapperService) {
  }

  public publish(actions: MqttAction[], timeoutMs: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const publishActions = async () => {
        try {
          for (const action of actions) {
            this.mqttWrapper.publish(action.mqttTopic, action.mqttPayload);
            await this.delay(timeoutMs);
          }
          observer.next(true);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      };

      publishActions();
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
