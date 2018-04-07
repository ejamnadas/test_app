import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const tenantRoutes: Routes = [
    {
        path: 'company-login',
        component: LoginComponent
    }
];

@NgModule({
    imports: [
      RouterModule.forChild(tenantRoutes)
    ],
    exports: [
      RouterModule
    ]
  })
  export class TenantRoutingModule {}
  