import { TestBed } from "@angular/core/testing";

import { MqttWrapperService } from "./mqtt-wrapper.service";

describe("MqttWrapperService", () => {
  let service: MqttWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttWrapperService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
