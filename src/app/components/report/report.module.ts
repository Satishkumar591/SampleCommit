import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';


import { Ng2SmartTableModule } from 'ng2-smart-table';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TagInputModule} from 'ngx-chips';
import {AssessmentSummaryComponent} from './assessment-summary/assessment-summary.component';
import {StudentGradeSummaryComponent} from './student-grade-summary/student-grade-summary.component';
import {ReportRoutingModule} from './report-routing.module';
import {NgApexchartsModule} from 'ng-apexcharts';
import {AuthModule} from '../auth/auth.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { GradeReportComponent } from './grade-report/grade-report.component';
import {MissedWorkReportComponent} from './missed-work-report/missed-work-report.component';
import {StudentPerformanceReportComponent} from './student-performance-report/student-performance-report.component';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CorporateschoolModule} from "../corporateschool/corporateschool.module";
import {StudentloginModule} from "../studentlogin/studentlogin.module";
import { ItemsReportComponent } from './items-report/items-report.component';

@NgModule({
    declarations: [AssessmentSummaryComponent, StudentGradeSummaryComponent, GradeReportComponent, MissedWorkReportComponent, StudentPerformanceReportComponent, ItemsReportComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        DropzoneModule,
        NgSelectModule,
        FormsModule,
        AngularMyDatePickerModule,
        ReportRoutingModule,
        TagInputModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgApexchartsModule,
        NgxDatatableModule,
        AuthModule,
        PipesModule,
        PdfViewerModule,
        CorporateschoolModule,
        StudentloginModule,
    ],
    exports: [
        MissedWorkReportComponent,
        ItemsReportComponent
    ],
    providers: [TitleCasePipe]
})
export class ReportModule { }
