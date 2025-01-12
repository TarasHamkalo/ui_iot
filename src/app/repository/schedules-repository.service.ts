import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Schedule} from "../types/schedule";
import {API_ROUTES} from "./api.routes";
import {Room} from "../types/room";

@Injectable({
  providedIn: "root",
})
export class SchedulesRepositoryService {

  constructor(private http: HttpClient) {}

  public getAllByRoomId(room: Room): Observable<Schedule[]> {
    const options = {params: new HttpParams().set("roomId", room.id)};
    return this.http.get<Schedule[]>(API_ROUTES.schedules.getAll(), options);
  }

  public add(schedule: Partial<Schedule>): Observable<Schedule> {
    return this.http.post<Schedule>(API_ROUTES.schedules.add(), schedule);
  }

  public delete(id: string): Observable<Schedule> {
    return this.http.delete<Schedule>(API_ROUTES.schedules.delete(id));
  }

}
