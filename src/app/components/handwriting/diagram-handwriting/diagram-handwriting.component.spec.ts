import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramHandwritingComponent } from './diagram-handwriting.component';

describe('TextHandwritingComponent', () => {
  let component: DiagramHandwritingComponent;
  let fixture: ComponentFixture<DiagramHandwritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramHandwritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramHandwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
