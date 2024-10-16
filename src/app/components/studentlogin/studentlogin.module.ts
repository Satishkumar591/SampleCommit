import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA,  NO_ERRORS_SCHEMA} from '@angular/core';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { StudentloginRoutingModule } from './studentlogin-routing.module';
import {ListHomeComponent} from './list-home/list-home.component';
import {StudentProfileComponent} from './student-profile/student-profile.component';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {StudentlistClassComponent} from './studentlist-class/studentlist-class.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbAccordionModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import { AssessmentComponent } from './assessment/assessment.component';
import {SharedModule} from '../../shared/shared.module';
import {ClassDetailComponent} from './class-detail/class-detail.component';
import { AssingmentsComponent} from './assingments/assingments.component';
import { ReportsComponent} from './reports/reports.component';
import { AnsweringComponent } from './answering/answering.component';
import {AuthModule} from '../auth/auth.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {StudentPreviewComponent} from './student-preview/student-preview.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { AnswerSheetComponent } from './answer-sheet/answer-sheet.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxPaginationModule} from 'ngx-pagination';
import { OveralldetailsComponent } from './overalldetails/overalldetails.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { AnsweringResolver} from './answering/answering.resolver';
import { ResourceComponent } from './resource/resource.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { Angular2SignaturepadModule} from 'angular2-signaturepad';
import {CanvasWhiteboardModule} from "ng2-canvas-whiteboard";
import { RepositoryComponent } from './repository/repository.component';
import { RepositoryAddComponent } from './repository-add/repository-add.component';
import {TagInputModule} from "ngx-chips";
import { ContentFolderListComponent } from './content-folder-list/content-folder-list.component';
import { ContentFolderCreateComponent } from './content-folder-create/content-folder-create.component';
import { AssignedContentComponent } from './assigned-content/assigned-content.component';
import { EnrollclassComponent } from './enrollclass/enrollclass.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { StudentOverallProfileDetailsComponent } from './student-overall-profile-details/student-overall-profile-details.component';
import {StudentReportComponent} from './student-report/student-report.component';

// import { NinjaSplitterModule } from 'ninja-splitter';



@NgModule({
    declarations: [ListHomeComponent, AssessmentComponent, StudentProfileComponent, AssingmentsComponent, ReportsComponent, StudentReportComponent,
        StudentlistClassComponent, AnsweringComponent, ClassDetailComponent, StudentPreviewComponent, AnswerSheetComponent, OveralldetailsComponent, ResourceComponent, RepositoryComponent, RepositoryAddComponent, ContentFolderListComponent, ContentFolderCreateComponent, AssignedContentComponent, EnrollclassComponent, StudentOverallProfileDetailsComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        StudentloginRoutingModule,
        NgSelectModule,
        FormsModule,
        AngularMyDatePickerModule,
        SharedModule,
        AuthModule,
        PipesModule,
        PdfViewerModule,
        CanvasWhiteboardModule,
        DragDropModule,
        NgxPaginationModule,
        NgxDatatableModule,
        InfiniteScrollModule,
        Angular2SignaturepadModule,
        TagInputModule,
        CustomMaterialModule,
        NgbAccordionModule
        // NinjaSplitterModule
    ],
    providers: [TitleCasePipe, AnsweringResolver],
    exports: [
        OveralldetailsComponent,
        AnswerSheetComponent,
        StudentReportComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class StudentloginModule { }
