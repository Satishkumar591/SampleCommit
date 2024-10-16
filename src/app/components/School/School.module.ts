import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SchoolRoutingModule } from './School-routing.module';
import {ListSchoolComponent} from './list-School/list-School.component';
import {AddSchoolComponent} from './add-School/add-School.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {GalleryModule} from '@ks89/angular-modal-gallery';
import {SharedModule} from '../../shared/shared.module';
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [ListSchoolComponent, AddSchoolComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        SchoolRoutingModule,
        GalleryModule,
        FormsModule,
        Ng2SearchPipeModule,
        SharedModule,
        NgSelectModule,
    ]
})
export class SchoolModule { }
