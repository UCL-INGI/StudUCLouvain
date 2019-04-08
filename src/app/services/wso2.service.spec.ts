import { TestBed } from '@angular/core/testing';

import { Wso2Service } from './wso2.service';

describe('Wso2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Wso2Service = TestBed.get(Wso2Service);
    expect(service).toBeTruthy();
  });
});
