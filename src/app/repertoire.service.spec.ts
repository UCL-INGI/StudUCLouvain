import { TestBed } from '@angular/core/testing';

import { RepertoireService } from './repertoire.service';

describe('RepertoireService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepertoireService = TestBed.get(RepertoireService);
    expect(service).toBeTruthy();
  });
});
