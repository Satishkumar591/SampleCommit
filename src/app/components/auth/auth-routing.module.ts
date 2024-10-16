import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ForgotComponent} from './forgot/forgot.component';
import {ConfirmPasswordComponent} from './confirm-password/confirm-password.component';
import {SelectionComponent} from './selection/selection.component';
import {StudentAnnotationComponent} from './student-annotation/student-annotation.component';
import {RegistrationComponent} from './registration/registration.component';
import {TinyMiceComponent} from './tiny-mice/tiny-mice.component';
import {TeacherRegistrationComponent} from './teacher-registration/teacher-registration.component';
import {CreatorRegistrationComponent} from './creator-registration/creator-registration.component';
import {StudentGraphComponent} from './student-graph/student-graph.component';
import {ParentRegistrationComponent} from './parent-registration/parent-registration.component';
import {IpadQuestionViewComponent} from './ipad-question-view/ipad-question-view.component';
import { StudentScratchComponent} from './student-scratch/student-scratch.component';
import {StudentLinkComponent} from './student-link/student-link.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent ,
  },
  {
    path: 'login/:type',
    component: LoginComponent ,
  },
  {
    path: 'forgotPassword/:type',
    component: ForgotComponent,
  },
  {
    path: 'setPassword',
    component: ConfirmPasswordComponent,
  },
  {
    path: 'select',
    component: SelectionComponent
  },
  {
    path: 'student-annotation/:type/:id',
    component: StudentAnnotationComponent
  },
  {
    path: 'student-link/:type/:id',
    component: StudentLinkComponent
  },
  {
    // path: 'student-annotation/:type/:mode/:id',
    path: 'student-scratch/:accesstoken/:student_id/:school_id/:content_id/:content_format/:class_id/:student_content_id/:class_content_id/:student_content_status/:type',
    component: StudentScratchComponent
  },
  // {
  //   path: 'handwritting',
  //   component: HandwrittingComponent,
  // },
  {
    path: 'auth/welcomeStudent/:type',
    component: RegistrationComponent
  },
  {
    path: 'auth/welcomeTeacher/:type',
    component: TeacherRegistrationComponent
  },
  {
    path: 'auth/welcomeContentcreator/:type',
    component: CreatorRegistrationComponent
  },
  {
    path: 'graphing/:studentId/:cId/:qId/:classId/:quesType/:format/:typeId',
    component: StudentGraphComponent,
  },
  {
    path: 'tinymice',
    component: TinyMiceComponent,
  },
  {
    path: 'registration',
    component: ParentRegistrationComponent,
  },
  {
    path: 'auth/ipad-question-view/:studentId/:cId/:qId/:classId/:typeId/:showID',
    component: IpadQuestionViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
