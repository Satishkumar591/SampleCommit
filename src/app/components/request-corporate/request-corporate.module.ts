import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RequestCorporateRoutingModule} from './request-corporate-routing.module';
import {RequestComponent} from './request/request.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularMyDatePickerModule} from "angular-mydatepicker";
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';
import { DownloadApprovalComponent } from './download-approval/download-approval.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";

@NgModule({
  declarations: [RequestComponent, DownloadApprovalComponent],
    imports: [
        CommonModule,
        ChartsModule,
        Ng2GoogleChartsModule,
        NgxChartsModule,
        ChartistModule,
        RequestCorporateRoutingModule,
        Ng2SmartTableModule,
        NgxDatatableModule,
        FormsModule,
        NgbModule,
        DropzoneModule,
        NgSelectModule,
        AngularMyDatePickerModule,
        CorporateschoolModule,
        ReactiveFormsModule,
        InfiniteScrollModule
    ]
})
export class RequestCorporateModule { }
