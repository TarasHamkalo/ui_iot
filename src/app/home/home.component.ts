import {Component, signal} from "@angular/core";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: "app-home",
  imports: [
    MatSidenav, MatSidenavContainer, MatSidenavContent, RouterOutlet
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css"
})
export class HomeComponent {

  public isSidenavOpen = signal(false);

  public toggleSideNav() {
    this.isSidenavOpen.update(b => !b);
  }

}
