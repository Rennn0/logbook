import { TestBed } from '@angular/core/testing';

import { TrafficLightService } from './traffic-light.service';

describe('TrafficLightService', () => {
  let service: TrafficLightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrafficLightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
