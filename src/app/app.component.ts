import {Component} from "@angular/core";
import {LayoutComponent} from "./layout/layout.component";

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <app-layout></app-layout>
  `,
  imports: [
    LayoutComponent
  ]
})

export class AppComponent {

  title = "ui_iot";

}
