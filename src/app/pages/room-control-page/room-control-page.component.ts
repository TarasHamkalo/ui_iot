import {Component, inject, OnInit} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {
  ContentContainerComponent
} from "../../components/base/content-container/content-container.component";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {MatToolbar} from "@angular/material/toolbar";
import {MatFabButton, MatIconButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {PageRoutes} from "../../app.routes";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import {
  ActionRegistrationComponent
} from "../../components/action-registration/action-registration.component";
import {ActionGroupRepositoryService} from "../../repository/action-group-repository.service";
import {MatDialog} from "@angular/material/dialog";
import {StringModalComponent} from "../../components/base/string-modal/string-modal.component";
import {concatMap, throwError} from "rxjs";
import {ActionGroupComponent} from "../../components/action-group/action-group.component";

@Component({
  selector: "app-room-control-page",
  imports: [
    MatIcon,
    MatTabsModule,
    ContentContainerComponent,
    MatToolbar,
    MatIconButton,
    MatProgressSpinner,
    NgIf,
    SurfaceComponent,
    ActionRegistrationComponent,
    MatFabButton,
    ActionGroupComponent,
  ],
  templateUrl: "./room-control-page.component.html",
  styleUrl: "./room-control-page.component.scss"
})
export class RoomControlPageComponent implements OnInit {

  protected roomPrepared = false;

  private dialog = inject(MatDialog);

  constructor(protected roomControlContext: RoomControlContextService,
              private actionGroupRepository: ActionGroupRepositoryService,
              private router: Router) {
  }

  ngOnInit() {
    this.roomControlContext.prepareRoom().subscribe(success => {
      if (success) {
        this.roomPrepared = true;
      } else {
        console.error("Was not able to prepare room");
        this.router.navigate([`/${PageRoutes.HOME}`]);
      }
    });

  }

  protected navigateHome() {
    this.roomControlContext.deselectControlledRoom();
    this.router.navigate([`/${PageRoutes.HOME}`]);
  }

  protected openGroupCreationDialog(): void {
    const dialogRef = this.dialog.open(StringModalComponent, {
      data: {title: "Create action group", placeholder: "Enter it's name"},
    });


    dialogRef.afterClosed().pipe(
      concatMap(groupName => {
          if (groupName !== undefined) {
            return this.actionGroupRepository.addGroup({
              roomId: this.roomControlContext.getControlledRoom()().id!,
              displayName: groupName,
              actions: []
            });
          }

          throw throwError(() => new Error("Cancel group creation"));
      }),
    ).subscribe({
      next: (group) => this.roomControlContext.addGroup(group),
      error: console.error
    });
  }
}
