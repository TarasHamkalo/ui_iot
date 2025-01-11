import { TestBed } from "@angular/core/testing";

import { ActionGroupRepositoryService } from "./action-group-repository.service";

describe("ActionGroupRepositoryService", () => {
  let service: ActionGroupRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionGroupRepositoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
