import {Component, inject, signal} from "@angular/core";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {StringModalComponent} from "../base/string-modal/string-modal.component";
import {concatMap, throwError} from "rxjs";

@Component({
  selector: "app-room-status",
  imports: [
    MatTooltip,
    MatIcon,
    MatIconButton
  ],
  templateUrl: "./room-status.component.html",
  styleUrl: "./room-status.component.css"
})
export class RoomStatusComponent {

  protected deviceId = signal("unknown");

  private dialog = inject(MatDialog);

  protected openDeviceInfoUpdateModal(): void {
    const placeholder = this.deviceId() == "unknown" ? "Provide device id" : this.deviceId();
    const dialogRef = this.dialog.open(StringModalComponent, {
      data: {
        title: "Update device info",
        placeholder: placeholder,
        pattern: "[a-zA-z0-9/]+"
      },
    });


    dialogRef.afterClosed().pipe(
      concatMap(deviceId => {
        if (deviceId !== undefined) {
          this.deviceId.set(deviceId);
        }

        throw throwError(() => new Error("Cancel device id update"));
      }),
    ).subscribe({
      next: console.log,
      error: console.error
    });
  }
}
