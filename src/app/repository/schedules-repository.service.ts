import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ScheduledActionGroup } from "../types/scheduled-action-group";
import { API_ROUTES } from "./api.routes";

@Injectable({
  providedIn: "root",
})
export class ScheduleRepositoryService {

  constructor(private http: HttpClient) {}

  public getAll(): Observable<ScheduledActionGroup[]> {
    return this.http.get<ScheduledActionGroup[]>(API_ROUTES.schedules.getAll());
  }

  public add(schedule: Partial<ScheduledActionGroup>): Observable<ScheduledActionGroup> {
    return this.http.post<ScheduledActionGroup>(API_ROUTES.schedules.add(), schedule);
  }

  public delete(id: string): Observable<ScheduledActionGroup> {
    return this.http.delete<ScheduledActionGroup>(API_ROUTES.schedules.delete(id));
  }

}
