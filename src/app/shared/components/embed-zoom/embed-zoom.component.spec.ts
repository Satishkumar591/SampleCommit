import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedZoomComponent } from './embed-zoom.component';

describe('EmbedZoomComponent', () => {
  let component: EmbedZoomComponent;
  let fixture: ComponentFixture<EmbedZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbedZoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
