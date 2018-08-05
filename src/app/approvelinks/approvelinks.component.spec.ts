import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovelinksComponent } from './approvelinks.component';

describe('ApprovelinksComponent', () => {
  let component: ApprovelinksComponent;
  let fixture: ComponentFixture<ApprovelinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovelinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovelinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
