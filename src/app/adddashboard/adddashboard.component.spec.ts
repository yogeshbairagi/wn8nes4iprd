import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddashboardComponent } from './adddashboard.component';

describe('AdddashboardComponent', () => {
  let component: AdddashboardComponent;
  let fixture: ComponentFixture<AdddashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdddashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
