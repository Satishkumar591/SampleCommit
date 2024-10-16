import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeviewContentfolderComponent } from './treeview-contentfolder.component';

describe('TreeviewContentfolderComponent', () => {
  let component: TreeviewContentfolderComponent;
  let fixture: ComponentFixture<TreeviewContentfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeviewContentfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeviewContentfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
