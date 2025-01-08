import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";

@Component({
  selector: 'app-room-control-page',
  imports: [
    MatIcon,
    MatFabButton,
    MatTab,
    MatTabLabel,
    MatTabGroup
  ],
  templateUrl: './room-control-page.component.html',
  styleUrl: './room-control-page.component.css'
})
export class RoomControlPageComponent {

}
