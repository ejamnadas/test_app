import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkOrder } from './entities/WorkOrder';
import { RWorkOrder } from './entities/RWorkOrder';
import { WorkOrderStatus } from './entities/WorkOrderStatus';
import { WorkOrderPriority } from './entities/WorkOrderPriority';
import { WorkOrderCategory } from './entities/WorkOrderCategory';
import { LocationUnit } from './entities/LocationUnit';
import { Department} from './entities/Department';
import { RUser } from './entities/RUser';
import { REST_URL } from './config/api_settings';
import { MessageService } from './message.service';
import { TenantAuthService } from './auth/tenant/tenant-auth.service';
import { CreateWorkOrderModel } from './entities/CreateWorkOrderModel';
import { Location } from '@angular/common';
import { WorkOrderJob } from './entities/WorkOrderJob';

@Injectable()
export class WorkOrderService {

  private log(message: string): void{
    
    this.messageService.add(message);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tenantAuthService.getToken(),
    })
  } 

  refresh() : void{
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.tenantAuthService.getToken(),
      })
    } 
  }

  addWorkOrder(workOrder: WorkOrder): Observable<WorkOrder>{
    this.refresh();
    console.log('tenant auth service' + this.tenantAuthService.httpOptions);
    console.log('http options' + this.httpOptions);

    return this.http.post( REST_URL + 'work_order_service/add', workOrder, this.tenantAuthService.httpOptions ).pipe(
      tap((workOrder: WorkOrder) => this.log(`added work order id=${workOrder.id}`)),
      catchError(this.handleError<WorkOrder>('addWorkOrder'))
    );
  }

  updateWorkOrder(workOrder: WorkOrder): Observable<any>{
    return this.http.post( REST_URL + 'work_order_service/update', workOrder, this.tenantAuthService.httpOptions ).pipe(
      tap((workOrder: WorkOrder) => this.log(`updated work order id=${workOrder.id}`)),
      catchError(this.handleError<WorkOrder>('updateWorkOrder'))
    );
  }
 

  getWorkOrders(departmentId: number): Observable<any>{
    console.log('getWorkOrders');
    return this.http.get( REST_URL + 'work_order_service/get/' + departmentId, this.tenantAuthService.httpOptions ).pipe(
      retry(3),
      catchError(this.handleError<RWorkOrder[]>('getWorkOrders'))
    )

  }

  getWorkOrdersByStatus(departmentId: number, statusId: number): Observable<any>{
    console.log('getWorkOrdersByStatus');
    this.refresh();
    return this.http.get( REST_URL + 'work_order_service/getByStatus/' + departmentId + '/' + statusId, this.tenantAuthService.httpOptions ).pipe(
      retry(3),
      catchError(this.handleError<RWorkOrder[]>('getWorkOrders'))
    );

  }


  getWorkOrderPriorityList():Observable<WorkOrderPriority[]>{
    return this.http.get<WorkOrderPriority[]>( REST_URL + 'work_order_service/getWorkOrderPriorities', this.tenantAuthService.httpOptions ).pipe(
      tap(workOrderPriorities => console.log('fetched work order priority list')),
      catchError(this.handleError<WorkOrderPriority[]>('getWorkOrdersPriorities'))
    );
  }
  
  private woPrList: WorkOrderPriority[];
  private woStatusTypeList: WorkOrderStatus[];
  private locationUnits: LocationUnit[];
  private woJobList: WorkOrderJob[];
  private assignedToList: RUser[];
  private createWoModel: CreateWorkOrderModel[];

  private obsWoPrList: Observable<WorkOrderPriority[]>;
  private obsWoStatusList: Observable<WorkOrderStatus[]>;
  private obsLocationUnits: Observable<LocationUnit[]>;
  private obsWoJobList: Observable<WorkOrderJob[]>;
  private obsUsers: Observable<RUser[]>;
  private obsCreateWoModel: Observable<CreateWorkOrderModel[]>;


  getWoPrList(){
    if(this.woPrList){
      console.log('woprlist exists, no get');
      return Observable.of(this.woPrList);
    }else if(this.obsWoPrList){
      return this.obsWoPrList;
    }else{
      console.log('woprlist doesnt exist');
      this.obsWoPrList = this.http.get<WorkOrderPriority[]>(
         REST_URL + 'work_order_service/getWorkOrderPriorities',
         this.tenantAuthService.httpOptions ).pipe(
           tap(workOrderPriorities=>{
             this.woPrList = workOrderPriorities
           }),
          catchError(this.handleError<WorkOrderPriority[]>('getWorkOrdersPriorities'))
         ).share();
        return this.obsWoPrList;
    }
  }

  getWoStatusList(){
    if(this.woStatusTypeList){
      return Observable.of(this.woStatusTypeList);
    }else if(this.obsWoStatusList){
      return this.obsWoStatusList;
    }else{
      this.obsWoStatusList = this.http.get<WorkOrderStatus[]>(
         REST_URL + 'work_order_service/getWorkOrderStatuses',
         this.tenantAuthService.httpOptions ).pipe(
           tap(results=>{
             this.woStatusTypeList = results 
           }),
          catchError(this.handleError<WorkOrderStatus[]>('getWorkOrdersStatus'))
         ).share();
        return this.obsWoStatusList;
    }
  }

  getLocationUnitList(){
    if(this.locationUnits){
      return Observable.of(this.locationUnits);
    }else if(this.obsLocationUnits){
      return this.obsLocationUnits;
    }else{
      this.obsLocationUnits = this.http.get<LocationUnit[]>(
         REST_URL + 'work_order_service/getLocationUnit',
         this.tenantAuthService.httpOptions ).pipe(
           tap(results=>{
             this.locationUnits = results 
           }),
          catchError(this.handleError<LocationUnit[]>('getWorkOrdersStatus'))
         ).share();
        return this.obsLocationUnits;
    }
  }

  getCreateWorkOrderModel(){
    if(this.createWoModel){
      return Observable.of(this.createWoModel);
    }else if(this.obsCreateWoModel){
      return this.obsCreateWoModel;
    }else{
      this.obsCreateWoModel = this.http.get<CreateWorkOrderModel[]>(
         REST_URL + 'work_order_service/getCreateWorkOrderDropdown',
         this.tenantAuthService.httpOptions ).pipe(
           tap(results=>{
             this.createWoModel = results 
           }),
          catchError(this.handleError<CreateWorkOrderModel[]>('getWorkOrdersStatus'))
         ).share();
        return this.obsCreateWoModel;
    }
  }
  

  getWorkOrderStatusTypes():Observable<WorkOrderStatus[]>{
    return this.http.get<WorkOrderStatus[]>(REST_URL + 'work_order_service/getWorkOrderStatuses', this.tenantAuthService.httpOptions ).pipe(
      retry(3),
      tap(workOrderStatuses => console.log('fetched work order status types')),
      catchError(this.handleError<WorkOrderStatus[]>('/getWorkOrdersStatuses'))
    );
  }

  getWoDropdowns():Observable<Object>{
    return Observable.forkJoin(
      this.getWoPrList(),
      this.getLocationUnitList(),
      this.getWoStatusList(),
      this.getCreateWorkOrderModel(),
      this.http.get<RUser[]>(REST_URL + 'work_order_service/getUsers', this.tenantAuthService.httpOptions)
    )
    .catch(this.handleError('getCreateWoLists error'));
  }

  getUserList():Observable<RUser[]>{
    return this.http.get<RUser[]>( REST_URL + 'work_order_service/getUsers', this.tenantAuthService.httpOptions ).pipe(
      tap(users => console.log('fetched user list' )),
      catchError(this.handleError<RUser[]>('getUserList'))
    );
  }

  getDepartments():Observable<Department[]>{
    return this.http.get<Department[]>( REST_URL + 'work_order_service/getDepartments', this.tenantAuthService.httpOptions ).pipe(
      tap(departments => console.log('fetched department list'),
      catchError(this.handleError<Department[]>('getDepartments'))
    ));
  }

  getWorkOrderCategories():Observable<WorkOrderCategory[]>{
    return this.http.get<WorkOrderCategory[]>( REST_URL + 'work_order_service/getWorkOrderCategory', this.tenantAuthService.httpOptions ).pipe(
      tap(users => console.log('fetched work order category list')),
      catchError(this.handleError<WorkOrderCategory[]>('getWorkOrderCategories'))
    );
  }

  getLocationUnits():Observable<LocationUnit[]>{
    return this.http.get<LocationUnit[]>( REST_URL + 'work_order_service/getLocationUnit', this.tenantAuthService.httpOptions ).pipe(
      tap(results => console.log('fetched location units')),
      catchError(this.handleError<LocationUnit[]>('getLocationUnits'))
    );
  }

//get AssignedTo, Priority, Department, Task Type, Room;
  getCreateWoLists():Observable<Object>{
    return Observable.forkJoin(
      this.http.get<LocationUnit[]>(REST_URL + 'work_order_service/getLocationUnit', this.tenantAuthService.httpOptions),
      this.http.get<WorkOrderCategory[]>(REST_URL + 'work_order_service/getWorkOrderCategory', this.tenantAuthService.httpOptions),
      this.http.get<WorkOrderPriority[]>(REST_URL + 'work_order_service/getWorkOrderPriorities', this.tenantAuthService.httpOptions),
      this.http.get<Department[]>(REST_URL + 'work_order_service/getDepartments', this.tenantAuthService.httpOptions),
      this.http.get<RUser[]>(REST_URL + 'work_order_service/getUsers', this.tenantAuthService.httpOptions),
      this.http.get<CreateWorkOrderModel[]>(REST_URL + 'work_order_service/getCreateWorkOrderDropdown', this.tenantAuthService.httpOptions),
    )
    .catch(this.handleError('getCreateWoLists error'));

  }

  private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead


    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

  constructor(private http: HttpClient, private messageService: MessageService,
    private tenantAuthService: TenantAuthService) { }

}
