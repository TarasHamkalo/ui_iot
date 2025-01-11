import { Injectable } from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
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
    const options = {params: new HttpParams().set("roomId", room.id)};
    return this.http.get<ActionGroup[]>(API_ROUTES.actionGroups.getAll(), options);
  }
}
