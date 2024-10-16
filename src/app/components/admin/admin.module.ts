import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AdminRoutingModule } from './admin-routing.module';
import {ListAdminComponent} from './list-admin/list-admin.component';
import {ViewComponent} from './list-admin/list-admin.component';
import {AddAdminComponent} from './add-admin/add-admin.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TagInputModule} from 'ngx-chips';
import {SharedModule} from '../../shared/shared.module';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';

@NgModule({
  declarations: [ListAdminComponent, AddAdminComponent, ViewComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        NgSelectModule,
        AngularMyDatePickerModule,
        TagInputModule,
        FormsModule,
        SharedModule,
        CorporateschoolModule
    ],
    providers: [TitleCasePipe],
    entryComponents: [ViewComponent],
    exports: [
        ListAdminComponent
    ],
})
export class AdminModule { }
