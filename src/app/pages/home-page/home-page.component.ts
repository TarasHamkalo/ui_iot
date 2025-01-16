import {Component, OnInit} from "@angular/core";
import {SurfaceComponent} from "../../components/base/surface/surface.component";
import {
  ContentContainerComponent
} from "../../components/base/content-container/content-container.component";
import {RoomRepositoryService} from "../../repository/room-repository.service";
import {Room} from "../../types/room";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatButton} from "@angular/material/button";
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {
  MqttStatusBubbleComponent
} from "../../components/mqtt-status-bubble/mqtt-status-bubble.component";
import {PageRoutes} from "../../app.routes";
import {Router} from "@angular/router";
import {connectable} from "rxjs";
import {AcAutoModeComponent} from "../../components/ac-auto-mode/ac-auto-mode.component";

@Component({
  selector: "app-home-page",
  imports: [
    SurfaceComponent,
    ContentContainerComponent,
    MatFormField,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatProgressBar,
    MatButton,
    ReactiveFormsModule,
    MatInput,
    MqttStatusBubbleComponent,
    AcAutoModeComponent
  ],
  templateUrl: "./home-page.component.html",
  // styleUrl: "./home-page.component.css"
})
export class HomePageComponent implements OnInit {

  protected loading = false;

  protected mqttBrokerConnected = false;

  protected rooms: Room[] = [];

  protected roomRegistrationForm: FormGroup;

  constructor(protected readonly roomControlContext: RoomControlContextService,
              private readonly roomRepository: RoomRepositoryService,
              private readonly router: Router,
              private readonly formBuilder: FormBuilder) {
    this.roomRegistrationForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z ]*")]],
      baseMqttTopic: ["", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z0-9/]*")]],
    });
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  private loadRooms(): void {
    this.loading = true;
    // TODO: this to popup
    this.roomRepository.getAll().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error("Failed to fetch rooms", error);
        this.loading = false;
      },
    });
  }

  public addRoom(form: FormGroupDirective) {
    if (!this.roomRegistrationForm.invalid) {
      this.roomRepository.add({
        name: this.roomRegistrationForm.controls["name"].value,
        baseMqttTopic: this.roomRegistrationForm.controls["baseMqttTopic"].value
      }).subscribe(room => {
        this.rooms.push(room);
        form.resetForm();
      });
    }
  }

  public roomPicked() {
    this.router.navigate([`/${PageRoutes.CONTROL}`]);
  }

  protected setConnected(connected: boolean) {
    console.log(connected);
    this.mqttBrokerConnected = connected;
  }
}
