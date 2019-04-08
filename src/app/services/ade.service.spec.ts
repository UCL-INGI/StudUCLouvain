import { TestBed } from '@angular/core/testing';

import { AdeService } from './ade.service';

describe('AdeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdeService = TestBed.get(AdeService);
    expect(service).toBeTruthy();
  });
});
