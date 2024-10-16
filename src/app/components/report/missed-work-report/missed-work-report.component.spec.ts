import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {MissedWorkReportComponent} from './missed-work-report.component';

describe('MissedWorkReportComponent', () => {
  let component: MissedWorkReportComponent;
  let fixture: ComponentFixture<MissedWorkReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissedWorkReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissedWorkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
