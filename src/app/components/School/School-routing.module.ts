import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddSchoolComponent} from './add-School/add-School.component';
import {ListSchoolComponent} from './list-School/list-School.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-School',
        component: ListSchoolComponent,
        data: {
          title: 'Institution List',
          breadcrumb: 'Institution List'
        }
      },
      {
        path: 'create-School/:type',
        component: AddSchoolComponent,
        data: {
          title: 'Institution',
          breadcrumb: 'Add Institution'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
