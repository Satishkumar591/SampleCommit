import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentScratchComponent } from './student-scratch.component';

describe('StudentScratchComponent', () => {
  let component: StudentScratchComponent;
  let fixture: ComponentFixture<StudentScratchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentScratchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentScratchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
