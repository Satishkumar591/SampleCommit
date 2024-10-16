import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingmentsComponent } from './assingments.component';

describe('AssessmentComponent', () => {
  let component: AssingmentsComponent;
  let fixture: ComponentFixture<AssingmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssingmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssingmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
