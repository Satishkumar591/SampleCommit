import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentWebAnnotationComponent } from './student-web-annotation.component';

describe('StudentWebAnnotationComponent', () => {
  let component: StudentWebAnnotationComponent;
  let fixture: ComponentFixture<StudentWebAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentWebAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentWebAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
