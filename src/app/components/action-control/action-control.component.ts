import {
  Component,
  computed,
  effect,
  Input,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from "@angular/core";
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
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MqttAction} from "../../types/mqtt-action";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {ActionGroup} from "../../types/action-group";
import {DisplayableAction} from "../../types/displayable-action";
import {FormsModule} from "@angular/forms";

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
    MatHeaderCellDef,
    MatCellDef,
    FormsModule,
    MatHeaderRowDef,
    MatRowDef
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

  protected displayableActions: WritableSignal<Partial<DisplayableAction>[]> = signal([]);

  public selectedCount = computed(() => this.displayableActions().reduce(
    (agg, cur) => agg + (cur.activated ? 1 : 0),
    0
  ));

  constructor(private roomControlContext: RoomControlContextService) {
  }

  ngOnInit() {
    this.actions = this.roomControlContext.getRoomActions();
    const actionSnapshot = this.actions();
    this.displayableActions.set(
      actionSnapshot.map(mqttAction => {
        const sequence = this.actionGroup.actions?.find(seq => seq.actionId === mqttAction.id);
        return {
          ...mqttAction,
          ...sequence,
          activated: !!sequence,
        };
      })
    );
  }

  public editActions() {
    const actionSnapshot = this.actions();
    this.displayableActions.set(
      actionSnapshot.map(mqttAction => {
        const sequence = this.actionGroup.actions?.find(seq => seq.actionId === mqttAction.id);
        return {
          ...mqttAction,
          ...sequence,
          activated: !!sequence,
        };
      })
    );
  }

  protected moveActionUp(action: MqttAction): void {
    // Logic to move action up in the list
    // const currentActions = this.actions();
    // const index = currentActions.indexOf(action);
    // if (index > 0) {
    //   const updatedActions = [...currentActions];
    //   [updatedActions[index - 1], updatedActions[index]] = [updatedActions[index], updatedActions[index - 1]];
    //   this.actions.set(updatedActions);
    // }
  }

  // protected moveActionDown(action: MqttAction): void {
  //   // Logic to move action down in the list
  //   const currentActions = this.actions();
  //   const index = currentActions.indexOf(action);
  //   if (index < currentActions.length - 1) {
  //     const updatedActions = [...currentActions];
  //     [updatedActions[index + 1], updatedActions[index]] = [updatedActions[index], updatedActions[index + 1]];
  //     this.actions.set(updatedActions);
  //   }
  // }

  protected isActionActive(target: MqttAction): boolean {
    const actions = this.actionGroup.actions?.filter((source) => {
      return source.actionId === target.id;
    });

    return actions !== undefined && actions.length > 0;
  }

  protected toggleActivation(activated: boolean, targetId: number) {
    this.displayableActions.update(actions =>
      actions.map(
        (action => action.id == targetId ? {...action, activated: activated} : action)
      )
    );
  }
}
