import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IrRecordModalComponent } from "./ir-record-modal.component";

describe("IrRecordModalComponent", () => {
  let component: IrRecordModalComponent;
  let fixture: ComponentFixture<IrRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IrRecordModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
