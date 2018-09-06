import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovetrainingComponent } from './approvetraining.component';

describe('ApprovetrainingComponent', () => {
  let component: ApprovetrainingComponent;
  let fixture: ComponentFixture<ApprovetrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovetrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovetrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
