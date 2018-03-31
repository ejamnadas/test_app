import { RUser } from './RUser';
import { LocationUnit } from './LocationUnit';
import { WorkOrderStatus } from './WorkOrderStatus';
import { WorkOrderNote } from './WorkOrderNote';
import { WorkOrderJob } from './WorkOrderJob';
import { WorkOrderPriority } from './WorkOrderPriority';

export class RWorkOrder{

  id: number;
  workOrderCategoryId: number;
  departentId: number;
  title: string;
  description: string;
  assetId?: number;
  assignedTo: RUser;
  assignedBy: RUser;
  orgUnit: number;
  dueDate: string;
  completedDate: string;
  workOrderPriority: WorkOrderPriority;
  locationUnit: LocationUnit;
//  workOrderStatusId: number;
  workOrderStatus: WorkOrderStatus;
  workOrderNotes: WorkOrderNote[];
  workOrderJob: WorkOrderJob;

  constructor(){

  }

}
