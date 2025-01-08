import {Component, OnDestroy} from "@angular/core";
import {MqttWrapperService} from "./services/mqtt-wrapper.service";


@Component({
  selector: "app-root",
  standalone: false,
  template: `
    <div class="app-layout">
      <app-header/>
      <main class="content">
<!--        <app-home #home/>-->
        <router-outlet></router-outlet>
      </main>
    </div>
  `,

  styles: `
    .app-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex-grow: 1;
      padding-top: 64px;
    }
  `
})
export class AppComponent implements OnDestroy {

  title = "ui_iot";

  constructor(private mqttWrapper: MqttWrapperService) {}

  sendMessage(): void {
    this.mqttWrapper.publish("kpi/hyperion", "Hello, MQTT!");
  }

  ngOnDestroy() {
    this.mqttWrapper.disconnect();
  }

}
