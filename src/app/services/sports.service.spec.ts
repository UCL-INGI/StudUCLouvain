import { TestBed } from '@angular/core/testing';

import { SportsService } from './sports.service';

describe('SportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SportsService = TestBed.get(SportsService);
    expect(service).toBeTruthy();
  });
});
