import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RequestComponent} from './request/request.component';
import {DownloadApprovalComponent} from "./download-approval/download-approval.component";

const routes: Routes = [
  {
    path: 'request',
    component: RequestComponent,
    data: {
      title: 'Corporate Access',
      data1: true,
      corporateTitle: 'Pending Approval',
      breadcrumb: 'Request Corporate'
    }
  },
  {
    path: 'download-request',
    component: DownloadApprovalComponent,
    data: {
      title: 'PDF download Request',
      adminTitle: 'PDF download Request',
      breadcrumb: 'Download Request'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestCorporateRoutingModule { }
