import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionPageComponent } from './correction-page.component';

describe('CorrectionPageComponent', () => {
  let component: CorrectionPageComponent;
  let fixture: ComponentFixture<CorrectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
