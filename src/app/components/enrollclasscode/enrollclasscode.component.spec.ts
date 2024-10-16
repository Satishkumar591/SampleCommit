import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollclasscodeComponent } from './enrollclasscode.component';

describe('EnrollclasscodeComponent', () => {
  let component: EnrollclasscodeComponent;
  let fixture: ComponentFixture<EnrollclasscodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollclasscodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollclasscodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
