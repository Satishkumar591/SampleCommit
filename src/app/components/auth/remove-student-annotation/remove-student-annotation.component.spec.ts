import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveStudentAnnotationComponent } from './remove-student-annotation.component';

describe('RemoveStudentAnnotationComponent', () => {
  let component: RemoveStudentAnnotationComponent;
  let fixture: ComponentFixture<RemoveStudentAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveStudentAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveStudentAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
