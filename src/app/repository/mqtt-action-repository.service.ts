import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MqttAction} from "../types/mqtt-action";
import {API_ROUTES} from "./api.routes";

@Injectable({
  providedIn: "root",
})
export class MqttActionRepositoryService {

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<MqttAction[]> {
    return this.http.get<MqttAction[]>(API_ROUTES.mqttActions.getAll());
  }

  public add(action: Partial<MqttAction>): Observable<MqttAction> {
    console.log(action);
    console.log(API_ROUTES.mqttActions.add());
    return this.http.post<MqttAction>(API_ROUTES.mqttActions.add(), action);
  }

}
