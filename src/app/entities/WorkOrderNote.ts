export class WorkOrderNote{
  id: number;
  notes: string;
  noteDate: string;

  constructor(theId: number, theNotes: string, noteDate: string){
    this.id = theId;
    this.notes = theNotes;
    this.noteDate = noteDate;
  }

}
