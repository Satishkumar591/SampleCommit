import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmContentAssignComponent } from './confirm-content-assign.component';

describe('ConfirmContentAssignComponent', () => {
  let component: ConfirmContentAssignComponent;
  let fixture: ComponentFixture<ConfirmContentAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmContentAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmContentAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
