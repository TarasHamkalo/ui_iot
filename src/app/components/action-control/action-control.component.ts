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
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SequencedAction} from "../../types/sequenced-action";
import {ActionGroupRepositoryService} from "../../repository/action-group-repository.service";
import {MatTooltip} from "@angular/material/tooltip";
import {ActionTableComponent} from "../action-table/action-table.component";
import {MqttActionPublisherService} from "../../services/mqtt-action-publisher.service";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDivider} from "@angular/material/divider";

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
    MatCardActions,
    FormsModule,
    MatTableModule,
    MatTooltip,
    ActionTableComponent,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatDivider,
    MatLabel,
    MatHint
  ],
  templateUrl: "./action-control.component.html",
  styleUrl: "./action-control.component.css"
})
export class ActionControlComponent implements OnInit {

  @Input({required: true}) public actionGroup!: ActionGroup;

  protected cardMode: "edit" | "control" = "control";

  protected actions: Signal<MqttAction[]> = signal([]);

  protected displayableActions: WritableSignal<DisplayableAction[]> = signal([]);

  protected selectedCount = computed(() => this.displayableActions().reduce(
    (agg, cur) => agg + (cur.activated ? 1 : 0),
    0
  ));

  protected timeoutFormControl = new FormControl(
    1000,
    [
      Validators.required,
      Validators.pattern("[0-9]+"),
      Validators.min(1000)
    ]
  );

  protected publishingActions = false;

  constructor(private roomControlContext: RoomControlContextService,
              private actionGroupRepository: ActionGroupRepositoryService,
              private mqttActionPublisherService: MqttActionPublisherService) {

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

  protected publishActions() {
    const actionsToPublish: MqttAction[] = this.displayableActions()
      .filter(a => a.activated)
      .map((action) => action as MqttAction);

    if (actionsToPublish.length > 0) {
      this.publishingActions = true;
      this.mqttActionPublisherService.publish(actionsToPublish, this.timeoutFormControl.value!)
        .subscribe({
          next: () => this.publishingActions = false,
          error: () => this.publishingActions = false,
        });
    }
  }
}