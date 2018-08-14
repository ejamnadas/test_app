import { NgModule }     from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { WorkOrderCreateComponent } from './work-order-create/work-order-create.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth-guard.service';
import { LoginComponent } from './auth/tenant/login/login.component';
import { WorkOrdersTblComponent } from './work-orders-tbl/work-orders-tbl.component';
import { WorkOrderTblDrawerComponent } from './work-order-tbl-drawer/work-order-tbl-drawer.component';
import { WorkOrderCreate2Component } from './work-order-create-2/work-order-create-2.component';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';
import { ObsTestComponent } from './obs-test/obs-test.component';


const appRoutes: Routes = [
  { path: 'work-order-list', 
    //component: WorkOrdersComponent,
    component: WorkOrdersTblComponent,
    canActivate: [AuthGuard],
   // canDeactivate: [CanDeactivateGuard],
    children:[
      {
        path: '',
        component: WorkOrderDetailComponent
      }
    ]
    
  },
  { 
    path: 'work-order-create/:dept_id', 
    component: WorkOrderCreateComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard] 
  },
  { path: 'site-login',
    component: LoginComponent
  },
  { path: '',
    redirectTo: '/work-order-list' ,
    pathMatch: 'full'

  },
  {
    path: 'wo-list-drawer',
    component: WorkOrderTblDrawerComponent
  },
  { path: 'obstest', component: ObsTestComponent
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
  ],
  providers: [
    CanDeactivateGuard
  ]
})

export class AppRoutingModule{

}
