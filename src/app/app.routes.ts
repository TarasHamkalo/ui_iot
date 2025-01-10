import {Routes} from "@angular/router";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {RoomControlPageComponent} from "./pages/room-control-page/room-control-page.component";
import {RoomSelectedGuard} from "./guards/room-selected.guard";

export enum PageRoutes {
  NONE = "#",
  HOME = "home",
  CONTROL = "control",
}

export const routes: Routes = [
  {path: PageRoutes.HOME, component: HomePageComponent},
  {path: PageRoutes.CONTROL, component: RoomControlPageComponent,  canActivate: [RoomSelectedGuard]},
  {path: "**", redirectTo: "home"}
];
