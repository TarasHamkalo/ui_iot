import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Schedule} from "../types/schedule";
import {API_ROUTES} from "./api.routes";
import {Room} from "../types/room";

@Injectable({
  providedIn: "root",
})
export class SchedulesRepositoryService {

  constructor(private http: HttpClient) {
  }

  public getAllByRoomId(room: Room): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(API_ROUTES.schedules.get(room.id));
  }

  public add(schedule: Partial<Schedule>): Observable<Schedule> {
    console.log(schedule);
    return this.http.post<Schedule>(API_ROUTES.schedules.add(), schedule);
  }

  public delete(id: string): Observable<string> {
    return this.http.delete<string>(API_ROUTES.schedules.delete(id));
  }

}
