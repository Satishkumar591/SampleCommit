import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ClassRoutingModule} from './class-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';
import {ListClassComponent} from './list-class/list-class.component';
import {AddClassComponent} from './add-class/add-class.component';
import {ViewAssignComponent} from './view-assign/view-assign.component';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TagInputModule} from 'ngx-chips';
import { SubmitClassComponent } from './submit-class/submit-class.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {ReportModule} from '../report/report.module';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {StudentloginModule} from '../studentlogin/studentlogin.module';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {AuthModule} from '../auth/auth.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TopicsCurriculumComponent } from './topics-curriculum/topics-curriculum.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ListClassComponent, AddClassComponent, SubmitClassComponent, ViewAssignComponent, TopicsCurriculumComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        ClassRoutingModule,
        DropzoneModule,
        NgSelectModule,
        FormsModule,
        AngularMyDatePickerModule,
        TagInputModule,
        Ng2SearchPipeModule,
        NgxDatatableModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        ReportModule,
        CorporateschoolModule,
        InfiniteScrollModule,
        StudentloginModule,
        PdfViewerModule,
        PipesModule,
        AuthModule,
        CustomMaterialModule,
        NgMultiSelectDropDownModule.forRoot(),
        DragDropModule,
        NgbAccordionModule
    ],
    providers: [TitleCasePipe]
})
export class ClassModule { }
