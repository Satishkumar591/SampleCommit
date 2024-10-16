import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddSubjectComponent} from './add-subject/add-subject.component';
import {ListSubjectComponent} from './list-subject/list-subject.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-subject',
        component: ListSubjectComponent,
        data: {
          title: "Subject List",
          breadcrumb: "Subject List"
        }
      },
      {
        path: 'create-subject/:type',
        component: AddSubjectComponent,
        data: {
          title: "Subject",
          breadcrumb: "Add Subject"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }
