import {Component, OnInit, Signal, signal} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {
  ContentContainerComponent
} from "../../components/base/content-container/content-container.component";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {PageRoutes} from "../../app.routes";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import {ActionGroup} from "../../types/action-group";
import {ActionControlComponent} from "../../components/action-control/action-control.component";
import {
  ActionRegistrationComponent
} from "../../components/action-registration/action-registration.component";

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
    ActionControlComponent,
    ActionRegistrationComponent,
  ],
  templateUrl: "./room-control-page.component.html",
  styleUrl: "./room-control-page.component.scss"
})
export class RoomControlPageComponent implements OnInit {

  protected roomPrepared = false;

  protected actionGroups: Signal<ActionGroup[]> = signal<ActionGroup[]>([]);

  constructor(protected roomControlContext: RoomControlContextService,
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

    this.actionGroups = this.roomControlContext.getRoomGroups();
  }

  protected navigateHome() {
    this.roomControlContext.deselectControlledRoom();
    this.router.navigate([`/${PageRoutes.HOME}`]);
  }
}
