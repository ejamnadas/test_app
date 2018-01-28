import { RUser } from './RUser';
import { LocationUnit } from './LocationUnit';
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
  completeDate: string;
  workOrderPriorityId: number;
  locationUnit: LocationUnit;
  workOrderStatusId: number;

  constructor(){

  }

}
