import { AdminComponent } from './admin.component';
import { ReportsComponent } from './reports.component';
import { NgModule }     from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AuthGuardTenant } from '../auth-guard-tenant.service';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'reports', component:ReportsComponent }
        ]
      }
    ]
  },
  { path: 'signup', 
    component: SignupComponent,
    canActivate: [AuthGuardTenant] },
  { path: 'signin', 
    component: SigninComponent,
    canActivate: [AuthGuardTenant]

   }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {}
