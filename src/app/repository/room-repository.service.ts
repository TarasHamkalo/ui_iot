import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Room} from "../types/room";
import {API_ROUTES} from "./api.routes";

@Injectable({
  providedIn: "root"
})
export class RoomRepositoryService {

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(API_ROUTES.rooms.getAll());
  }

  public add(room: Partial<Room>): Observable<Room> {
    return this.http.post<Room>(API_ROUTES.rooms.add(), room);
  }

}