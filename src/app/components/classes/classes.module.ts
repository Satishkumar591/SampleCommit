import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ClassesRoutingModule } from './classes-routing.module';
import {ListClassesComponent} from './list-classes/list-classes.component';
import {AddClassesComponent} from './add-classes/add-classes.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {GalleryModule} from '@ks89/angular-modal-gallery';


@NgModule({
  declarations: [ListClassesComponent, AddClassesComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        ClassesRoutingModule,
        GalleryModule,
        FormsModule,
        Ng2SearchPipeModule,
    ]
})
export class ClassesModule { }
