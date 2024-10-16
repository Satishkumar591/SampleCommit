import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ContentsRoutingModule} from './repository-routing.module';
import {ContentHomeComponent} from './content-home/content-home.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AddResourcesComponent } from './add-resources/add-resources.component';
import {NgbProgressbarModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { AddAssessmentComponent } from './add-assessment/add-assessment.component';
import {CreateAssessmentComponent} from './create-assessment/create-assessment.component';
import {VirtualScrollerModule} from 'ngx-virtual-scroller';
import {AuthGuardService} from '../../shared/service/authgaurd';
import {CommonDataService} from '../../shared/service/common-data.service';
import {SubjectServices} from '../../shared/service/subject.services';
import {CommonService} from '../../shared/service/common.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PreviewComponent } from './preview/preview.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {SharedModule} from '../../shared/shared.module';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';
import {PreviewResolver} from './preview/preview.resolver';
import { TreeviewModule } from 'ngx-treeview';
import {AuthModule} from '../auth/auth.module';


const customDefaultOptions = {
    scrollThrottlingTime: 0,
    scrollDebounceTime: 0,
    scrollAnimationTime: 750,
    checkResizeInterval: 1000,
    resizeBypassRefreshThreshold: 5,
    modifyOverflowStyleOfParentScroll: true,
    stripedTable: false
};

@NgModule({
    declarations: [ContentHomeComponent, AddResourcesComponent,
        AddAssignmentComponent, AddAssessmentComponent, CreateAssessmentComponent, PreviewComponent],
    imports: [
        CommonModule,
        ContentsRoutingModule,
        NgSelectModule,
        FormsModule,
        TagInputModule,
        ReactiveFormsModule,
        DragDropModule,
        ReactiveFormsModule,
        PdfViewerModule,
        PdfJsViewerModule,
        NgbTimepickerModule,
        AngularMyDatePickerModule,
        VirtualScrollerModule,
        InfiniteScrollModule,
        CKEditorModule,
        SharedModule,
        CKEditorModule,
        PipesModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        CorporateschoolModule,
        NgbProgressbarModule,
        TreeviewModule.forRoot(),
        AuthModule
    ],
    providers: [AuthGuardService, CommonDataService, SubjectServices, CommonService, DatePipe, PreviewResolver,
        {provide: 'virtual-scroller-default-options', useValue: customDefaultOptions}],
    exports: [
        PreviewComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class ContentModule { }
