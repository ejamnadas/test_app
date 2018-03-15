import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../work-order.service';
import { RWorkOrder } from '../entities/RWorkOrder';
import { WorkOrderStatus } from '../entities/WorkOrderStatus';
import { Element } from '@angular/compiler';

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

  getWorkOrders(): void {
    this.workOrderService.getWorkOrdersByStatus(this.deptFilter,this.statusFilter)
      .subscribe(workOrders => { 
        this.workOrders = workOrders
      },
       error => {
         console.log('error getWorkOrders');
       });
       this.testVal = this.testVal  + 1;
       console.log('get work orders');
       console.log(this.workOrders);
       console.log(this.testVal);
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

  filter(statusFilter: number): void{
    console.log('filter esults' + statusFilter);
    this.statusFilter = statusFilter;
    this.getWorkOrders()

  }



}
