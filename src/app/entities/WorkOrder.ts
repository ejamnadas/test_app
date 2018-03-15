import { WorkOrderNote } from './WorkOrderNote';
import { WorkOrderJob } from './WorkOrderJob';

export class WorkOrder{


  id: number;
  workOrderCategoryId: number;
  departmentId: number;
  title: string;
  description: string;
  assetId?: number;
  assignedTo: number;
  assignedBy: number;
  orgUnit: number;
  dueDate: string;
  completedDate: string;
  workOrderPriorityId: number;
  unitId: number;
  workOrderStatusId: number;
  workOrderNotes: WorkOrderNote[];
  jobId: number; 
//  photo: string | any;
  //base64ImageString: string;  

  constructor(){

  }

}
