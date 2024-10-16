import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddContentComponent} from './add-Content/add-Content.component';
import {ListContentComponent} from './list-Content/list-Content.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-Content',
        component: ListContentComponent,
        data: {
          title: "Content-Creator List",
          breadcrumb: "Content-Creator List"
        }
      },
      {
        path: 'create-Content/:type',
        component: AddContentComponent,
        data: {
          title: "Content-Creator",
          breadcrumb: "Add Content-Creator"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
