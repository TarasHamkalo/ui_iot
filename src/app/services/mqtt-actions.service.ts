import {Injectable, signal, WritableSignal} from '@angular/core';
import {MqttAction} from "../types/mqtt-action";

@Injectable()
export class MqttActionsService {

  private storedActions = signal<MqttAction[]>([]);
  private idCounter = 0

  constructor() {
  }

  public addAction(action: Partial<MqttAction>): void {

    this.storedActions.update(actions => [
      ...actions,
      {
        ...action,
        id: this.idCounter++
      } as MqttAction
    ]);

    console.log(this.storedActions());
  }

  public getActions(): WritableSignal<MqttAction[]> {
    return this.storedActions;
  }
}
