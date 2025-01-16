import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Room} from "../types/room";
import {Observable} from "rxjs";
import {ActionGroup} from "../types/action-group";
import {API_ROUTES} from "./api.routes";

@Injectable({
  providedIn: "root"
})
export class ActionGroupRepositoryService {

  constructor(private http: HttpClient) {
  }

  public getAllByRoomId(room: Room): Observable<ActionGroup[]> {
    return this.http.get<ActionGroup[]>(API_ROUTES.actionGroups.get(room.id));
  }

  public addGroup(group: Partial<ActionGroup>): Observable<ActionGroup> {
    return this.http.post<ActionGroup>(API_ROUTES.actionGroups.add(), group);
  }

  public updateGroup(group: ActionGroup): Observable<ActionGroup> {
    return this.http.put<ActionGroup>(API_ROUTES.actionGroups.update(), group);
  }

  public deleteGroup(group: ActionGroup): Observable<string> {
    return this.http.delete<string>(API_ROUTES.actionGroups.delete(group.id));
  }
}
