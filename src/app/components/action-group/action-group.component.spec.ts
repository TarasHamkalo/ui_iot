import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActionGroupComponent } from "./action-group.component";

describe("ActionControlComponent", () => {
  let component: ActionGroupComponent;
  let fixture: ComponentFixture<ActionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
