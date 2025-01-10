import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RoomControlPageComponent } from "./room-control-page.component";

describe("RoomControlComponent", () => {
  let component: RoomControlPageComponent;
  let fixture: ComponentFixture<RoomControlPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomControlPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomControlPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
