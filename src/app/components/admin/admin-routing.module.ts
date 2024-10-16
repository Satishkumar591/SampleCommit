import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddAdminComponent} from './add-admin/add-admin.component';
import {ListAdminComponent} from './list-admin/list-admin.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-admin',
        component: ListAdminComponent,
        data: {
          title: 'Admin List',
          breadcrumb: 'Admin List'
        }
      },
      {
        path: 'create-admin/:type',
        component: AddAdminComponent,
        data: {
          title: 'Admin',
          breadcrumb: 'Add Admin'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
