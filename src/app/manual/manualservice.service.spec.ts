import { TestBed } from '@angular/core/testing';

import { ManualserviceService } from './manualservice.service';

describe('ManualserviceService', () => {
  let service: ManualserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
