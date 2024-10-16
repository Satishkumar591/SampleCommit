import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentContentRoutingModule } from './student-content-routing.module';
import { ListContentComponent } from './list-content/list-content.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {AngularMyDatePickerModule} from "angular-mydatepicker";
import {PipesModule} from "../../shared/pipes/pipes.module";
import {StudentloginModule} from "../studentlogin/studentlogin.module";
import {AuthModule} from "../auth/auth.module";

const customDefaultOptions = {
  scrollThrottlingTime: 0,
  scrollDebounceTime: 0,
  scrollAnimationTime: 750,
  checkResizeInterval: 1000,
  resizeBypassRefreshThreshold: 5,
  modifyOverflowStyleOfParentScroll: true,
  stripedTable: false
};

@NgModule({
  declarations: [ListContentComponent],
    imports: [
        CommonModule,
        StudentContentRoutingModule,
        NgSelectModule,
        FormsModule,
        InfiniteScrollModule,
        AngularMyDatePickerModule,
        PipesModule,
        StudentloginModule,
        AuthModule
    ],
  providers: [
    {provide: 'virtual-scroller-default-options', useValue: customDefaultOptions}
  ]
})
export class StudentContentModule { }
