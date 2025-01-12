import {Component} from "@angular/core";
import {ContentContainerComponent} from "../base/content-container/content-container.component";
import {SurfaceComponent} from "../base/surface/surface.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from "@angular/material/timepicker";
import {MatInput} from "@angular/material/input";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {ScheduleRepositoryService} from "../../repository/schedules-repository.service";

@Component({
  selector: "app-action-schedule",
  imports: [
    ContentContainerComponent,
    SurfaceComponent,
    MatFormField,
    MatSelect,
    MatOption,
    MatTimepickerToggle,
    MatTimepicker,
    MatTimepickerInput,
    MatInput,
    MatChipListbox,
    FormsModule,
    NgForOf,
    MatLabel,
    MatChipOption,
    MatButton,
    ReactiveFormsModule,
  ],
  templateUrl: "./action-schedule.component.html",
  styleUrl: "./action-schedule.component.css"
})
export class ActionScheduleComponent {

  protected days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  protected scheduleFormGroup: FormGroup;

  constructor(protected roomControlContextService: RoomControlContextService,
              private schedulesRepositoryService: ScheduleRepositoryService,
              private formBuilder: FormBuilder) {
    this.scheduleFormGroup = this.formBuilder.group({
      time: [null, [Validators.required]],
      actionGroup: [null, [Validators.required]],
      selectedDays: [[], [Validators.required]],
    });
  }

  protected onSubmit(form: FormGroupDirective) {
    if (this.scheduleFormGroup.valid) {
      const date: Date = this.scheduleFormGroup.controls["time"].value;
      this.schedulesRepositoryService.add({
        actionGroupId: this.scheduleFormGroup.controls["actionGroup"].value.id,
        days: this.scheduleFormGroup.controls["selectedDays"].value,
        hours: date.getHours(),
        minutes: date.getMinutes(),
      }).subscribe({
        next: () => form.resetForm(),
        error: console.error
      });
    }
  }
}
