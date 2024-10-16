import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {ForgotComponent} from './forgot/forgot.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {SharedModule} from '../../shared/shared.module';
import {ConfirmPasswordComponent} from './confirm-password/confirm-password.component';
import {SelectionComponent} from './selection/selection.component';
import {StudentAnnotationComponent} from './student-annotation/student-annotation.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {TagInputModule} from 'ngx-chips';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {VirtualScrollerModule} from 'ngx-virtual-scroller';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonDataService} from '../../shared/service/common-data.service';
import {SubjectServices} from '../../shared/service/subject.services';
import {CommonService} from '../../shared/service/common.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {HandwrittingComponent} from './handwritting/handwritting.component';
import {AutofocusModule} from 'angular-autofocus-fix';
import {RegistrationComponent} from './registration/registration.component';
import {GraphComponentComponent} from './graph-component/graph-component.component';
import {TinyMiceComponent} from './tiny-mice/tiny-mice.component';
import {EditorModule} from '@tinymce/tinymce-angular';
import {TeacherRegistrationComponent} from './teacher-registration/teacher-registration.component';
import {CreatorRegistrationComponent} from './creator-registration/creator-registration.component';
import {StudentGraphComponent} from './student-graph/student-graph.component';
import {RemoveStudentAnnotationComponent} from './remove-student-annotation/remove-student-annotation.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {AnnotationComponent} from './annotation/annotation.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {ParentRegistrationComponent} from './parent-registration/parent-registration.component';
import {IpadQuestionViewComponent} from './ipad-question-view/ipad-question-view.component';
import { ConfirmContentAssignComponent } from './confirm-content-assign/confirm-content-assign.component';
import { TreeviewContentfolderComponent } from './treeview-contentfolder/treeview-contentfolder.component';
import {TreeviewModule} from 'ngx-treeview';
import {StudentScratchComponent} from './student-scratch/student-scratch.component';
import { StudentLinkComponent } from './student-link/student-link.component';
import { StudentWebAnnotationComponent } from './student-web-annotation/student-web-annotation.component';

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
    declarations: [LoginComponent, ForgotComponent, ConfirmPasswordComponent, SelectionComponent, ConfirmContentAssignComponent,
        StudentAnnotationComponent, HandwrittingComponent, RegistrationComponent, AnnotationComponent, StudentScratchComponent,
        GraphComponentComponent, TeacherRegistrationComponent, CreatorRegistrationComponent, TinyMiceComponent,
        StudentGraphComponent, RemoveStudentAnnotationComponent, ParentRegistrationComponent, IpadQuestionViewComponent,
        ConfirmContentAssignComponent, TreeviewContentfolderComponent, StudentLinkComponent, StudentWebAnnotationComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        NgbModule,
        PdfViewerModule,
        PdfJsViewerModule,
        CarouselModule,
        SharedModule,
        TagInputModule,
        NgbTimepickerModule,
        AngularMyDatePickerModule,
        VirtualScrollerModule,
        InfiniteScrollModule,
        CKEditorModule,
        DragDropModule,
        NgSelectModule,
        FormsModule,
        AutofocusModule,
        EditorModule,
        PipesModule,
        ColorPickerModule,
        TreeviewModule
    ],
    providers: [CommonDataService, SubjectServices, CommonService, DatePipe,
        {provide: 'virtual-scroller-default-options', useValue: customDefaultOptions}],
    exports: [
        GraphComponentComponent,
        TinyMiceComponent,
        AnnotationComponent,
        ConfirmContentAssignComponent,
        TreeviewContentfolderComponent,
        StudentWebAnnotationComponent,
        StudentAnnotationComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class AuthModule {
}
