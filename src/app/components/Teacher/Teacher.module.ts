import { NgModule } from '@angular/core';
import {CommonModule, DatePipe, TitleCasePipe} from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TeacherRoutingModule } from './Teacher-routing.module';
import {ListTeacherComponent} from './list-Teacher/list-Teacher.component';
import {AddTeacherComponent} from './add-Teacher/add-Teacher.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {SharedModule} from '../../shared/shared.module';
import {TagInputModule} from 'ngx-chips';
import {ViewComponent} from './list-Teacher/list-Teacher.component';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';


@NgModule({
    declarations: [ListTeacherComponent, AddTeacherComponent, ViewComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        TeacherRoutingModule,
        NgSelectModule,
        AngularMyDatePickerModule,
        SharedModule,
        TagInputModule,
        FormsModule,
        CorporateschoolModule
    ],
    providers: [DatePipe, TitleCasePipe],
    exports: [
        ListTeacherComponent
    ],
    entryComponents: [ViewComponent]
})
export class TeacherModule { }
