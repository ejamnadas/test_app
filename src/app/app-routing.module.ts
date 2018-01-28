import { NgModule }     from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { WorkOrderCreateComponent } from './work-order-create/work-order-create.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminComponent } from './admin/admin.component';

const appRoutes: Routes = [
  { path: 'work-order-list', component: WorkOrdersComponent},
  { path: 'work-order-create', component: WorkOrderCreateComponent },
  { path: '**', component: PageNotFoundComponent }
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
