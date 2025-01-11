import {Component, computed, Input, OnInit, Signal, signal, WritableSignal} from "@angular/core";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle
} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCheckbox} from "@angular/material/checkbox";
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable, MatTableModule
} from "@angular/material/table";
import {MqttAction} from "../../types/mqtt-action";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {ActionGroup} from "../../types/action-group";
import {DisplayableAction} from "../../types/displayable-action";
import {FormsModule} from "@angular/forms";
import {SequencedAction} from "../../types/sequenced-action";

@Component({
  selector: "app-action-control",
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIconButton,
    MatIcon,
    MatButton,
    MatCheckbox,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatCardActions,
    FormsModule,
    MatTableModule,
  ],
  templateUrl: "./action-control.component.html",
  styleUrl: "./action-control.component.css"
})
export class ActionControlComponent implements OnInit {

  @Input({required: true}) public actionGroup: Partial<ActionGroup> = {};

  protected cardMode: "edit" | "control" = "edit";

  protected actionsDisplayedColumns: string[] = [
    "name", "topic", "priority", "active"
  ];

  protected actions: Signal<MqttAction[]> = signal([]);

  protected displayableActions: WritableSignal<DisplayableAction[]> = signal([]);

  public selectedCount = computed(() => this.displayableActions().reduce(
    (agg, cur) => agg + (cur.activated ? 1 : 0),
    0
  ));

  constructor(private roomControlContext: RoomControlContextService) {
  }

  ngOnInit() {
    this.actions = this.roomControlContext.getRoomActions();
    // const actionSnapshot = this.actions();

    const defaultSequenced: SequencedAction = {
      actionId: -1,
      sequenceNumber: Number.MAX_VALUE,
    };

    this.displayableActions.set(
      this.actions().map(mqttAction => {
        let sequenced = this.actionGroup.actions?.find(seq => seq.actionId === mqttAction.id);
        sequenced = sequenced ? sequenced : defaultSequenced;
        return {
          ...mqttAction,
          ...sequenced,
          activated: sequenced.sequenceNumber != Number.MAX_VALUE,
        };
      }).sort(this.sortBySequenceNumberAndActivation),
    );
  }

  public editActions() {
    // сортовані по актів
    // сортовані по sequence number
  }

  protected sortBySequenceNumberAndActivation(a: DisplayableAction, b: DisplayableAction) {
    if (a.activated === b.activated) {
      return a.sequenceNumber - b.sequenceNumber;
    }

    if (a.activated) {
      return -1;
    } else {
      return 1;
    }
  }

  protected moveActionUp(action: DisplayableAction): void {
    if (!action.activated || action.sequenceNumber == 0) {
      return;
    }

    const actions = [...this.displayableActions()];
    actions[action.sequenceNumber - 1].sequenceNumber++;
    actions[action.sequenceNumber].sequenceNumber--;
    this.displayableActions.set(actions.sort(this.sortBySequenceNumberAndActivation));
  }

  protected moveActionDown(action: DisplayableAction): void {
    if (!action.activated ||
        action.sequenceNumber == this.displayableActions().length - 1 ||
        action.sequenceNumber == this.selectedCount() - 1) {
      return;
    }

    const actions = [...this.displayableActions()];
    actions[action.sequenceNumber + 1].sequenceNumber--;
    actions[action.sequenceNumber].sequenceNumber++;
    this.displayableActions.set(actions.sort(this.sortBySequenceNumberAndActivation));
  }

  protected toggleActivation(activated: boolean, targetId: number) {
    this.displayableActions.update(actions =>
      actions.map(action => {
        if (action.id != targetId) {
          return action;
        }

        const selectedCount = this.selectedCount();
        const copy: DisplayableAction = {
          ...action,
          activated: activated,
          sequenceNumber: activated ? selectedCount : Number.MAX_VALUE,
        };

        return copy;
      }).sort(this.sortBySequenceNumberAndActivation)
        .map(((action, index) => index < this.selectedCount() ? {...action, sequenceNumber: index} : action))

    );
  }
}
