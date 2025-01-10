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
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {RoomControlContextService} from "../../context/room-control-context.service";
import {
  MqttStatusBubbleComponent
} from "../../components/mqtt-status-bubble/mqtt-status-bubble.component";
import {PageRoutes} from "../../app.routes";
import {Router} from "@angular/router";

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
    MqttStatusBubbleComponent
  ],
  templateUrl: "./home-page.component.html",
  // styleUrl: "./home-page.component.css"
})
export class HomePageComponent implements OnInit {

  protected loading = false;

  protected rooms: Room[] = [];

  protected roomRegistrationForm: FormGroup;

  constructor(protected readonly roomControlContext: RoomControlContextService,
              private readonly roomRepository: RoomRepositoryService,
              private readonly router: Router,
              private readonly formBuilder: FormBuilder) {
    this.roomRegistrationForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z ]*")]],
      baseMqttTopic: ["", [Validators.required, Validators.maxLength(150), Validators.pattern("[a-zA-Z/]*")]],
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
      error: () => {
        console.error("Failed to fetch rooms");
        this.loading = false;
      },
    });
  }

  public addRoom() {
    if (!this.roomRegistrationForm.invalid) {
      this.roomRepository.add({
        id: Date.now(), // TODO: api should fill this
        name: this.roomRegistrationForm.controls["name"].value,
        baseMqttTopic: this.roomRegistrationForm.controls["baseMqttTopic"].value
      }).subscribe(room => this.rooms.push(room));
    }
  }

  public roomPicked() {
    this.router.navigate([`/${PageRoutes.CONTROL}`]);
  }
}
