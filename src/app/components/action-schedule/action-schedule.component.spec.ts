import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActionScheduleComponent } from "./action-schedule.component";

describe("ActionScheduleComponent", () => {
  let component: ActionScheduleComponent;
  let fixture: ComponentFixture<ActionScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
