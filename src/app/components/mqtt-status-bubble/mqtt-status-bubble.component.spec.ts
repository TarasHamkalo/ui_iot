import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MqttStatusBubbleComponent } from "./mqtt-status-bubble.component";

describe("MqttStatusBubbleComponent", () => {
  let component: MqttStatusBubbleComponent;
  let fixture: ComponentFixture<MqttStatusBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MqttStatusBubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MqttStatusBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
