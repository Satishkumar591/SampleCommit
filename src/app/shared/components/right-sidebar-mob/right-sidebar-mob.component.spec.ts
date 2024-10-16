import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSidebarMobComponent } from './right-sidebar-mob.component';

describe('RightSidebarMobComponent', () => {
  let component: RightSidebarMobComponent;
  let fixture: ComponentFixture<RightSidebarMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSidebarMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSidebarMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
