import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListContentComponent} from './list-content/list-content.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-content/:type',
        component: ListContentComponent,
        data: {
          title: 'Student-Work List',
          breadcrumb: 'Student-Work'
        }
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentContentRoutingModule { }
