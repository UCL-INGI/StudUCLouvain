import { TestBed } from '@angular/core/testing';

import { StudiesService } from './studies.service';

describe('StudiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudiesService = TestBed.get(StudiesService);
    expect(service).toBeTruthy();
  });
});
