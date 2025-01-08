import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {
  RemoteControlPageComponent
} from "./pages/remote-control-page/remote-control-page.component";

export const routes: Routes = [

  {path: "control", component: RemoteControlPageComponent},
  {path: "**", redirectTo: "control"}

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
