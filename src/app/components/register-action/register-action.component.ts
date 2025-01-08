import {Component, inject} from "@angular/core";
import {SurfaceComponent} from "../surface/surface.component";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {
  FormBuilder, FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCardActions, MatCardContent} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MqttActionsService} from "../../services/mqtt-actions.service";
import {MqttIrRecorderService} from "../../services/mqtt-ir-recorder.service";
import {MatDialog} from "@angular/material/dialog";
import {RecordIrModal} from "../record-ir-modal/record-ir-modal.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: "app-register-action",
  imports: [
    SurfaceComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatCheckbox,
    MatCardContent,
    MatCardActions,
    MatButton,
    FormsModule,
    MatTab,
    MatTabGroup,
  ],
  templateUrl: "./register-action.component.html",
  styleUrl: "./register-action.component.css"
})
export class RegisterActionComponent {

  public readonly basicActionInfoFormGroup: FormGroup;

  public readonly payloadFormControl = new FormControl(
    "", [Validators.required, Validators.minLength(650)]
  );

  public step: "info" | "payload" = "payload";


  constructor(private readonly formBuilder: FormBuilder,
  ) {
    this.basicActionInfoFormGroup = this.formBuilder.group({
      actionName: ["", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z ]*")]],
      mqttTopic: ["", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z/]*")]],
      mqttRetain: [false],
    });
  }

  // public onSubmit(formDirective: FormGroupDirective): void {
  //   if (this.basicActionInfoFormGroup.invalid) {
  //     return;
  //   }
  //
  //   this.mqttActionsService.addAction(
  //     {
  //       displayName: this.basicActionInfoFormGroup.controls['actionName'].value,
  //       mqttTopic: this.basicActionInfoFormGroup.controls['mqttTopic'].value,
  //       mqttPayload: this.basicActionInfoFormGroup.controls['mqttPayload'].value,
  //       mqttRetain: this.basicActionInfoFormGroup.controls['mqttRetain'].value,
  //     }
  //   )
  //
  //   this.clearForm(formDirective);
  // }

  // public clearForm(formDirective: FormGroupDirective): void {
  //   this.basicActionInfoFormGroup.reset();
  //   formDirective.resetForm()
  // }

  // public recordIrPayload() {
  //   console.log("recordIrPayload()");
  //   const dialogRef = this.dialog.open(RecordIrModal, {
  //     width: "75%",
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(result);
  //   });
  //
  // }
  public onProceed() {
    if (!this.basicActionInfoFormGroup.invalid) {
      this.step = "payload";
    }
  }
}
