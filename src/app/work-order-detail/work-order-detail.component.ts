import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { RWorkOrder } from '../entities/RWorkOrder';
import { WorkOrder } from '../entities/WorkOrder';
import { WorkOrderNote } from '../entities/WorkOrderNote';
import { WorkOrderService } from '../work-order.service';
import { WorkOrderStatus } from '../entities/WorkOrderStatus';

import { FormControl, FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-work-order-detail',
  templateUrl: './work-order-detail.component.html',
  styleUrls: ['./work-order-detail.component.css']
})
export class WorkOrderDetailComponent implements OnInit {

  @Input() workOrder: WorkOrder;
  @Input() workOrderStatusList: WorkOrderStatus[];
  @Output() onWoUpdated = new EventEmitter<boolean>();
  //workOrderStatusList: WorkOrderStatus[];
  workOrderForm : FormGroup;
  workOrderMod: WorkOrder;

  workOrderStatusId: number;
  woStatusOrig: number;
  componentName: string;

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
      completedDate: '',
      workOrderNotes : this.fb.array([])
    });

  }

  resetForm(): void {
    if(this.workOrder){
    console.log('method: resetForm');
    console.log(this.workOrder);
    if (this.workOrder){
      this.workOrderForm.reset ({
        workOrderStatus: this.workOrder.workOrderStatus.description,
        completedDate: this.workOrder.completedDate
      });

      this.setNotes(this.workOrder.workOrderNotes);
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
    let note = new WorkOrderNote(null, '');
    this.workOrderNotes.push(this.fb.group({
      id:[note.id],
      notes:[note.notes, Validators.required]
    }));
  }



  statusChange(): void{
    console.log("status changes");
    if(this.workOrderForm.get('workOrderStatus').value == 'COMPLETE'){
      this.workOrderForm.controls['completedDate'].setValidators([Validators.required]);
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

    }
  }

  onSubmit():void{
    console.log("submitted");
    this.workOrderMod = this.preSaveWorkOrder();
    console.log("update wo json: " + JSON.stringify(this.workOrderMod));
    this.workOrderService.updateWorkOrder(this.workOrderMod)
      //.subscribe(wo => console.log(wo.id));
      .subscribe(wo =>
         this.woUpdated(true));
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
      wo.completedDate =  formModel.completedDate;
      wo.workOrderNotes = formModel.workOrderNotes;

      const saveWorkOrder: WorkOrder = wo;
      return saveWorkOrder;
  }

  woUpdated(updated: boolean) {
    this.onWoUpdated.emit(true);
  }


  get completedDate() { return this.workOrderForm.get('completedDate'); }

  get workOrderStatus() { return this.workOrderForm.get('workOrderStatus'); }


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
    console.log(result);
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
    this.resetForm();
  }
}
