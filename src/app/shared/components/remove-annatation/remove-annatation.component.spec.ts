import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAnnatationComponent } from './remove-annatation.component';

describe('RemoveAnnatationComponent', () => {
  let component: RemoveAnnatationComponent;
  let fixture: ComponentFixture<RemoveAnnatationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveAnnatationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAnnatationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
