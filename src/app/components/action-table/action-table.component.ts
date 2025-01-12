import {Component, computed, Input, WritableSignal} from "@angular/core";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCheckbox} from "@angular/material/checkbox";
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableModule
} from "@angular/material/table";
import {FormsModule} from "@angular/forms";
import {DisplayableAction} from "../../types/displayable-action";

@Component({
  selector: "app-action-table",
  imports: [
    MatIconButton,
    MatIcon,
    MatCheckbox,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    FormsModule,
    MatTableModule,

  ],
  templateUrl: "./action-table.component.html",
  styleUrl: "./action-table.component.css"
})
export class ActionTableComponent {

  @Input({required: true}) public displayableActions!: WritableSignal<DisplayableAction[]>;

  @Input({required: true}) public sortFunction!: (a: DisplayableAction, b: DisplayableAction) => number;

  protected actionsDisplayedColumns: string[] = [
    "name", "topic", "priority", "active"
  ];

  protected selectedCount = computed(() => this.displayableActions().reduce(
    (agg, cur) => agg + (cur.activated ? 1 : 0),
    0
  ));

  protected moveActionUp(action: DisplayableAction): void {
    if (!action.activated || action.sequenceNumber == 0) {
      return;
    }

    const actions = [...this.displayableActions()];
    actions[action.sequenceNumber - 1].sequenceNumber++;
    actions[action.sequenceNumber].sequenceNumber--;
    this.displayableActions.set(actions.sort(this.sortFunction));
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
    this.displayableActions.set(actions.sort(this.sortFunction));
  }

  protected toggleActivation(activated: boolean, targetId: string) {
    this.displayableActions.update(actions =>
      actions.map(action => {
        if (action.id !== targetId) {
          return action;
        }

        const selectedCount = this.selectedCount();
        const copy: DisplayableAction = {
          ...action,
          activated: activated,
          sequenceNumber: activated ? selectedCount : Number.MAX_VALUE,
        };

        return copy;
      }).sort(this.sortFunction)
        .map(((action, index) => index < this.selectedCount() ? {
          ...action,
          sequenceNumber: index
        } : action))
    );
  }


}
