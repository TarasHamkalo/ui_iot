import {Component, OnDestroy} from "@angular/core";
import {MqttWrapperService} from "./services/mqtt-wrapper.service";


@Component({
  selector: "app-root",
  standalone: false,
  template: `
      <app-layout></app-layout>
  `,
})
export class AppComponent implements OnDestroy {

  title = "ui_iot";

  constructor(private mqttWrapper: MqttWrapperService) {}

  ngOnDestroy() {
    this.mqttWrapper.disconnect();
  }

}
