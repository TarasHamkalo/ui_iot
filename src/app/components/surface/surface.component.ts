import {Component, Input} from "@angular/core";

@Component({
  selector: "app-surface",
  imports: [],
  templateUrl: "./surface.component.html",
  styleUrl: "./surface.component.css"
})
export class SurfaceComponent {

  @Input() public title = "Default Title";

  @Input() public subtitle = "Default subtitle";

  @Input() public isTitleCentered = false;

  @Input() public isHorizontal = false;

}
