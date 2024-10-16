import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollclassComponent } from './enrollclass.component';

describe('EnrollclassComponent', () => {
  let component: EnrollclassComponent;
  let fixture: ComponentFixture<EnrollclassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollclassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollclassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
