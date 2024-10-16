import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddHomeComponent} from './add-home/add-home.component';
import {ListHomeComponent} from './list-home/list-home.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-home',
        component: ListHomeComponent,
        data: {
          title: "Home List",
          breadcrumb: "Home List"
        }
      },
      {
        path: 'create-home/:type',
        component: AddHomeComponent,
        data: {
          title: "Home",
          breadcrumb: "Add Home"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
