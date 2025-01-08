import {Component} from "@angular/core";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {SurfaceComponent} from "../surface/surface.component";

@Component({
  selector: "app-record-ir-modal",
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule,
    SurfaceComponent
  ],
  templateUrl: "./record-ir-modal.component.html",
  styleUrl: "./record-ir-modal.component.css"
})
export class RecordIrModal {

  public readonly irDeviceIdFormContorl = new FormControl(
    "ir", [Validators.required, Validators.minLength(3)]
  );

  // public indeterminateProgressState = signal("Extrakcia súborov");
  //
  // public mode = signal<ProgressBarMode>("indeterminate");
  //
  // public progressValue = signal(0);
  //
  // private progressInterval: any;
  //
  // ngOnInit() {
  //   setTimeout(() => {
  //     this.mode.set("determinate");
  //     this.startProgressAnimation();
  //   }, 1000);
  // }
  //
  // private startProgressAnimation() {
  //   this.progressInterval = setInterval(() => {
  //     const newValue = this.progressValue() + 5;
  //     this.progressValue.set(newValue);
  //
  //     if (newValue >= 100) {
  //       clearInterval(this.progressInterval);
  //       this.onComplete();
  //     }
  //   }, 200);
  // }
  //
  // ngOnDestroy() {
  //   if (this.progressInterval) {
  //     clearInterval(this.progressInterval); // Ensure interval is cleared
  //   }
  // }
  //
  // private onComplete() {
  //   this.indeterminateProgressState.set("Analýza dokončená");
  // }
}
