import {Component} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {
  ContentContainerComponent
} from "../../components/base/content-container/content-container.component";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {
  ActionRegistrationComponent
} from "../../components/action-registration/action-registration.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {PageRoutes} from "../../app.routes";

@Component({
  selector: "app-room-control-page",
  imports: [
    MatIcon,
    MatTabsModule,
    ContentContainerComponent,
    ActionRegistrationComponent,
    MatToolbar,
    MatIconButton,
  ],
  templateUrl: "./room-control-page.component.html",
  styleUrl: "./room-control-page.component.scss"
})
export class RoomControlPageComponent {

  constructor(protected roomControlContext: RoomControlContextService,
              private router: Router) {
  }

  protected navigateHome() {
    this.roomControlContext.deselectControlledRoom();
    this.router.navigate([`/${PageRoutes.HOME}`]);
  }
}
