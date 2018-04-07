import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { TenantRoutingModule } from './tenant-routing.module';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { AuthGuardTenant } from '../../auth-guard-tenant.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TenantRoutingModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [ AuthGuardTenant ]
})

export class TenantModule { }
