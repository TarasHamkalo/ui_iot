import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RoomMetricComponent } from "./room-metric.component";

describe("SensorStatusComponent", () => {
  let component: RoomMetricComponent;
  let fixture: ComponentFixture<RoomMetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomMetricComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
