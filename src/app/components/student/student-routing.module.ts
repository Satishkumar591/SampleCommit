import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddStudentComponent} from './add-student/add-student.component';
import {ListTemplateComponent} from './list-student/list-student.component';
import {UpgradeComponent} from './upgrade/upgrade.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-student',
        component: ListTemplateComponent,
        data: {
          title: 'Student List',
          breadcrumb: 'student List'
        }
      },
      {
        path: 'create-student/:type',
        component: AddStudentComponent,
        data: {
          title: 'Student',
          breadcrumb: 'Add Student'
        }
      },
      {
        path: 'upgrade',
        component: UpgradeComponent,
        data: {
          title: 'Upgrade',
          breadcrumb: 'Upgrade'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
