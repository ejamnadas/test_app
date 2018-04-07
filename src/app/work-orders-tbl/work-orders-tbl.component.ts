import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { RWorkOrder } from '../entities/RWorkOrder';
import { WorkOrderService } from '../work-order.service';
import { Element } from '@angular/compiler';
import { WorkOrderStatus } from '../entities/WorkOrderStatus';

@Component({
  selector: 'app-work-orders-tbl',
  templateUrl: './work-orders-tbl.component.html',
  styleUrls: ['./work-orders-tbl.component.css']
})
export class WorkOrdersTblComponent implements OnInit {

  workOrders: RWorkOrder[];
  selectedWorkOrder: RWorkOrder;
  completedOnly: boolean;
  deptFilter: number;
  displayedColumns = [ 'locationUnit.unitDescription', 'workOrderJob.woJobName', 'description', 'assignedTo.firstName' ];
   // displayedColumns = [ 'description' ];
  dataSource = new MatTableDataSource<RWorkOrder>(this.workOrders);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getWorkOrders(): void {
      this.workOrderService.getWorkOrders(this.deptFilter)
      .subscribe(workOrders => { 
        this.workOrders = workOrders;
        console.log('work orders: ' + JSON.stringify(this.workOrders));
      },
       error => {
         console.log('error getWorkOrders');
       },
      ()=>{
        this.dataSource = new MatTableDataSource<RWorkOrder>(this.workOrders);
      });
    }

  constructor(private workOrderService: WorkOrderService){
  }

  onSelect(workOrder: RWorkOrder, el): void{

    this.selectedWorkOrder = workOrder;
  }
  
  isSelectedRow(row){
   // console.log('is row comp: ' + row);
    if(row === this.selectedWorkOrder){
      return true;
    }else{
      return null;
    }
  }

  isRowCompleted(row){
    //console.log(row.workOrderStatus.description);
    if(row.workOrderStatus.description=='COMPLETE'){
      return true;
    }
    return null;
  }

  isRowInProgress(row){
    if(row.workOrderStatus.id == 2){
      return true;
    }
    return null;
  }

  onWoUpdated(): void{
    //console.log('work-order.component onWoUpdated');
    this.getWorkOrders();
  }

  filterCompleted():void{
    //console.log('filterCompleted');
    if(this.completedOnly){
      this.dataSource.filterPredicate = (data: RWorkOrder, filter: string) => data.workOrderStatus.description == filter;
      this.dataSource.filter = 'COMPLETE';
    }else{
      this.dataSource.filter = '';
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: RWorkOrder, filter: string) => data.workOrderStatus.description == filter;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toUpperCase(); // MatTableDataSource defaults to lowercase matches
    console.log('filter vlaue' + filterValue);
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.deptFilter = 0;
    this.getWorkOrders();
    
    this.dataSource.filterPredicate = (data: RWorkOrder, filter: string) => data.workOrderStatus.description == filter;
  }

}
