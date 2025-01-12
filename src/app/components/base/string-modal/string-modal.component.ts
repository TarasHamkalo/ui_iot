import {Component, inject, Input, model} from "@angular/core";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: "app-string-modal",
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatInput,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle
  ],
  templateUrl: "./string-modal.component.html",
  styleUrl: "./string-modal.component.css"
})
export class StringModalComponent {

  protected readonly dialogRef = inject(MatDialogRef<StringModalComponent>);

  protected readonly data = inject(MAT_DIALOG_DATA);

  protected readonly title = this.data.title;

  protected readonly placeholder = this.data.placeholder;

  protected readonly alphaString = new FormControl(
    "", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z ]*")]
  );

  protected onSubmit(value: string) {
    this.dialogRef.close(value);
  }

}
