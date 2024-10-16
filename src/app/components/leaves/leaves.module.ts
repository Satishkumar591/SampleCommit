import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { LeavesRoutingModule } from './leaves-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';
import {AddHolidayComponent} from './add-holiday/add-holiday.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
// import {NgxDatatableModule} from '@swimlane/ngx-datatable';
// import {ContentRoutingModule} from '../../../../../admin/src/app/components/Content-Creator/Content-routing.module';
// import {SharedModule} from '../../../../../admin/src/app/shared/shared.module';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TagInputModule} from 'ngx-chips';
import {CorporateschoolModule} from "../corporateschool/corporateschool.module";



@NgModule({
  declarations: [AddHolidayComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        LeavesRoutingModule,
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
    ],
    providers: [TitleCasePipe]
})
export class LeavesModule { }
