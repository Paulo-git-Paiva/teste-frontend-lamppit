import { TestBed } from '@angular/core/testing';

import { ConectService } from './conect.service';

describe('ConectService', () => {
  let service: ConectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
