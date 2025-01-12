import {Component, computed} from "@angular/core";
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
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {SchedulesRepositoryService} from "../../repository/schedules-repository.service";
import {Schedule} from "../../types/schedule";
import {ActionGroup} from "../../types/action-group";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {join} from "@angular/compiler-cli";
import {share} from "rxjs";
import {MatIcon} from "@angular/material/icon";

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
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    DecimalPipe,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    NgIf,
    MatIcon,
  ],
  templateUrl: "./action-schedule.component.html",
  styleUrl: "./action-schedule.component.css"
})
export class ActionScheduleComponent {

  protected days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  protected scheduleFormGroup: FormGroup;

  protected displayedColumns: string[]= ["name", "time", "days", "actions"];

  protected schedules = computed(() => {
    const groups = this.roomControlContextService.getRoomActionGroups()();
    return this.roomControlContextService.getRoomSchedules()().map(schedule => {
      const scheduledGroup = groups.find(g => g.id === schedule.actionGroupId)!;
      return {
        ...schedule,
        displayName: scheduledGroup.displayName,
      } as Schedule & {displayName: string};
    });
  });

  constructor(protected roomControlContextService: RoomControlContextService,
              private schedulesRepositoryService: SchedulesRepositoryService,
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
        next: (schedule: Schedule) => {
          form.resetForm();
          this.roomControlContextService.addSchedule(schedule);
        },
        error: console.error
      });
    }
  }

  protected deleteSchedule(schedule: Schedule) {
    this.schedulesRepositoryService.delete(schedule.id).subscribe({
      next: (schedule: Schedule) => this.roomControlContextService.deleteSchedule(schedule),
      error: console.error
    });
  }

  protected mapDays(schedule: Schedule) {
    return schedule.days.map(d => this.days[d]).join(", ");
  }
}
