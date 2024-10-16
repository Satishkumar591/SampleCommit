import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddTeacherComponent} from './add-Teacher/add-Teacher.component';
import {ListTeacherComponent} from './list-Teacher/list-Teacher.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-Teacher',
        component: ListTeacherComponent,
        data: {
          title: 'Teacher List',
          breadcrumb: 'Teacher List'
        }
      },
      {
        path: 'create-Teacher/:type',
        component: AddTeacherComponent,
        data: {
          title: 'Teacher',
          breadcrumb: 'Add Teacher'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
