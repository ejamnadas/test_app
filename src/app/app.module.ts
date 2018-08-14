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
import { MatButtonModule, MatCheckboxModule, MatTable, MatTableModule, MatPaginator, MatPaginatorModule, MatListModule, MatCardModule,
  MatFormFieldModule, 
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatOptgroup,
  MatDrawer,
  MatDrawerContainer,
  MatSidenavModule,
  MatTooltipModule,
  MatIconModule,
  MatMenuModule,
  MatAutocomplete
  } from '@angular/material';
   
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { WorkOrdersTblComponent } from './work-orders-tbl/work-orders-tbl.component'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { WorkOrderTblDrawerComponent } from './work-order-tbl-drawer/work-order-tbl-drawer.component';
import { DialogService } from './dialog.service';
import { WorkOrderCreate2Component } from './work-order-create-2/work-order-create-2.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ObsTestComponent } from './obs-test/obs-test.component';
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
    WorkOrderDetailEditComponent,
    WorkOrdersTblComponent,
    WorkOrderTblDrawerComponent,
    WorkOrderCreate2Component,
    ObsTestComponent
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
    AngularFirestoreModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule, MatOptionModule, MatSidenavModule, MatTooltipModule, MatIconModule, MatButtonModule,
    MatMenuModule, MatAutocompleteModule
  ],
  providers: [WorkOrderService, MessageService, AuthService, UserService, 
    TenantAuthService, DialogService, {provide: LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
