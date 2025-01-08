import { TestBed } from "@angular/core/testing";

import { MqttIrRecorderService } from "./mqtt-ir-recorder.service";

describe("MqttIrRecorderService", () => {
  let service: MqttIrRecorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttIrRecorderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
