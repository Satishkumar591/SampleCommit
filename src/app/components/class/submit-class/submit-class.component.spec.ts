import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitClassComponent } from './submit-class.component';

describe('SubmitClassComponent', () => {
  let component: SubmitClassComponent;
  let fixture: ComponentFixture<SubmitClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
