import {Injectable, Signal, signal} from "@angular/core";
import {Room} from "../types/room";
import {forkJoin, Observable, Subject} from "rxjs";
import {MqttAction} from "../types/mqtt-action";
import {MqttActionRepositoryService} from "../repository/mqtt-action-repository.service";
import {ActionGroup} from "../types/action-group";
import {ActionGroupRepositoryService} from "../repository/action-group-repository.service";

@Injectable({
  providedIn: "root"
})
export class RoomControlContextService {

  private controlledRoom = signal<Partial<Room>>({});

  private roomSelected = signal<boolean>(false);

  private roomActions = signal<MqttAction[]>([]);

  private roomActionGroups = signal<ActionGroup[]>([]);

  private preparedSubject = new Subject<boolean>();

  constructor(private readonly actionRepository: MqttActionRepositoryService,
              private readonly actionGroupsRepository: ActionGroupRepositoryService) {
  }

  public prepareRoom(): Observable<boolean> {
    forkJoin({
      actions: this.actionRepository.getAllByRoomId(this.controlledRoom() as Room),
      groups: this.actionGroupsRepository.getAllByRoomId(this.controlledRoom() as Room)
    }).subscribe({
      next: (data) => {
        console.log(data);
        this.roomActions.set(data.actions);
        this.roomActionGroups.set(data.groups);
        this.preparedSubject.next(true);
      },
      error: () => {
        this.preparedSubject.next(false);
      },
    });

    return this.preparedSubject.asObservable();
  }

  public addActionToContext(action: MqttAction) {
    this.roomActions.update((actions: MqttAction[]) => [...actions, action]);
  }

  public getRoomActions() {
    return this.roomActions.asReadonly();
  }

  public updateGroup(target: ActionGroup) {
    this.roomActionGroups.update(groups => groups.map(source => source.id === target.id ? target: source));
  }

  public deleteGroup(target: ActionGroup) {
    this.roomActionGroups.update(groups => groups.filter(source => source.id !== target.id));
  }

  public getRoomActionGroups() {
    return this.roomActionGroups.asReadonly();
  }

  public setControlledRoom(room: Partial<Room>) {
    if (room) {
      this.roomSelected.set(true);
      this.controlledRoom.set(room);
    }
  }

  public getControlledRoom() {
    return this.controlledRoom.asReadonly();
  }

  public deselectControlledRoom() {
    this.roomSelected.set(false);
    this.controlledRoom.set({});
    this.roomActions.set([]);
    this.roomActionGroups.set([]);
  }

  public isRoomSelected(): Signal<boolean> {
    return this.roomSelected.asReadonly();
  }

}
