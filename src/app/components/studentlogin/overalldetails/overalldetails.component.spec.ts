import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OveralldetailsComponent } from './overalldetails.component';

describe('OveralldetailsComponent', () => {
  let component: OveralldetailsComponent;
  let fixture: ComponentFixture<OveralldetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OveralldetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OveralldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
