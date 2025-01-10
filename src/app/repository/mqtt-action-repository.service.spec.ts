import { TestBed } from "@angular/core/testing";

import { MqttActionRepositoryService } from "./mqtt-action-repository.service";

describe("MqttActionRepositoryService", () => {
  let service: MqttActionRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttActionRepositoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
