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
import {MatTableModule} from "@angular/material/table";
import {MqttAction} from "../../types/mqtt-action";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {ActionGroup} from "../../types/action-group";
import {DisplayableAction} from "../../types/displayable-action";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SequencedAction} from "../../types/sequenced-action";
import {ActionGroupRepositoryService} from "../../repository/action-group-repository.service";
import {MatTooltip} from "@angular/material/tooltip";
import {ActionTableComponent} from "../action-table/action-table.component";
import {ActionControlsComponent} from "../action-controls/action-controls.component";

@Component({
  selector: "app-action-group",
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIconButton,
    MatIcon,
    MatButton,
    MatCardActions,
    FormsModule,
    MatTableModule,
    MatTooltip,
    ActionTableComponent,
    ReactiveFormsModule,
    ActionControlsComponent
  ],
  templateUrl: "./action-group.component.html",
  styleUrl: "./action-group.component.css"
})
export class ActionGroupComponent implements OnInit {

  @Input({required: true}) public actionGroup!: ActionGroup;

  protected cardMode: "edit" | "control" = "control";

  protected actions: Signal<MqttAction[]> = signal([]);

  protected displayableActions: WritableSignal<DisplayableAction[]> = signal([]);

  protected selectedCount = computed(() => this.displayableActions().reduce(
    (agg, cur) => agg + (cur.activated ? 1 : 0),
    0
  ));
  constructor(private roomControlContext: RoomControlContextService,
              private actionGroupRepository: ActionGroupRepositoryService) {

    effect(() => {
      this.resetActionData();
    });
  }

  ngOnInit() {
    this.actions = this.roomControlContext.getRoomActions();
  }

  protected combineActionsData(actions: MqttAction[]): DisplayableAction[] {
    const defaultSequenced: SequencedAction = {
      actionId: "undefined",
      sequenceNumber: Number.MAX_VALUE
    };
    return actions.map(mqttAction => {
      let sequenced = this.actionGroup.actions?.find(seq => seq.actionId === mqttAction.id);
      sequenced = sequenced === undefined ? defaultSequenced : sequenced;
      return {
        ...mqttAction,
        ...sequenced,
        activated: sequenced.sequenceNumber !== Number.MAX_VALUE,
      };
    }).sort(this.sortBySequenceNumberAndActivation);
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

  protected toggleCardMode() {
    this.cardMode = this.cardMode === "edit" ? "control" : "edit";
    this.resetActionData();
  }

  protected resetActionData() {
    this.displayableActions.set(
      this.combineActionsData(this.actions())
    );
  }

  protected updateGroup() {
    this.actionGroupRepository.updateGroup({
      ...this.actionGroup,
      actions: this.displayableActions().filter(a => a.activated).map((action, i) => {
        return {
          actionId: action.id,
          sequenceNumber: i
        };
      })
    }).subscribe({
      next: (group) => {
        this.roomControlContext.updateGroup(group);
        this.toggleCardMode();
      },
      error: console.error,
    });
  }

  protected deleteGroup() {
    this.actionGroupRepository.deleteGroup(this.actionGroup).subscribe({
      next: (group) => this.roomControlContext.deleteGroup(group),
    });
  }

}