import { Component, OnInit, ViewChild, ElementRef, QueryList } from '@angular/core';
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
  isLoading = false;
   // displayedColumns = [ 'description' ];
  dataSource = new MatTableDataSource<RWorkOrder>(this.workOrders);
  opened: string;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('ipt') inputs: QueryList<ElementRef>;

  input: ElementRef;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.inputs.changes.subscribe((el: QueryList<ElementRef>)=>
    {
      this.input = el.first
      console.log('ngAfterViewInit :' + this.input.nativeElement.value);
    });
  }

  getWorkOrders(): void {
    this.isLoading = true;
    console.log(this.isLoading);
      this.workOrderService.getWorkOrders(this.deptFilter)
      .subscribe(workOrders => { 
        this.workOrders = workOrders;
        console.log('work orders: ' + JSON.stringify(this.workOrders));
        this.isLoading = false;
        console.log(this.isLoading);
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
  
  onBackFromDetail(el: string):void{
    this.opened = "true";
    this.selectedWorkOrder = null;
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
    this.opened = "true";
    this.dataSource.filterPredicate = (data: RWorkOrder, filter: string) => data.workOrderStatus.description == filter;
  }
  ngOnChanges()
  {

    console.log('ngOnChanges: ' + this.input.nativeElement.value);
  }

}
