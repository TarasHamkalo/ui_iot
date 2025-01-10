import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActionRegistrationComponent } from "./action-registration.component";

describe("ActionRegistrationComponent", () => {
  let component: ActionRegistrationComponent;
  let fixture: ComponentFixture<ActionRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
