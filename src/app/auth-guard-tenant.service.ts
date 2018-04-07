import { TenantAuthService } from './auth/tenant/tenant-auth.service';
import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
}                           from '@angular/router';
import { MessageService } from './message.service'

@Injectable()
export class AuthGuardTenant {


  constructor(private authService: TenantAuthService, private router: Router,
    private messageService: MessageService) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  let url: string = state.url;

  return this.checkLogin(url);
}

canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  return this.canActivate(route, state);
}

checkLogin(url: string): boolean {
  if (this.authService.isAuthenticated()) { return true; }

  // Store the attempted URL for redirecting
  this.authService.redirectUrl = url;

  this.messageService.add('Unable to access: please log in.');

  // Navigate to the login page with extras

  this.router.navigate(['/company-login']);
  return false;
}


}
