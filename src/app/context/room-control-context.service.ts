import {Injectable, Signal, signal} from "@angular/core";
import {Room} from "../types/room";
import {forkJoin, Observable, Subject} from "rxjs";
import {MqttAction} from "../types/mqtt-action";
import {MqttActionRepositoryService} from "../repository/mqtt-action-repository.service";
import {ActionGroup} from "../types/action-group";
import {ActionGroupRepositoryService} from "../repository/action-group-repository.service";
import {Schedule} from "../types/schedule";
import {SchedulesRepositoryService} from "../repository/schedules-repository.service";

@Injectable({
  providedIn: "root"
})
export class RoomControlContextService {

  private controlledRoom = signal<Partial<Room>>({});

  private roomSelected = signal<boolean>(false);

  private roomActions = signal<MqttAction[]>([]);

  private roomActionGroups = signal<ActionGroup[]>([]);

  private roomSchedules = signal<Schedule[]>([]);

  private preparedSubject = new Subject<boolean>();

  constructor(private readonly actionRepository: MqttActionRepositoryService,
              private readonly actionGroupsRepository: ActionGroupRepositoryService,
              private readonly schedulesRepository: SchedulesRepositoryService) {
  }

  public prepareRoom(): Observable<boolean> {
    // actions: this.actionRepository.getAllByRoomId(this.controlledRoom() as Room),
    forkJoin({
      actions: this.actionRepository.getAll(),
      groups: this.actionGroupsRepository.getAllByRoomId(this.controlledRoom() as Room),
      schedules: this.schedulesRepository.getAllByRoomId(this.controlledRoom() as Room)
    }).subscribe({
      next: (data) => {
        console.log(data);
        this.roomActions.set(data.actions);
        this.roomActionGroups.set(data.groups);
        this.roomSchedules.set(data.schedules);
        this.preparedSubject.next(true);
      },
      error: (error) => {
        console.log(error);
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

  public addGroup(group: ActionGroup) {
    this.roomActionGroups.update(groups => [...groups, group]);
  }

  public updateGroup(target: ActionGroup) {
    this.roomActionGroups.update(groups => groups.map(source => source.id === target.id ? target: source));
  }

  public deleteGroup(targetId: string) {
    this.roomActionGroups.update(groups => groups.filter(source => source.id !== targetId));
  }

  public getRoomActionGroups() {
    return this.roomActionGroups.asReadonly();
  }
  public isRoomSelected(): Signal<boolean> {
    return this.roomSelected.asReadonly();
  }

  public addSchedule(schedule: Schedule) {
    this.roomSchedules.update(schedules => [...schedules, schedule]);
  }

  public deleteSchedule(targetId: string) {
    this.roomSchedules.update(schedules => schedules.filter(source => source.id !== targetId));
  }

  public getRoomSchedules() {
    return this.roomSchedules.asReadonly();
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
    this.roomSchedules.set([]);
  }

}