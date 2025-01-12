import { TestBed } from "@angular/core/testing";

import { MqttActionPublisherService } from "./mqtt-action-publisher.service";

describe("MqttActionPublisherService", () => {
  let service: MqttActionPublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttActionPublisherService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
