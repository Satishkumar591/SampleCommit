import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFolderListComponent } from './content-folder-list.component';

describe('ContentFolderListComponent', () => {
  let component: ContentFolderListComponent;
  let fixture: ComponentFixture<ContentFolderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFolderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFolderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
