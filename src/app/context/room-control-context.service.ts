import {Injectable, Signal, signal} from "@angular/core";
import {Room} from "../types/room";

@Injectable({
  providedIn: "root"
})
export class RoomControlContextService {

  public controlledRoom = signal<Partial<Room>>({});

  private roomSelected = signal<boolean>(false);

  public setControlledRoom(room: Partial<Room>) {
    if (room) {
      this.roomSelected.set(true);
      this.controlledRoom.set(room);
    }
  }

  public deselectControlledRoom() {
    this.roomSelected.set(false);
    this.controlledRoom.set({});
  }

  public isRoomSelected(): Signal<boolean> {
    return this.roomSelected.asReadonly();
  }
}
