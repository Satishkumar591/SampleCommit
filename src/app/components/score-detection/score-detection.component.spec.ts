import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDetectionComponent } from './score-detection.component';

describe('ScoreDetectionComponent', () => {
  let component: ScoreDetectionComponent;
  let fixture: ComponentFixture<ScoreDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
