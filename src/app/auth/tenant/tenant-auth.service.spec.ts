import { TestBed, inject } from '@angular/core/testing';

import { TenantAuthService } from './tenant-auth.service';

describe('TenantAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenantAuthService]
    });
  });

  it('should be created', inject([TenantAuthService], (service: TenantAuthService) => {
    expect(service).toBeTruthy();
  }));
});
