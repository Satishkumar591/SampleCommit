import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpadQuestionViewComponent } from './ipad-question-view.component';

describe('IpadQuestionViewComponent', () => {
  let component: IpadQuestionViewComponent;
  let fixture: ComponentFixture<IpadQuestionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpadQuestionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpadQuestionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
