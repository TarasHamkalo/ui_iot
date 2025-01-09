import { TestBed } from "@angular/core/testing";

import { RoomRepositoryService } from "./room-repository.service";

describe("RoomRepositoryService", () => {
  let service: RoomRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomRepositoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
