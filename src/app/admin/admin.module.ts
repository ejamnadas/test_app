import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { AdminComponent }           from './admin.component';
import { AdminDashboardComponent }  from './admin-dashboard.component';
import { ReportsComponent }    from './reports.component';

import { AdminRoutingModule }       from './admin-routing.module';
import { AuthGuard } from '../auth-guard.service';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    ReportsComponent,
  ],
  providers: [AuthGuard]
})
export class AdminModule {}
