import { TestBed } from "@angular/core/testing";

import { MqttBlindsService } from "./mqtt-blinds.service";

describe("MqttBlindsService", () => {
  let service: MqttBlindsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttBlindsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
