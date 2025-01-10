import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { roomSelectedGuard } from "./room-selected.guard";

describe("roomSelectedGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roomSelectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
