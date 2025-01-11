import {SequencedAction} from "./sequenced-action";

export interface ActionGroup {
  id: number;
  displayName: string;
  roomId: number;
  actions: SequencedAction[];
}

