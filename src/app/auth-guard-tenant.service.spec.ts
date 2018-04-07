import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardTenantService } from './auth-guard-tenant.service';

describe('AuthGuardTenantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardTenantService]
    });
  });

  it('should be created', inject([AuthGuardTenantService], (service: AuthGuardTenantService) => {
    expect(service).toBeTruthy();
  }));
});
