import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddGradeComponent} from './add-grade/add-grade.component';
import {ListGradeComponent} from './list-grade/list-grade.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-grade',
        component: ListGradeComponent,
        data: {
          title: "Grade List",
          breadcrumb: "Grade List"
        }
      },
      {
        path: 'create-grade/:type',
        component: AddGradeComponent,
        data: {
          title: "Grade",
          breadcrumb: "Add Grade"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradeRoutingModule { }
