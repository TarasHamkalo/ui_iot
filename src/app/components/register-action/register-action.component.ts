import {Component} from '@angular/core';
import {SurfaceComponent} from "../surface/surface.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCardActions, MatCardContent} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-register-action',
  imports: [
    SurfaceComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatCheckbox,
    MatCardContent,
    MatCardActions,
    MatButton,
  ],
  templateUrl: './register-action.component.html',
  styleUrl: './register-action.component.css'
})
export class RegisterActionComponent {

  public readonly actionRegistrationForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.actionRegistrationForm = this.formBuilder.group({
      actionName: ['', [Validators.required, Validators.maxLength(150), Validators.pattern('[a-zA-Z ]*')]],
      mqttTopic: ['', [Validators.required, Validators.maxLength(150), Validators.pattern('[a-zA-Z/]*')]],
      mqttPayload: ['', [Validators.required, Validators.maxLength(650)]],
      mqttRetain: [false],
    });
  }

  public clearForm(): void {
    this.actionRegistrationForm.reset({
      actionName: '',
      mqttTopic: '',
      mqttPayload: '',
      mqttRetain: false,
    });
  }
}
