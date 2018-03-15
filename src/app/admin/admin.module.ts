import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { AdminComponent }           from './admin.component';
import { AdminDashboardComponent }  from './admin-dashboard.component';
import { ReportsComponent }    from './reports.component';

import { AdminRoutingModule }       from './admin-routing.module';
import { AuthGuard } from '../auth-guard.service';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { SigninComponent } from './signin/signin.component';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    ReportsComponent,
    SignupComponent,
    SigninComponent,
  ],
  providers: [AuthGuard]
})
export class AdminModule {}
