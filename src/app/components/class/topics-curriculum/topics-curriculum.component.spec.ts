import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsCurriculumComponent } from './topics-curriculum.component';

describe('TopicsCurriculumComponent', () => {
  let component: TopicsCurriculumComponent;
  let fixture: ComponentFixture<TopicsCurriculumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsCurriculumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
