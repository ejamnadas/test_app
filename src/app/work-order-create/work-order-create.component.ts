import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../work-order.service';
import { RUser } from '../entities/RUser';
import { WorkOrder } from '../entities/WorkOrder';
import { Department } from '../entities/Department';
import { LocationUnit } from '../entities/LocationUnit';
import { WorkOrderCategory } from '../entities/WorkOrderCategory';
import { WorkOrderNote } from '../entities/WorkOrderNote';
import { WorkOrderPriority } from '../entities/WorkOrderPriority';
import { Router } from '@angular/router';

//import { DEPARTMENTS, LOCATIONUNITS, WORKORDERTYPES, ASSETS, EMPLOYEES  } from '../lovs/lovs';

import { FormControl, FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-work-order-create',
  templateUrl: './work-order-create.component.html',
  styleUrls: ['./work-order-create.component.css']
})
export class WorkOrderCreateComponent implements OnInit {
  workOrderForm: FormGroup;
  workOrderPriorityList: WorkOrderPriority[];
  workOrder: WorkOrder;

  taskDepartments: Department[];
  assignedTos: RUser[];
  workOrderCategories: WorkOrderCategory[];
  locationUnits: LocationUnit[];
  assets: Asset[];

  constructor(private fb: FormBuilder, private workOrderService: WorkOrderService,
    private router: Router) { }

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
          console.log('combined re:' + JSON.stringify(data))
        },
        err=>{
          console.log('error getting lists');
        }
      );
  }

  getWorkOrderPriorityList(): void{
    this.workOrderService.getWorkOrderPriorityList()
      .subscribe(workOrderPriorities => this.workOrderPriorityList = workOrderPriorities);
  }

  getDepartments(): void {
    this.workOrderService.getDepartments()
      .subscribe(departments => this.taskDepartments = departments);
  }

  getWorkOrderTypes(): void{
    this.workOrderService.getWorkOrderCategories()
      .subscribe(result => this.workOrderCategories = result);
  }

  getAssignedTos(): void{

    this.workOrderService.getUserList()
      .subscribe(users => this.assignedTos = users);
//    this.assignedTos = EMPLOYEES;

  }

  getLocationUnits(): void{
    this.workOrderService.getLocationUnits()
      .subscribe(result => this.locationUnits = result);
  }

  createForm(){
    this.workOrderForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      workOrderPriorityId: ['', Validators.required],
      assignedTo: ['', Validators.required],
      departmentId: ['', Validators.required],
      workOrderCategoryId: ['', Validators.required],
      unitId: ['', Validators.required],
      dueDate: ['', Validators.required],

    });

    this.workOrderForm.controls['departmentId'].setValue(1);
    this.workOrderForm.controls['workOrderCategoryId'].setValue(3);
  }


    preSaveWorkOrder(): WorkOrder{
      const formModel = this.workOrderForm.value;
      const workOrderStatusId = 0;

      const savedWorkOrder: WorkOrder = {
          id: null,
          title: formModel.title,
          description: formModel.description,
          workOrderPriorityId: formModel.workOrderPriorityId,
          assignedTo: formModel.assignedTo,
          departmentId: formModel.departmentId,
          workOrderCategoryId: formModel.workOrderCategoryId,
          unitId: formModel.unitId,
          dueDate: formModel.dueDate,
          assetId: 1,
          workOrderStatusId: 1,
          assignedBy: 1,
          orgUnit: 1,
          completedDate: null,
          workOrderNotes: null

      };

      return savedWorkOrder;
    }

    onSubmit():void {

          this.workOrder = this.preSaveWorkOrder();
          this.workOrderService.addWorkOrder(this.workOrder)
            .subscribe(
              success=> {
                this.router.navigate(['work-order-list']);
                console.log('wo added');
                        },
              err=> { console.log('error adding wo')}
            );
    }



  ngOnInit() {
    //this.getWorkOrderPriorityList();
  //jh  this.getDepartments();
    //this.getWorkOrderTypes();
   // this.getAssignedTos();
    //this.getLocationUnits();

    this.getFormLists();

    this.createForm();
  }

}
