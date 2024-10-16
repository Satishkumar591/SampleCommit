import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentWorkComponent } from './student-work/student-work.component';
import {StudentContentRoutingModule} from '../student-content/student-content-routing.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {GraderRoutingModule} from "./grader-routing.module";
import {PipesModule} from "../../shared/pipes/pipes.module";
// import {GradeModule} from '../grade/grade.module';

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
  declarations: [StudentWorkComponent],
    imports: [
        CommonModule,
        StudentContentRoutingModule,
        NgSelectModule,
        GraderRoutingModule,
        FormsModule,
        InfiniteScrollModule,
        PipesModule,
    ],
  providers: [
    {provide: 'virtual-scroller-default-options', useValue: customDefaultOptions}
  ]
})
export class  GraderModule { }
