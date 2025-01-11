import {Component, Input, OnInit, Signal, signal} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem} from "@angular/material/list";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MqttAction} from "../../types/mqtt-action";
import {MqttActionRepositoryService} from "../../repository/mqtt-action-repository.service";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {ActionGroup} from "../../types/action-group";

@Component({
  selector: "app-action-control",
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIconButton,
    MatIcon,
    MatButton,
    MatList,
    MatListItem,
    MatCheckbox,
    MatTable
  ],
  templateUrl: "./action-control.component.html",
  styleUrl: "./action-control.component.css"
})
export class ActionControlComponent implements OnInit {

  protected cardMode: "edit" | "control" = "edit";


  protected actionsDisplayedColumns: string[] = [
    "name", "topic", "active"
  ];

  protected actions: Signal<MqttAction[]> = signal([]);

  @Input({required: true}) public actionGroup: Partial<ActionGroup> = {};
  // protected actionsDataSource: MatTableDataSource<MqttAction> | null;

  constructor(private roomControlContext: RoomControlContextService,
             ) {
  }

  ngOnInit() {
    this.actions = this.roomControlContext.getRoomActions();
  }


}
