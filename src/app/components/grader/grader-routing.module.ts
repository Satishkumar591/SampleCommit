import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StudentWorkComponent} from './student-work/student-work.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'student-work/:type',
        component: StudentWorkComponent,
        data: {
          title: "Student Work",
          breadcrumb: "Student Work"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraderRoutingModule { }
