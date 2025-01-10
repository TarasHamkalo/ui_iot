import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {RoomControlContextService} from "../context/room-control-context.service";

@Injectable({
  providedIn: "root",
})
export class RoomSelectedGuard implements CanActivate {
  constructor(
    private roomControlContextService: RoomControlContextService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isRoomSelected = this.roomControlContextService.isRoomSelected()();
    if (!isRoomSelected) {
      this.router.navigate(["/home"]); // Redirect to home page if no room is selected
      return false;
    }
    return true;
  }
}
