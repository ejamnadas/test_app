import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersTblComponent } from './work-orders-tbl.component';

describe('WorkOrdersTblComponent', () => {
  let component: WorkOrdersTblComponent;
  let fixture: ComponentFixture<WorkOrdersTblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrdersTblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrdersTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
