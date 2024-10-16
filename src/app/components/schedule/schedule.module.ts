import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import {SchedulesRoutingModule} from './schedule-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';
import {MyScheduleComponent} from './my-schedule/my-schedule.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
// import {NgxDatatableModule} from '@swimlane/ngx-datatable';
// import {ContentRoutingModule} from '../../../../../admin/src/app/components/Content-Creator/Content-routing.module';
// import {SharedModule} from '../../../../../admin/src/app/shared/shared.module';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TagInputModule} from 'ngx-chips';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import {StudentloginModule} from "../studentlogin/studentlogin.module";
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import {ReportModule} from "../report/report.module";
import {PipesModule} from "../../shared/pipes/pipes.module";
import { CustomMaterialModule } from 'src/app/material.module';
import {AuthModule} from "../auth/auth.module";




@NgModule({
  declarations: [MyScheduleComponent, DailyScheduleComponent, SchedulePageComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        SchedulesRoutingModule,
        DropzoneModule,
        NgSelectModule,
        FormsModule,
        AngularMyDatePickerModule,
        TagInputModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        CorporateschoolModule,
        CustomMaterialModule,
        StudentloginModule,
        ReportModule,
        PipesModule,
        AuthModule
    ],
    providers: [TitleCasePipe]
})
export class ScheduleModule { }
