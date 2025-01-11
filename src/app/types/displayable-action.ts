import {MqttAction} from "./mqtt-action";
import {SequencedAction} from "./sequenced-action";
import {ActivatableAction} from "./activatable-action";

export type DisplayableAction = MqttAction & SequencedAction & ActivatableAction;
