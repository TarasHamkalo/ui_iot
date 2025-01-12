import {TestBed} from "@angular/core/testing";

import {SchedulesRepositoryService} from "./schedules-repository.service";

describe("SchedulesRepositoryService", () => {
  let service: SchedulesRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedulesRepositoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
