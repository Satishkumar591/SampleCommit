import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedContentComponent } from './assigned-content.component';

describe('AssignedContentComponent', () => {
  let component: AssignedContentComponent;
  let fixture: ComponentFixture<AssignedContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
