import {SequencedAction} from "./sequenced-action";

export interface ActionGroup {
  id: number;
  roomId: number;
  actions: SequencedAction[];
}

