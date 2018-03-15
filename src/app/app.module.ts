import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { LoginRoutingModule } from './login-routing.module';
import { MessageService } from './message.service';
import { MessageComponent } from './message/message.component';
import { WorkOrderCommentsComponent } from './work-order-comments/work-order-comments.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { WorkOrderService } from './work-order.service';
import { UserService } from './user.service';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';
import { LoginComponent } from './login.component';
import { WorkOrderCreateComponent } from './work-order-create/work-order-create.component';
import { AuthService } from './auth.service';
import { TenantAuthService } from './auth/tenant/tenant-auth.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { TenantModule } from './auth/tenant/tenant.module';
import { WorkOrderDetailEditComponent } from './work-order-detail-edit/work-order-detail-edit.component';
/*
const appRoutes: Routes = [
  { path: 'work-order-list', component: WorkOrdersComponent},
  { path: 'work-order-create', component: WorkOrderComponent },
  { path: 'WorkOrderComments', component: WorkOrderCommentsComponent },
  { path: '**', component: PageNotFoundComponent }
];
*/

var firebaseConfig = {
   apiKey: "AIzaSyC87JhbrxVGMHEUd2pEnUM3jFXxUEantVE",
   authDomain: "hotel-maintenance-9564e.firebaseapp.com",
   databaseURL: "https://hotel-maintenance-9564e.firebaseio.com",
   projectId: "hotel-maintenance-9564e",
   storageBucket: "hotel-maintenance-9564e.appspot.com",
   messagingSenderId: "413985507539"
};

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    WorkOrderCommentsComponent,
    PageNotFoundComponent,
    WorkOrdersComponent,
    WorkOrderDetailComponent,
    LoginComponent,
    WorkOrderCreateComponent,
    WorkOrderDetailEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoginRoutingModule,
    AdminModule,
    TenantModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [WorkOrderService, MessageService, AuthService, UserService, 
    TenantAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
