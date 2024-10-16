import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ContentTextResourceRoutingModule } from './content-text-resource-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TagInputModule} from 'ngx-chips';
import {SharedModule} from '../../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import {TextResourceComponent} from './text-resource/text-resource.component';
import {TextAssignmentComponent} from './text-assignment/text-assignment.component';
// import { CKEditorModule} from 'ngx-ckeditor';
import { AddQuestionsComponent } from './add-questions/add-questions.component';
import { QuestionPageComponent } from './question-page/question-page.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {AuthModule} from '../auth/auth.module';
import {HandwritingModule} from '../handwriting/handwriting.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import { TreeviewModule } from 'ngx-treeview';
import { PassageComponent } from './passage/passage.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
@NgModule({
  declarations: [TextResourceComponent, TextAssignmentComponent, AddQuestionsComponent, QuestionPageComponent, PassageComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        ContentTextResourceRoutingModule,
        NgSelectModule,
        AngularMyDatePickerModule,
        FormsModule,
        TagInputModule,
        SharedModule,
        QuillModule.forRoot(),
        CKEditorModule,
        DragDropModule,
        AuthModule,
        HandwritingModule,
        PipesModule,
        TreeviewModule,
        NgxDatatableModule
    ],
    providers: [TitleCasePipe],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class ContentTextResourceModule { }
