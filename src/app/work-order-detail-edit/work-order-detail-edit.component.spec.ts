import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDetailEditComponent } from './work-order-detail-edit.component';

describe('WorkOrderDetailEditComponent', () => {
  let component: WorkOrderDetailEditComponent;
  let fixture: ComponentFixture<WorkOrderDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
