import { TestBed } from "@angular/core/testing";

import { RoomControlContextService } from "./room-control-context.service";

describe("RoomControlContextService", () => {
  let service: RoomControlContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomControlContextService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
