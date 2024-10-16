import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddClassroomComponent} from './add-classroom/add-classroom.component';
import {ListClassroomComponent} from './list-classroom/list-classroom.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-classroom',
        component: ListClassroomComponent,
        data: {
          title: 'Content Folder List',
          breadcrumb: 'Content Folder List'
        }
      },
      {
        path: 'create-classroom/:type',
        component: AddClassroomComponent,
        data: {
          title: 'Content Folder',
          breadcrumb: 'Add Content Folder'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassroomRoutingModule { }
