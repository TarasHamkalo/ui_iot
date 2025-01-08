import { TestBed } from '@angular/core/testing';

import { MqttActionsService } from './mqtt-actions.service';

describe('MqttActionsService', () => {
  let service: MqttActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
