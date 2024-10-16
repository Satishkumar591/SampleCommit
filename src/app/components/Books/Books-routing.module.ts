import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddBooksComponent} from './add-Books/add-Books.component';
import {ListBooksComponent} from './list-Books/list-Books.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-Books',
        component: ListBooksComponent,
        data: {
          title: "Books List",
          breadcrumb: "Books List"
        }
      },
      {
        path: 'create-Books/:type',
        component: AddBooksComponent,
        data: {
          title: "Content",
          breadcrumb: "Add Content"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
