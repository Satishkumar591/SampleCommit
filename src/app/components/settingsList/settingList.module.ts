import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SettingListRoutingModule } from './settingList-routing.module';
import {ListSettingsComponent} from './list-settings/list-settings.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {TagInputModule} from 'ngx-chips';
import {CorporateschoolModule} from "../corporateschool/corporateschool.module";
import {AngularMyDatePickerModule} from "angular-mydatepicker";

@NgModule({
  declarations: [ListSettingsComponent
  ],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        SettingListRoutingModule,
        DropzoneModule,
        NgSelectModule,
        FormsModule,
        PdfViewerModule,
        TagInputModule,
        CorporateschoolModule,
        AngularMyDatePickerModule
    ],
    providers: [TitleCasePipe],
    entryComponents: [
        
    ],

})
export class SettingListModule { }
