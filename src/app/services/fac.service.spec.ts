import { TestBed } from '@angular/core/testing';

import { FacService } from './fac.service';

describe('FacService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacService = TestBed.get(FacService);
    expect(service).toBeTruthy();
  });
});
