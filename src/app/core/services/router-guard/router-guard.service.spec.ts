import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RouterGuardService } from './router-guard.service';

describe('RouterGuardService', () => {
  let service: RouterGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });
    service = TestBed.inject(RouterGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
