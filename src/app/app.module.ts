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
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';
import { LoginComponent } from './login.component';
import { WorkOrderCreateComponent } from './work-order-create/work-order-create.component';

/*
const appRoutes: Routes = [
  { path: 'work-order-list', component: WorkOrdersComponent},
  { path: 'work-order-create', component: WorkOrderComponent },
  { path: 'WorkOrderComments', component: WorkOrderCommentsComponent },
  { path: '**', component: PageNotFoundComponent }
];
*/
@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    WorkOrderCommentsComponent,
    PageNotFoundComponent,
    WorkOrdersComponent,
    WorkOrderDetailComponent,
    LoginComponent,
    WorkOrderCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoginRoutingModule,
    AdminModule,
    AppRoutingModule,
  ],
  providers: [WorkOrderService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
