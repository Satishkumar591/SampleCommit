import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddClassesComponent} from './add-classes/add-classes.component';
import {ListClassesComponent} from './list-classes/list-classes.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-classes',
        component: ListClassesComponent,
        data: {
          title: "Classes List",
          breadcrumb: "Classes List"
        }
      },
      {
        path: 'create-classes/:type',
        component: AddClassesComponent,
        data: {
          title: "Classes",
          breadcrumb: "Add Classes"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule { }
