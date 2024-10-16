import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAnnotationComponent } from './student-annotation.component';

describe('StudentAnnotationComponent', () => {
  let component: StudentAnnotationComponent;
  let fixture: ComponentFixture<StudentAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
