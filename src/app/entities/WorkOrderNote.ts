export class WorkOrderNote{
  id: number;
  notes: string;

  constructor(theId: number, theNotes: string){
    this.id = theId;
    this.notes = theNotes;
  }

}
