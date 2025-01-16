import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {MqttAction} from "../types/mqtt-action";
import {API_ROUTES} from "./api.routes";
import {Room} from "../types/room";

@Injectable({
  providedIn: "root",
})
export class MqttActionRepositoryService {

  constructor(private http: HttpClient) {
  }

  // public getAllByRoomId(room: Room): Observable<MqttAction[]> {
  //   const options = {params: new HttpParams().set("roomId", room.id)};
  //   return this.http.get<MqttAction[]>(API_ROUTES.mqttActions.getAll(), options);
  // }

  public add(action: Partial<MqttAction>): Observable<MqttAction> {
    return this.http.post<MqttAction>(API_ROUTES.mqttActions.add(), action);
  }

  public getAll(): Observable<MqttAction[]>  {
    return this.http.get<MqttAction[]>(API_ROUTES.mqttActions.add());
  }
}
