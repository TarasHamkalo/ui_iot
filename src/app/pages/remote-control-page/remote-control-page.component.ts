import { Component } from '@angular/core';
import {SurfaceComponent} from "../../components/surface/surface.component";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";

@Component({
  selector: 'app-remote-control-page',
  imports: [
    SurfaceComponent,
    MatIcon,
    MatFabButton
  ],
  templateUrl: './remote-control-page.component.html',
  styleUrl: './remote-control-page.component.css'
})
export class RemoteControlPageComponent {

}
