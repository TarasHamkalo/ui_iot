import {Component, Input, signal, WritableSignal} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MqttAction} from "../../types/mqtt-action";
import {DisplayableAction} from "../../types/displayable-action";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MqttActionPublisherService} from "../../services/mqtt-action-publisher.service";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

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
    MatTab
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

  // protected currentAction: WritableSignal<DisplayableAction>;

  constructor(private mqttActionPublisherService: MqttActionPublisherService) {
    // this.currentAction = signal(this.displayableActions().f)
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
