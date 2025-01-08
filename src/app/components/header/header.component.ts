import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: "app-header",
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css"
})
export class HeaderComponent {

  @Input() public title = "Remote Control";

  @Output() public menuToggle = new EventEmitter<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

}
