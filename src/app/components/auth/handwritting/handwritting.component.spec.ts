import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandwrittingComponent } from './handwritting.component';

describe('TextHandwritingComponent', () => {
  let component: HandwrittingComponent;
  let fixture: ComponentFixture<HandwrittingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandwrittingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandwrittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
