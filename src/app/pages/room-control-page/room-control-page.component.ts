import {Component} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {
  ContentContainerComponent
} from "../../components/base/content-container/content-container.component";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {MqttWrapperService} from "../../services/mqtt-wrapper.service";
import {
  ActionRegistrationComponent
} from "../../components/action-registration/action-registration.component";

@Component({
  selector: "app-room-control-page",
  imports: [
    MatIcon,
    MatTabsModule,
    ContentContainerComponent,
    ActionRegistrationComponent,
  ],
  templateUrl: "./room-control-page.component.html",
  styleUrl: "./room-control-page.component.scss"
})
export class RoomControlPageComponent {

  constructor(private roomControlContext: RoomControlContextService,
              private mqttWrapper: MqttWrapperService) {
  }

  send(): void {
    this.mqttWrapper.publish("bin", "MQTT test");
  }
}
