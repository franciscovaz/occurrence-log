import { TestBed } from '@angular/core/testing';

import { ApiRequestsService } from './api-requests.service';

describe('ApiRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiRequestsService = TestBed.get(ApiRequestsService);
    expect(service).toBeTruthy();
  });
});
