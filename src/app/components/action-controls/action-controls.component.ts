import {Component, computed, Input, WritableSignal} from "@angular/core";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MqttAction} from "../../types/mqtt-action";
import {DisplayableAction} from "../../types/displayable-action";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MqttActionPublisherService} from "../../services/mqtt-action-publisher.service";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-action-controls",
  imports: [
    MatIcon,
    MatButton,
    FormsModule,
    MatTableModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatTabGroup,
    MatTab,
    NgIf,
    MatIconButton
  ],
  templateUrl: "./action-controls.component.html",
  styleUrl: "./action-controls.component.css"
})
export class ActionControlsComponent {

  @Input({required: true}) public displayableActions!: WritableSignal<DisplayableAction[]>;

  protected timeoutFormControl = new FormControl(
    1000,
    [
      Validators.required,
      Validators.pattern("[0-9]+"),
      Validators.min(1000)
    ]
  );

  protected publishingActions = false;

  protected activeActions = computed(() => {
    return this.displayableActions()
      .filter(a => a.activated)
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  });

  protected lastAction = -1;

  constructor(private mqttActionPublisherService: MqttActionPublisherService) {

  }

  protected publishAll() {
    const actions: MqttAction[] = this.displayableActions()
      .filter(a => a.activated)
      .map((action) => action as MqttAction);

    this.publish(actions);
  }

  protected next() {
    const activeLength = this.activeActions().length;
    if (activeLength > 0 && this.lastAction < activeLength - 1) {
      // console.log(this.activeActions().at(this.lastAction + 1));
      this.publish([this.activeActions().at(this.lastAction + 1)!]);
      this.lastAction++;
    }

    console.log(this.lastAction);
  }

  protected prev() {
    const activeLength = this.activeActions().length;
    if (activeLength > 0 && this.lastAction > 0) {
      // console.log(this.activeActions().at(this.lastAction - 1));
      this.publish([this.activeActions().at(this.lastAction - 1)!]);
      this.lastAction--;
    }

  }

  private publish(actions: MqttAction[]) {
    if (actions.length > 0) {
      this.publishingActions = true;
      this.mqttActionPublisherService.publish(actions, this.timeoutFormControl.value!)
        .subscribe({
          next: () => this.publishingActions = false,
          error: () => this.publishingActions = false,
        });
    }
  }
}
