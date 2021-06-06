import { TestBed } from '@angular/core/testing';

import { RiotApiService } from './riot-api.service';

describe('RiotApiServiceService', () => {
  let service: RiotApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiotApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
