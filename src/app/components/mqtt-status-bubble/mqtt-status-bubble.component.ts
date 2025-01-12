import {Component, effect, EventEmitter, OnInit, Output} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MqttWrapperService} from "../../services/mqtt-wrapper.service";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: "app-mqtt-status-bubble",
  imports: [
    MatIcon,
    MatIconButton,
    MatTooltip
  ],
  templateUrl: "./mqtt-status-bubble.component.html",
  styleUrl: "./mqtt-status-bubble.component.css"
})
export class MqttStatusBubbleComponent implements OnInit {

  @Output() public connected = new EventEmitter<boolean>();

  constructor(public readonly mqttWrapper: MqttWrapperService) {
    effect(() => {
      this.connected.emit(this.mqttWrapper.isConnected());
    });
  }

  ngOnInit(): void {
    this.mqttWrapper.connect();

  }

  public reconnect(): void {
    this.mqttWrapper.connect();
  }
}
