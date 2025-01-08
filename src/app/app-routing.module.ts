import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RoomControlPageComponent} from "./pages/room-control-page/room-control-page.component";


export const routes: Routes = [

  {path: "control", component: RoomControlPageComponent},
  {path: "**", redirectTo: "control"}

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
