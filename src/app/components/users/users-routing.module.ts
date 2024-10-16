import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

const routes: Routes = [
  {
    path: 'user-list',
    component: ListUserComponent,
    data: {
      title: 'Users',
      breadcrumb: 'Users'
    }
  }, {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: {
      title: 'Change Password',
      breadcrumb: 'Change Password'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
