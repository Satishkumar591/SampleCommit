import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { HomeRoutingModule } from './home-routing.module';
import {ListHomeComponent} from './list-home/list-home.component';
import {AddHomeComponent} from './add-home/add-home.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {GalleryModule} from '@ks89/angular-modal-gallery';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';


@NgModule({
  declarations: [ListHomeComponent, AddHomeComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        HomeRoutingModule,
        GalleryModule,
        FormsModule,
        Ng2SearchPipeModule,
        CorporateschoolModule,
    ]
})
export class HomeModule { }
