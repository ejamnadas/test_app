import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { RWorkOrder } from '../entities/RWorkOrder';
import { WorkOrder } from '../entities/WorkOrder';
import { WorkOrderNote } from '../entities/WorkOrderNote';
import { WorkOrderService } from '../work-order.service';
import { WorkOrderStatus } from '../entities/WorkOrderStatus';

import { FormControl, FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { WorkOrderPriority } from '../entities/WorkOrderPriority';
import { ControlValueAccessor } from '@angular/forms/src/directives/control_value_accessor';
import { LocationUnit } from '../entities/LocationUnit';
import { WorkOrderJob } from '../entities/WorkOrderJob';
import { RUser } from '../entities/RUser';
import { DatePipe } from '@angular/common/src/pipes';
import { MatList, MatListItem, MatCard, MatCardContent, MatSelect, MatOption, MatOptgroup } from '@angular/material';

@Component({
  selector: 'app-work-order-detail',
  templateUrl: './work-order-detail.component.html',
  styleUrls: ['./work-order-detail.component.css']
})
export class WorkOrderDetailComponent implements OnInit {

  workOrderStatusList: WorkOrderStatus[];
  workOrderPriorityList: WorkOrderPriority[];
  locationUnits: LocationUnit[];
  woJobList: WorkOrderJob[];
  assignedTos: RUser[];

  newNoteInput: string;
  
  @Input() workOrder: RWorkOrder;
  @Output() onWoUpdated = new EventEmitter<boolean>();
  @Output() onBackFromDtl = new EventEmitter<boolean>();

  isLoading: boolean = false;
  //workOrderStatusList: WorkOrderStatus[];
  workOrderForm : FormGroup;
  workOrderMod: WorkOrder;

  workOrderStatusId: number;
  woStatusOrig: number;
  componentName: string;

  disabledForm: string

  priorityIds: number[] = [1,2, 3];
  items: any[] = [];
  formDirty: boolean;

  isDirty(): boolean{
    if(this.workOrder.workOrderJob.id != this.workOrderForm.controls['workOrderJob'].value){
      console.log('dirty');
    }else{
      console.log('clean')
    }
    return false;
  }

  getWorkOrderStatusList(): void{

    this.workOrderService.getWorkOrderStatusTypes()
      .subscribe(workOrderStatusTypes => this.workOrderStatusList = workOrderStatusTypes);
  }


  getNotes(): FormArray {
    return this.workOrderForm.get('workOrderNotes') as FormArray;
  }

  get workOrderNotes(): FormArray{
      return this.workOrderForm.get('workOrderNotes') as FormArray;
  }

  createForm(): void{
    this.workOrderForm = this.fb.group({
      workOrderStatus: ['', Validators.required],
      completedDate: ['', null],
      workOrderPriority: ['', Validators.required],
      workOrderNotes : this.fb.array([]),
      dueDate: ['', Validators.required],
      title: ['', Validators.required],
      workOrderJob: ['', Validators.required],
      unitId: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  resetForm(): void {
    this.isLoading = true;
    this.workOrderService.getWoDropdowns()
      .subscribe(
        data=>{
          this.workOrderPriorityList = data[0],
          this.locationUnits = data[1],
          this.workOrderStatusList = data[2],
          this.woJobList = data[3].woJobList,
          this.assignedTos = data[4];
          this.isLoading = false;
          //console.log('combined results:' + JSON.stringify(data))
        },
        err=>{
          console.log('error getting lists');
        }
      ); 
    if(this.workOrder){
   // console.log(this.workOrder);
    if (this.workOrder){
      this.workOrderForm.reset ({
        //workOrderStatus: this.workOrder.workOrderStatus.description,
        workOrderStatus: this.workOrder.workOrderStatus.id,
        completedDate: this.workOrder.completedDate,
        workOrderPriority: this.workOrder.workOrderPriority.id,
        workOrderJob: this.workOrder.workOrderJob.id  ,
        dueDate: this.workOrder.dueDate,
        description: this.workOrder.description,
        title: this.workOrder.title,
        unitId: this.workOrder.locationUnit.id
      });

     console.log('work order unit id:' + JSON.stringify(this.workOrder.workOrderPriority)); 
     console.log('wo priority list: ' + JSON.stringify(this.workOrderPriorityList));
     console.log(JSON.stringify(this.workOrder));
     // this.workOrderForm.controls['workOrderPriority'].
      //  setValue(2, {onlySelf: true});
      this.setNotes(this.workOrder.workOrderNotes);
      //this.disableFormContols(true);
      //this.workOrderForm.controls['dueDate'].disable();
      //this.workOrderForm.disable();
      //this.workOrderForm.controls['workOrderStatus'].disable();
    }

    //this.woStatusOrig = this.workOrder.workOrderStatus.id;
    this.woStatusOrig = this.workOrder.workOrderStatus.id;
    }
  }

  setNotes(notes: WorkOrderNote[]) {
    console.log(notes);
    const noteFGs = notes.map(note => this.fb.group(note));
    const notesFormArray = this.fb.array(noteFGs);
    this.workOrderForm.setControl('workOrderNotes', notesFormArray);

  }

  addWorkOrderNote(){
    console.log('note added:' + this.newNoteInput);
    let note = new WorkOrderNote(null, this.newNoteInput, null)
    this.workOrder.workOrderNotes.unshift(note);
    // this.workOrder.workOrderNotes.push(note);
    
    console.log('updated notes: ' + JSON.stringify(this.workOrder.workOrderNotes));
    this.setNotes(this.workOrder.workOrderNotes);
    this.newNoteInput = '';
  }

  onEnterNotes():void{
    this.addWorkOrderNote();

  }

  statusChange(): void{ 
      console.log("status changes");
    /*if(this.workOrderForm.get('workOrderStatus').value == 'COMPLETE'){ this.workOrderForm.controls['completedDate'].setValidators([Validators.required]);
      this.workOrderForm.controls['completedDate'].updateValueAndValidity();
    }else{
      this.workOrderForm.controls['completedDate'].clearValidators();
      this.workOrderForm.controls['completedDate'].updateValueAndValidity();
      this.workOrderForm.patchValue({
        completedDate: null
      });
    }
    if(this.woStatusOrig == 1 && this.workOrderForm.get('workOrderStatus').value == 'IN-PROGRESS'){
      console.log('require note');
      this.addWorkOrderNote();
      //this.workOrderForm.controls['workOrderNotes'].setValidators([Validators.required]);
      //this.workOrderForm.controls['workOrderNotes'].updateValueAndValidity();

    }*/
  }

  onBackFromDetail(el: string):void{
    console.log('detail.onBackFromDetail')
    this.isDirty();
    this.onBackFromDtl.emit(true);
  }

  toggleDisabledForm():void{
    let boolStatus: boolean;
    console.log("pre toggle disabled" + this.disabledForm);
    if(this.disabledForm == null){
      boolStatus  = true;
      this.disabledForm  = "true";
    }else{
      this.disabledForm = null;
      boolStatus = false;
    }
    this.disableFormContols(boolStatus);
    console.log("toggle disabled" + this.disabledForm);
  }

  disableFormContols(val: boolean){
    if(val){
       this.workOrderForm.disable();
       //this.workOrderForm.controls['workOrderStatus'].enable(); 
       this.workOrderForm.controls['dueDate'].enable(); 
    }else{
      this.workOrderForm.enable();

    }
    this.statusChange();
  }
  
  getDisabledForm():String{
    return this.disabledForm;
    //return null;
  }

  onSubmit():void{
    console.log("submitted");
    this.workOrderMod = this.preSaveWorkOrder();
    console.log("update wo json: " + JSON.stringify(this.workOrderMod));
    this.workOrderService.updateWorkOrder(this.workOrderMod)
      //.subscribe(wo => console.log(wo.id));
      .subscribe(wo =>
        {
          console.log('test');
          console.log('updated wo: ' + JSON.stringify(wo));
          this.workOrder = wo;
          this.woUpdated(true);

        },
      err=>{
        console.log('update wo error');
      });
        ;
    //this.woUpdated(true);
  }

  preSaveWorkOrder(): WorkOrder{
      const formModel = this.workOrderForm.value;

      console.log('preSaveWorkOrder workOrderStatus: ' + this.workOrderForm.get('workOrderStatus').value);
      switch(this.workOrderForm.get('workOrderStatus').value){
        case "COMPLETE":{

          this.workOrderStatusId = 4;
          //console.log('Complete' + this.workOrderStatusId);
          break;
        }
        case "NEW": {
          this.workOrderStatusId = 1;
          //console.log('New' + this.workOrderStatusId);
          break;
        }
        case "IN-PROGRESS": {
          this.workOrderStatusId = 2;
          //console.log('In PROGRESS' + this.workOrderStatusId);
          break;
        }

    }

      //console.log("work order status id: " + this.workOrderStatusId);
      let wo = new WorkOrder();
      wo.id = this.workOrder.id;
      wo.workOrderStatusId = this.workOrderStatusId;
      wo.workOrderStatusId = formModel.workOrderStatus;
      wo.completedDate =  formModel.completedDate;
      wo.workOrderNotes = formModel.workOrderNotes;
      wo.unitId = formModel.unitId;
      wo.jobId = formModel.workOrderJob;
      wo.workOrderPriorityId = formModel.workOrderPriority;
      wo.title = formModel.title;
      wo.description = formModel.description;

      console.log('presave workorder:: ' + JSON.stringify(wo));
      const saveWorkOrder: WorkOrder = wo;
      return saveWorkOrder;
  }

  woUpdated(updated: boolean) {
    this.onWoUpdated.emit(true);
    this.resetForm();
  }


  get completedDate() { return this.workOrderForm.get('completedDate'); }

  get workOrderStatus() { return this.workOrderForm.get('workOrderStatus'); }

  get workOrderPriority() { return this.workOrderForm.get('workOrderPriority'); }
 

 disabledStatus(status: String) : String{
    //console.log(status);
    let result : String;
    let stateDescription : String =
        this.workOrder.workOrderStatus.description;

    switch(status){
      case 'NEW': {
          if(stateDescription == 'COMPLETE' || stateDescription == 'IN-PROGRESS'){
          result = 'disabled'
        }else{
          result = null;
        }

        break;
      }

      case 'IN-PROGRESS' : {
        if(stateDescription == 'COMPLETE'){
          result = 'disabled'
        }else{
          result = null;
        }

        break;
      }
      default: {
        result = null;
        break;
      }
    }
//    console.log(result);
    return result;
  }






  constructor(private fb: FormBuilder, private workOrderService: WorkOrderService ) {
    this.componentName = 'work-order-detail';
    console.log('work-order')
    this.createForm();
  
  }

  ngOnInit() {

 
  }

  ngOnChanges(){
    console.log('ngOneChanges');
    this.disabledForm = "true";
    this.resetForm();
  }
}
