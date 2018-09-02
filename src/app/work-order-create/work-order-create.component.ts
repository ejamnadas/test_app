import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { WorkOrderService } from '../work-order.service';
import { RUser } from '../entities/RUser';
import { WorkOrder } from '../entities/WorkOrder';
import { Department } from '../entities/Department';
import { LocationUnit } from '../entities/LocationUnit';
import { WorkOrderCategory } from '../entities/WorkOrderCategory';
import { WorkOrderNote } from '../entities/WorkOrderNote';
import { WorkOrderPriority } from '../entities/WorkOrderPriority';
import { Router, ActivatedRoute } from '@angular/router';

//import { DEPARTMENTS, LOCATIONUNITS, WORKORDERTYPES, ASSETS, EMPLOYEES  } from '../lovs/lovs';

import { FormControl, FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { WorkOrderJob } from '../entities/WorkOrderJob';
import { Observable } from 'rxjs';
import { DialogService } from '../dialog.service';

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
  woJobList: WorkOrderJob[];
  dept_id: number;
  category_id: number;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private fb: FormBuilder, private workOrderService: WorkOrderService,
    private router: Router, private route: ActivatedRoute, private dialogService: DialogService) { }

   ngOnInit() {
    //this.getWorkOrderPriorityList();
  //jh  this.getDepartments();
    //this.getWorkOrderTypes();
   // this.getAssignedTos();
    //this.getLocationUnits();

    this.dept_id = +this.route.snapshot.paramMap.get('dept_id');

    this.category_id = 2;
    this.getFormLists();

    this.createForm();
  }

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

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.workOrderForm.get('photo').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };
    }
  }

  createForm(){
    this.workOrderForm = this.fb.group({
      description: ['', Validators.required],
      workOrderPriorityId: [2, Validators.required],
      assignedTo: ['', Validators.required],
      departmentId: [this.dept_id, Validators.required],
      workOrderCategoryId: ['', Validators.required],
      unitId: ['', Validators.required],
      dueDate: ['', Validators.required],
      jobId: ['', Validators.required],
      photo: null

    });

    this.workOrderForm.controls['departmentId'].setValue(this.dept_id);
    this.workOrderForm.controls['workOrderCategoryId'].setValue(this.category_id);
  }


    

    onSubmit():void {

          this.workOrder = this.preSaveWorkOrder();
          console.log('wo save:'  + JSON.stringify(this.workOrder));
          this.workOrderService.addWorkOrder(this.workOrder)
            .subscribe(
              success=> {
                this.workOrderForm.reset();
                this.router.navigate(['work-order-list']);
                console.log('wo added');
                        },
              err=> { console.log('error adding wo')}
            );
    }

    preSaveWorkOrder(): WorkOrder{
      const formModel = this.workOrderForm.value;
      const workOrderStatusId = 0;

      const savedWorkOrder: WorkOrder = {
          id: null,
          title: '',
          description: formModel.description,
          workOrderPriorityId: formModel.workOrderPriorityId,
          assignedTo: formModel.assignedTo,
          departmentId: formModel.departmentId,
          workOrderCategoryId: formModel.workOrderCategoryId,
          unitId: formModel.unitId,
          dueDate: formModel.dueDate,
          assetId: 1,
          workOrderStatusId: 1,
          assignedBy: 10,
          orgUnit: 1,
          completedDate: null,
          workOrderNotes: null,
          jobId: formModel.jobId,
          pmActionHeadId: 2
         // photo: formModel.photo 

      };

      return savedWorkOrder;
    }

    canDeactivate(): Observable<boolean> | boolean {
      console.log('canDeactive');
      // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
      // observable which resolves to true or false when the user decides
      console.log('pristie: ' + this.workOrderForm.pristine);
      if(!this.workOrderForm.pristine){
        return this.dialogService.confirm('Discard changes?');
      }else{
        console.log('can deactive return false');
        return true;
      }
    }

  
}
