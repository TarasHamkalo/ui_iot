import {Component, OnInit} from '@angular/core';
import {MqttIrService} from "./services/mqtt-ir.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  // styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'ui_iot';

  constructor(private mqttIrService: MqttIrService) {
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.mqttIrService.createConnection();
  }

  sendMessage(): void {
    this.mqttIrService.publish('kpi/hyperion/th776no', 'Hello, MQTT!');
  }

}
