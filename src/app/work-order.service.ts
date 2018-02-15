import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HttpClient } from '@angular/common/http';
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

@Injectable()
export class WorkOrderService {

  private log(message: string): void{
    this.messageService.add(message);
  }

  addWorkOrder(workOrder: WorkOrder): Observable<WorkOrder>{
    return this.http.post( REST_URL + 'work_order_service', workOrder ).pipe(
      tap((workOrder: WorkOrder) => this.log(`added work order id=${workOrder.id}`)),
      catchError(this.handleError<WorkOrder>('addWorkOrder'))
    );

  }

  updateWorkOrder(workOrder: WorkOrder): Observable<WorkOrder>{
    return this.http.post( REST_URL + 'work_order_service/update', workOrder ).pipe(
      tap((workOrder: WorkOrder) => this.log(`updated work order id=${workOrder.id}`)),
      catchError(this.handleError<WorkOrder>('updateWorkOrder'))
    );
  }

  getWorkOrders(departmentId: number): Observable<any>{
    console.log('getWorkOrders');
    return this.http.get( REST_URL + 'work_order_service/get/' + departmentId ).pipe(
      retry(3),
      catchError(this.handleError<RWorkOrder[]>('getWorkOrders'))
    );

  }

  getWorkOrdersByStatus(departmentId: number, statusId: number): Observable<any>{
    console.log('getWorkOrdersByStatus');
    return this.http.get( REST_URL + 'work_order_service/getByStatus/' + departmentId + '/' + statusId ).pipe(
      retry(3),
      catchError(this.handleError<RWorkOrder[]>('getWorkOrders'))
    );

  }
  getWorkOrderStatusTypes():Observable<WorkOrderStatus[]>{
    return this.http.get<WorkOrderStatus[]>(REST_URL + 'work_order_service/getWorkOrderStatuses' ).pipe(
      retry(3),
      tap(workOrderStatuses => console.log('fetched work order status types')),
      catchError(this.handleError<WorkOrderStatus[]>('/getWorkOrdersStatuses'))
    );
  }

  getWorkOrderPriorityList():Observable<WorkOrderPriority[]>{
    return this.http.get<WorkOrderPriority[]>( REST_URL + 'work_order_service/getWorkOrderPriorities' ).pipe(
      tap(workOrderPriorities => console.log('fetched work order priority list' + JSON.stringify(workOrderPriorities))),
      catchError(this.handleError<WorkOrderPriority[]>('getWorkOrdersPriorities'))
    );
  }

  getUserList():Observable<RUser[]>{
    return this.http.get<RUser[]>( REST_URL + 'work_order_service/getUsers' ).pipe(
      tap(users => console.log('fetched user list' + JSON.stringify(users))),
      catchError(this.handleError<RUser[]>('getUserList'))
    );
  }

  getDepartments():Observable<Department[]>{
    return this.http.get<Department[]>( REST_URL + 'work_order_service/getDepartments' ).pipe(
      tap(departments => console.log('fetched department list' + JSON.stringify(departments)),
      catchError(this.handleError<Department[]>('getDepartments'))
    ));
  }

  getWorkOrderCategories():Observable<WorkOrderCategory[]>{
    return this.http.get<WorkOrderCategory[]>( REST_URL + 'work_order_service/getWorkOrderCategory' ).pipe(
      tap(users => console.log('fetched work order category list' + JSON.stringify(users))),
      catchError(this.handleError<WorkOrderCategory[]>('getWorkOrderCategories'))
    );
  }

  getLocationUnits():Observable<LocationUnit[]>{
    return this.http.get<LocationUnit[]>( REST_URL + 'work_order_service/getLocationUnit' ).pipe(
      tap(results => console.log('fetched location units' + JSON.stringify(results))),
      catchError(this.handleError<LocationUnit[]>('getLocationUnits'))
    );
  }

//get AssignedTo, Priority, Department, Task Type, Room;
  getCreateWoLists():Observable{
    return Observable.forkJoin(
      this.http.get<LocationUnit[]>(REST_URL + 'work_order_service/getLocationUnit'),
      this.http.get<WorkOrderCategory[]>(REST_URL + 'work_order_service/getWorkOrderCategory'),
      this.http.get<WorkOrderPriority[]>(REST_URL + 'work_order_service/getWorkOrderPriorities'),
      this.http.get<WorkOrderDepartment[]>(REST_URL + 'work_order_service/getDepartments'),
      this.http.get<RUser[]>(REST_URL + 'work_order_service/getUsers'),


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

  constructor(private http: HttpClient, private messageService: MessageService) { }

}
