import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MailboxComponent} from './mailbox/mailbox.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inbox',
        component: MailboxComponent,
        data: {
          title: 'Mail',
          breadcrumb: 'Mail'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailboxRoutingModule { }
