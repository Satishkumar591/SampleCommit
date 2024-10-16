import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { SettingRoutingModule } from './setting-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../../shared/shared.module';
import {SettingsListComponent} from './settings-list/settings-list.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ButtonViewComponent} from './settings-list/settings-list.component';
import {AngularMyDatePickerModule} from "angular-mydatepicker";
import {NgSelectModule} from '@ng-select/ng-select';
import {PipesModule} from "../../shared/pipes/pipes.module";

@NgModule({
  declarations: [ProfileComponent, SettingsListComponent, ButtonViewComponent],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        SettingRoutingModule,
        SharedModule,
        Ng2SmartTableModule,
        FormsModule,
        AngularMyDatePickerModule,
        NgSelectModule,
        PipesModule
    ]
})
export class SettingModule { }
