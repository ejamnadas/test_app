import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../work-order.service';
import { RWorkOrder } from '../entities/RWorkOrder';
import { WorkOrderStatus } from '../entities/WorkOrderStatus';
import { Element } from '@angular/compiler';
import { Department } from '../entities/Department';
import { RUser } from '../entities/RUser';
import { WorkOrderCategory } from '../entities/WorkOrderCategory';
import { LocationUnit } from '../entities/LocationUnit';
import { WorkOrderJob } from '../entities/WorkOrderJob';
import { WorkOrderPriority } from '../entities/WorkOrderPriority';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.css']
})
export class WorkOrdersComponent implements OnInit {

  workOrders: RWorkOrder[];
  workOrderStatusList: WorkOrderStatus[];
  selectedWorkOrder: RWorkOrder;
  testVal: number;
  statusFilter: number;
  deptFilter: number
  viewDetail: boolean;
  completedOnly: boolean = false;
  
  taskDepartments: Department[];
  assignedTos: RUser[];
  workOrderCategories: WorkOrderCategory[];
  locationUnits: LocationUnit[];
  assets: Asset[];
  woJobList: WorkOrderJob[];
  workOrderPriorityList: WorkOrderPriority[];


  getFormLists(): void{
    console.log('getFormLists');
    
    this.workOrderService.getCreateWoLists()
      .subscribe(
        data=>{
          this.locationUnits = data[0],
          this.workOrderCategories = data[1],
          this.workOrderPriorityList = data[2],
          this.taskDepartments = data[3],
          this.assignedTos = data[4],
          this.woJobList = data[5].woJobList,
          console.log('combined re:' + JSON.stringify(data))
        },
        err=>{
          console.log('error getting lists');
        }
      );
  }
  getWorkOrders(): void {
    if(this.completedOnly){
      this.statusFilter = 4;  
      this.workOrderService.getWorkOrdersByStatus(this.deptFilter,this.statusFilter)
      .subscribe(workOrders => { 
        this.workOrders = workOrders
      },
       error => {
         console.log('error getWorkOrders');
       });
    }else{
      this.workOrderService.getWorkOrders(this.deptFilter)
      .subscribe(workOrders => { 
        this.workOrders = workOrders
      },
       error => {
         console.log('error getWorkOrders');
       });
    }
     console.log(this.workOrders);
  }

  onSelect(workOrder: RWorkOrder, el): void{
    //this.viewDetail = true;
    console.log(this.viewDetail);
    this.selectedWorkOrder = workOrder;
    console.log(el);
    el.scrollIntoView();
  }


  constructor(private workOrderService: WorkOrderService) { }

   ngOnInit() {
    this.testVal = 0;
    this.statusFilter = 1;
    this.deptFilter = 0;
    this.getFormLists();
    this.getWorkOrders();

    this.getWorkOrderStatusList();
    
    this.viewDetail = false;
  }

  getWorkOrderStatusList(): void{
    this.workOrderService.getWorkOrderStatusTypes()
      .subscribe(
        workOrderStatusTypes => this.workOrderStatusList = workOrderStatusTypes
      );
  }

  onWoUpdated(): void{
    console.log('work-order.component onWoUpdated');
    this.getWorkOrders();
  }

  onBackFromDetail(el: string):void{
    console.log('back from detail');
    //this.viewDetail = false;
    window.scrollTo(0,0);
  }

  filter(): void{
    console.log('filter wos');
    this.getWorkOrders()

  }
/*  filter(statusFilter: number): void{
    console.log('filter esults' + statusFilter);
    this.statusFilter = statusFilter;
    this.getWorkOrders()

  }
*/


}
