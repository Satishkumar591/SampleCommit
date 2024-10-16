import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ContentRoutingModule } from './Content-routing.module';
import {ListContentComponent} from './list-Content/list-Content.component';
import {ViewComponent} from './list-Content/list-Content.component';
import {AddContentComponent} from './add-Content/add-Content.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TagInputModule} from 'ngx-chips';
import {SharedModule} from '../../shared/shared.module';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';


@NgModule({
    declarations: [ListContentComponent, AddContentComponent, ViewComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        ContentRoutingModule,
        NgSelectModule,
        AngularMyDatePickerModule,
        FormsModule,
        TagInputModule,
        SharedModule,
        CorporateschoolModule
    ],
    providers: [TitleCasePipe],
    entryComponents: [ViewComponent],

    exports: [
        ListContentComponent
    ]
})
export class ContentModule { }
