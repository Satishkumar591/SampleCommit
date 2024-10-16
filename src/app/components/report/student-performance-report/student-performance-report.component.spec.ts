import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {StudentPerformanceReportComponent} from './student-performance-report.component';

describe('StudentPerformanceReportComponent', () => {
  let component: StudentPerformanceReportComponent;
  let fixture: ComponentFixture<StudentPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
