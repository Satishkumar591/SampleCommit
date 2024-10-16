import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorRegistrationComponent } from './creator-registration.component';

describe('RegistrationComponent', () => {
  let component: CreatorRegistrationComponent;
  let fixture: ComponentFixture<CreatorRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
