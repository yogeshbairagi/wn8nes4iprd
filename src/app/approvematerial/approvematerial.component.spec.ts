import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovematerialComponent } from './approvematerial.component';

describe('ApprovematerialComponent', () => {
  let component: ApprovematerialComponent;
  let fixture: ComponentFixture<ApprovematerialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovematerialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovematerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
