import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextHandwritingComponent } from './text-handwriting.component';

describe('TextHandwritingComponent', () => {
  let component: TextHandwritingComponent;
  let fixture: ComponentFixture<TextHandwritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextHandwritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextHandwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
