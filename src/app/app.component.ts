import {Component, OnDestroy} from "@angular/core";
import {MqttWrapperService} from "./services/mqtt-wrapper.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  
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
