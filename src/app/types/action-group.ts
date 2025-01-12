import {SequencedAction} from "./sequenced-action";

export interface ActionGroup {
  id: string;
  displayName: string;
  roomId: string;
  actions: SequencedAction[];
}

