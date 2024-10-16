import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SubjectRoutingModule } from './subject-routing.module';
import {ListSubjectComponent} from './list-subject/list-subject.component';
import {AddSubjectComponent} from './add-subject/add-subject.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {CorporateschoolModule} from "../corporateschool/corporateschool.module";


@NgModule({
  declarations: [ListSubjectComponent, AddSubjectComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        SubjectRoutingModule,
        NgSelectModule,
        FormsModule,
        CorporateschoolModule
    ],
    providers: [TitleCasePipe]
})
export class SubjectModule { }
