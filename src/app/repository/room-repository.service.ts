import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Room} from "../types/room";

@Injectable({
  providedIn: "root"
})
export class RoomRepositoryService {

  private readonly API_BASE_URL = import.meta.env.NG_APP_API_BASE_URL;

  private readonly API_ROUTES = {
    getRooms: () => `${this.API_BASE_URL}/rooms`,
    addRoom: () => `${this.API_BASE_URL}/rooms`
  };

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.API_ROUTES.getRooms());
  }

  public add(room: Partial<Room>): Observable<Room> {
    return this.http.post<Room>(this.API_ROUTES.addRoom(), room);
  }

}