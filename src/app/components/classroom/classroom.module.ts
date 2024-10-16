import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {ListClassroomComponent} from './list-classroom/list-classroom.component';
import {AddClassroomComponent} from './add-classroom/add-classroom.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ClassroomRoutingModule } from './classroom-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';
import {AuthModule} from "../auth/auth.module";


@NgModule({
  declarations: [ListClassroomComponent, AddClassroomComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        ClassroomRoutingModule,
        DropzoneModule,
        NgSelectModule,
        FormsModule,
        CorporateschoolModule,
        AuthModule
    ],
    providers: [TitleCasePipe]
})
export class ClassroomModule { }
