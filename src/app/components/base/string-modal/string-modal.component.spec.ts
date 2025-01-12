import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StringModalComponent } from "./string-modal.component";

describe("StringModalComponentComponent", () => {
  let component: StringModalComponent;
  let fixture: ComponentFixture<StringModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StringModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
