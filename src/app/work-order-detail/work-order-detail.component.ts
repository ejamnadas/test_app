import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
  workOrderStatusList: WorkOrderStatus[];
  workOrderForm : FormGroup;
  workOrderMod: WorkOrder;

  workOrderStatusId: number;
  woStatusOrig: number;

  getWorkOrderStatusList(): void{

    this.workOrderService.getWorkOrderStatusTypes()
      .subscribe(workOrderStatusTypes => this.workOrderStatusList = workOrderStatusTypes);
  }

  getNotes(): FormArray {
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
    console.log('method: resetForm');
    if (this.workOrder){
      this.workOrderForm.reset ({
        workOrderStatus: this.workOrder.workOrderStatusId,
        completedDate: this.workOrder.completedDate
      });

      this.setNotes(this.workOrder.workOrderNotes);
      //this.workOrderForm.controls['workOrderStatus'].disable();
    }

    //this.woStatusOrig = this.workOrder.workOrderStatus.id;
    this.woStatusOrig = this.workOrder.workOrderStatusId;
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

  get workOrderNotes(): FormArray{
      return this.workOrderForm.get('workOrderNotes') as FormArray;
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


  ngOnChanges(){

    this.getWorkOrderStatusList();
    this.resetForm();

    //this.addWorkOrderNote();
  }

  preSaveWorkOrder(): WorkOrder{
      const formModel = this.workOrderForm.value;

      switch(this.workOrderForm.get('workOrderStatus').value){
        case "COMPLETE":{
          this.workOrderStatusId = 4;
        }
        case "NEW": {
          this.workOrderStatusId = 1;
        }
        case "IN-PROGRESS": {
          this.workOrderStatusId = 2;
        }
    }

      console.log("work order status id: " + this.workOrderStatusId);
      let wo = new WorkOrder();
      wo.id = this.workOrder.id;
      wo.workOrderStatusId = this.workOrderStatusId;
      wo.completedDate =  formModel.completedDate;
      wo.workOrderNotes = formModel.workOrderNotes;

      const saveWorkOrder: WorkOrder = wo;
/*
      const saveWorkOrder: WorkOrder = {
        id: this.workOrder.id,
        workOrderStatusId: this.workOrderStatusId,
        completedDate: formModel.completedDate,
        workOrderNotes: formModel.workOrderNotes
      };

  */    console.log("presave work order result" + saveWorkOrder);
      return saveWorkOrder;
  }

  onSubmit():void{
    console.log("submitted");
    this.workOrderMod = this.preSaveWorkOrder();
    console.log(JSON.stringify(this.workOrderMod));
    this.workOrderService.updateWorkOrder(this.workOrderMod)
      .subscribe(wo => console.log(wo.id));
  }



  get completedDate() { return this.workOrderForm.get('completedDate'); }

  get workOrderStatus() { return this.workOrderForm.get('workOrderStatus'); }



  constructor(private fb: FormBuilder, private workOrderService: WorkOrderService ) {
    this.createForm();
  }

  ngOnInit() {

  }

}
