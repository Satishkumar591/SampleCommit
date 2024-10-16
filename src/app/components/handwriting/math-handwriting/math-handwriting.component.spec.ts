import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MathHandwritingComponent } from './math-handwriting.component';

describe('TextHandwritingComponent', () => {
  let component: MathHandwritingComponent;
  let fixture: ComponentFixture<MathHandwritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MathHandwritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MathHandwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
