import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLinkComponent } from './student-link.component';

describe('StudentLinkComponent', () => {
  let component: StudentLinkComponent;
  let fixture: ComponentFixture<StudentLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
