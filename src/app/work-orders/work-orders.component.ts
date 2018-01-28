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

  selectedWorkOrder: RWorkOrder;

  getWorkOrders(deptId: number): void {
    this.workOrderService.getWorkOrders(1)
      .subscribe(workOrders => this.workOrders = workOrders );
  }

  onSelect(workOrder: RWorkOrder): void{
    this.selectedWorkOrder = workOrder;
  }

  constructor(private workOrderService: WorkOrderService) { }

   ngOnInit() {
    this.getWorkOrders(1);
  }

}
