import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecordIrModal } from "./record-ir-modal.component";

describe("ViewAnalysisModalComponent", () => {
  let component: RecordIrModal;
  let fixture: ComponentFixture<RecordIrModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordIrModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordIrModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
