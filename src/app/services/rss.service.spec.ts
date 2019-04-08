import { TestBed } from '@angular/core/testing';

import { RssService } from './rss.service';

describe('RssService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RssService = TestBed.get(RssService);
    expect(service).toBeTruthy();
  });
});
