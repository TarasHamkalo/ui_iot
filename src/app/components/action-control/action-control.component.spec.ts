import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActionControlComponent } from "./action-control.component";

describe("ActionControlComponent", () => {
  let component: ActionControlComponent;
  let fixture: ComponentFixture<ActionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
