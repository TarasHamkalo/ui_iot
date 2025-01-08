import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {
  ContentContainerComponent
} from "../../components/content-container/content-container.component";
import {RegisterActionComponent} from "../../components/register-action/register-action.component";

@Component({
  selector: 'app-room-control-page',
  imports: [
    MatIcon,
    MatTabsModule,
    ContentContainerComponent,
    RegisterActionComponent
  ],
  templateUrl: './room-control-page.component.html',
  styleUrl: './room-control-page.component.scss'
})
export class RoomControlPageComponent {

}
