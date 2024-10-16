import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyschoolComponent } from './emptyschool.component';

describe('EmptyschoolComponent', () => {
  let component: EmptyschoolComponent;
  let fixture: ComponentFixture<EmptyschoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyschoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
