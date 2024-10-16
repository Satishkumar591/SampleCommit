import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFolderCreateComponent } from './content-folder-create.component';

describe('ContentFolderCreateComponent', () => {
  let component: ContentFolderCreateComponent;
  let fixture: ComponentFixture<ContentFolderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFolderCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFolderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
