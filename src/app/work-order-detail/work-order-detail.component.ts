import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
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
import { MatList, MatListItem, MatCard, MatCardContent, MatSelect, MatOption, MatOptgroup, MatTooltip } from '@angular/material';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { delay } from 'q';
import { DialogService } from '../dialog.service';
import { Observable } from 'rxjs';
import { PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';

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
  noteLengthOrinal: number;
  
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

  @ViewChildren('tooltip') 
  private tooltip: QueryList<MatTooltip>;
  
  //@ViewChildren('ipt') 
  //public inputs: QueryList<ElementRef>;
  //private input: ElementRef;
  
  ngAfterViewInit() {
    //console.log('workOrderDetail.ngAfterViewInit');
    /*this.inputs.changes.subscribe((el: QueryList<ElementRef>)=>
    {
      //this.input = el.first;
      console.log('input changes');
      el.map(x=>console.log(x.nativeElement.value));
      el.map(x=>x.nativeElement.focus());
      //console.log(JSON.stringify(el.first));
      //console.log('ngAfterViewInit :' + this.input.nativeElement.value);
    });
    */
    
    this.tooltip.changes.subscribe((el: QueryList<MatTooltip>)=>
      {
        el.map(t=>{
          t.show();
        });
        
      });

  }

  isDirty(): boolean{
  //  if(this.workOrder.workOrderJobid != this.workOrderForm.controls['workOrderJob'].value){
   //if(this.workOrder.workOrderJob.id != this.workOrderForm.controls['workOrderJob'].value){
  //console.log('work order form: ' + JSON.stringify(this.workOrderForm.value));   
  //console.log('work Order: ' +JSON.stringify(this.workOrder));   
    if(this.workOrderForm.controls['workOrderStatus'].pristine == false || 
      this.workOrder.workOrderNotes.length != this.noteLengthOrinal 
    || this.workOrderForm.controls['workOrderJob'].pristine == false 
    || this.workOrderForm.controls['description'].pristine == false
    || this.workOrderForm.controls['unitId'].pristine == false 

){
//      console.log('dirty');
      return true;
    }else{
  //    console.log('clean')
      return false;
    }
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
      title: [''],
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

      console.log('work order unit id:' ); 
      console.log('wo priority list: ' );
      console.log(JSON.stringify(this.workOrder));
     // this.workOrderForm.controls['workOrderPriority'].
      //  setValue(2, {onlySelf: true});
      this.setNotes(this.workOrder.workOrderNotes);
      //this.disableFormContols(true);
      //this.workOrderForm.controls['dueDate'].disable();
      //this.workOrderForm.disable();
      //this.workOrderForm.controls['workOrderStatus'].disable();
      this.woStatusOrig = this.workOrder.workOrderStatus.id;
      this.toggledDisableControls(false);
  //    this.tooltip.nativeElement.focus();
      this.noteLengthOrinal = this.workOrder.workOrderNotes.length;
    }
  }

  setNotes(notes: WorkOrderNote[]) {
   // console.log(notes);
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
    var isDirty = this.isDirty();
    let discard: boolean = false;
    if(isDirty ){
      //this.dialogService.confirm('Discard unsaved changed?');
      discard = confirm("Discard unsaved changes 2?");
    }
    if((isDirty && discard) || !isDirty ){
      this.onWoUpdated.emit(true);
      this.onBackFromDtl.emit(true);
    }
  }

  toggledDisableControls(enable: boolean):void{
    
    console.log('User Detail: ' + JSON.stringify(this.authService.getUserDetail()));
    
   // if(enable){
      this.workOrderForm.controls['description'].enable();
      this.workOrderForm.controls['workOrderJob'].enable();
      this.workOrderForm.controls['unitId'].enable();
    /*}else{
      this.workOrderForm.controls['description'].disable();
      this.workOrderForm.controls['workOrderJob'].disable();
      this.workOrderForm.controls['unitId'].disable();
    }*/
    

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

  isControlDisabled():boolean{
    return this.workOrderForm.controls['unitId'].disabled || 
    this.workOrderForm.controls['description'].disabled ||
    this.workOrderForm.controls['workOrderJob'].disabled ? true : false; 
    //return null;
  }
  resetNotesLength():void{
    this.noteLengthOrinal = this.workOrder.workOrderNotes.length;
  }

  onSubmit():void{
    console.log("submitted");
    this.workOrderMod = this.preSaveWorkOrder();
    //console.log("update wo json: " + JSON.stringify(this.workOrderMod));
    this.updateWorkOrder().then(result=>{
      this.onBackFromDetail('sucess');
    });
    //this.woUpdated(true);
  }


  updateWorkOrder(){
    return new Promise((resolve, reject)=>{
      this.workOrderService.updateWorkOrder(this.workOrderMod)
      //.subscribe(wo => console.log(wo.id));
      .subscribe(wo =>
        {
         // console.log('test');
          console.log('updated wo: ' + JSON.stringify(wo));
          this.workOrder = wo;
          this.woUpdated(true);
          this.resetNotesLength();
          resolve('success');
        },
      err=>{
        console.log('update wo error');
      })
    });
  }

  preSaveWorkOrder(): WorkOrder{
    setTimeout(() => {
    this.toggledDisableControls(true);    
    }, 10000 );
    const formModel = this.workOrderForm.value;
    console.log('form model: ' + JSON.stringify(formModel));
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
    this.toggledDisableControls(false);
    return saveWorkOrder;
  }

  woUpdated(updated: boolean) {
    //this.onWoUpdated.emit(true);
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


  constructor(private fb: FormBuilder, private workOrderService: WorkOrderService, 
    private authService: AuthService, private dialogService: DialogService, location: PlatformLocation, router: Router, private location2: Location ) {
    this.componentName = 'work-order-detail';
    console.log('work-order')
    this.createForm();

    location.onPopState(()=>{
      location.onPopState(() => {

        console.log('pressed back!');
        router.navigate(['work-order-list']);
        return false;
    });
    });
    
  this.location2.subscribe(x => console.log('location: ' + x));
  
  }

  ngOnInit() {

  }

  ngOnChanges(){
    console.log('ngOneChanges');
    this.disabledForm = "true";
    this.resetForm();
    window.scroll(0,0);
  }
/*
  canDeactivate(): Observable<boolean> | boolean {
    console.log('canDeactive');


    var isDirty = this.isDirty();
    if(isDirty){
      return false;
    }

    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (!this.workOrder || this.workOrderForm.controls['workOrderStatus'].pristine == false || 
    this.workOrder.workOrderNotes.length != this.noteLengthOrinal ) {
     return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }
*/
}
