import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedashboardComponent } from './approvedashboard.component';

describe('ApprovedashboardComponent', () => {
  let component: ApprovedashboardComponent;
  let fixture: ComponentFixture<ApprovedashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
