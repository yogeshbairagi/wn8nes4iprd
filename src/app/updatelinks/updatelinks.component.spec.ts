import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatelinksComponent } from './updatelinks.component';

describe('UpdatelinksComponent', () => {
  let component: UpdatelinksComponent;
  let fixture: ComponentFixture<UpdatelinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatelinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatelinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
