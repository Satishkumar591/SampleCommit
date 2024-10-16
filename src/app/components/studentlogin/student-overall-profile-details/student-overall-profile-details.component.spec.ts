import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOverallProfileDetailsComponent } from './student-overall-profile-details.component';

describe('StudentOverallProfileDetailsComponent', () => {
  let component: StudentOverallProfileDetailsComponent;
  let fixture: ComponentFixture<StudentOverallProfileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentOverallProfileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentOverallProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
