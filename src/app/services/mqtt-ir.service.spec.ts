import { TestBed } from '@angular/core/testing';

import { MqttIrService } from './mqtt-ir.service';

describe('MqqtIrService', () => {
  let service: MqttIrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttIrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
