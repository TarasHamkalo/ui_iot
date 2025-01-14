import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WindowBlindsAutoModeComponent } from "./window-blinds-auto-mode.component";

describe("WindowBlindsAutoModeComponent", () => {
  let component: WindowBlindsAutoModeComponent;
  let fixture: ComponentFixture<WindowBlindsAutoModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowBlindsAutoModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowBlindsAutoModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
