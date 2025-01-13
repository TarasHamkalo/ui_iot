import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AcAutoModeComponent } from "./ac-auto-mode.component";

describe("AcAutoModeComponent", () => {
  let component: AcAutoModeComponent;
  let fixture: ComponentFixture<AcAutoModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcAutoModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcAutoModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
