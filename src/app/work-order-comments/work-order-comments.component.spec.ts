import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCommentsComponent } from './work-order-comments.component';

describe('WorkOrderCommentsComponent', () => {
  let component: WorkOrderCommentsComponent;
  let fixture: ComponentFixture<WorkOrderCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
