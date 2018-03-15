import { NgModule }     from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { WorkOrderCreateComponent } from './work-order-create/work-order-create.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth-guard.service';
import { LoginComponent } from './auth/tenant/login/login.component';

const appRoutes: Routes = [
  { path: 'work-order-list', 
    component: WorkOrdersComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'work-order-create', 
    component: WorkOrderCreateComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'site-login',
    component: LoginComponent
  },
  { path: '**', component: PageNotFoundComponent,
    canActivate:[AuthGuard] 
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule{

}
