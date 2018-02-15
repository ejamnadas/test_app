import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../work-order.service';
import { RWorkOrder } from '../entities/RWorkOrder';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.css']
})
export class WorkOrdersComponent implements OnInit {

  workOrders: RWorkOrder[];
  workOrderStatusList: WorkOrderStatusList[];
  selectedWorkOrder: RWorkOrder;
  testVal: number;
  statusFilter: number;
  deptFilter: number

  getWorkOrders(): void {
    this.workOrderService.getWorkOrdersByStatus(this.deptFilter,this.statusFilter)
      .subscribe(workOrders => { this.workOrders = workOrders},
       error => {
         console.log('error getWorkOrders');
       });
       this.testVal = this.testVal  + 1;
       console.log('get work orders');
       console.log(this.workOrders);
       console.log(this.testVal);
  }

  onSelect(workOrder: RWorkOrder): void{
    this.selectedWorkOrder = workOrder;
  }

  constructor(private workOrderService: WorkOrderService) { }

   ngOnInit() {
    this.testVal = 0;
    this.statusFilter = 1;
    this.deptFilter = 0;
    this.getWorkOrders(1);

    this.getWorkOrderStatusList();
  }

  getWorkOrderStatusList(): void{
    this.workOrderService.getWorkOrderStatusTypes()
      .subscribe(
        workOrderStatusTypes => this.workOrderStatusList = workOrderStatusTypes
      );
  }

  onWoUpdated(): void{
    console.log('work-order.component onWoUpdated');
    this.getWorkOrders(1);
  }

  filter(statusFilter: number): void{
    console.log('filter esults' + statusFilter);
    this.statusFilter = statusFilter;
    this.getWorkOrders()

  }

}
