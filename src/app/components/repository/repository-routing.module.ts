import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContentHomeComponent} from './content-home/content-home.component';
import {AddResourcesComponent} from './add-resources/add-resources.component';
import {AddAssessmentComponent} from './add-assessment/add-assessment.component';
import {AddAssignmentComponent} from './add-assignment/add-assignment.component';
import {CreateAssessmentComponent} from './create-assessment/create-assessment.component';
import {PreviewComponent} from './preview/preview.component';
import {StudentAnnotationComponent} from '../auth/student-annotation/student-annotation.component';
import {AnsweringResolver} from '../studentlogin/answering/answering.resolver';
import {PreviewResolver} from './preview/preview.resolver';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'content-home',
        component: ContentHomeComponent,
        data: {
          title: 'Content-Library',
          breadcrumb: 'Content-Library'
        }
      },
      {
        path: 'content-home/:type',
        component: ContentHomeComponent,
        data: {
          title: 'Content-Library',
          breadcrumb: 'Content-Library/:type'
        }
      },
      {
        path: 'add-resources/:type',
        component: AddResourcesComponent,
        data: {
          // title: "add-resources",
          breadcrumb: 'Repository/add-resources'
        }
      },
      {
        path: 'add-assignment/:type',
        component: AddAssignmentComponent,
        data: {
          title: 'add-assignment',
          breadcrumb: 'Repository/add-assignment'
        }
      },
      {
        path: 'add-assessment/:type',
        component: AddAssessmentComponent,
        data: {
          title: 'add-assessment',
          breadcrumb: 'Repository/add-assessment'
        }
      },
      {
        path: 'create-assessment/:type',
        component: CreateAssessmentComponent,
        data: {
          breadcrumb: 'Create-Assessment'
        }
      },
      {
        path: 'preview',
        component: PreviewComponent,
        data: {
          title: 'Preview',
          student_title: 'Student Preview',
          teacher_title: 'teacher view',
          breadcrumb: 'Preview'
        },
        resolve: {
          list : PreviewResolver
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentsRoutingModule { }
