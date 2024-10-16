import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {AssignmentCorrectionRoutingModule} from './correction-routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import {ListCorrectionComponent} from './list-correction/list-correction.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {GalleryModule} from '@ks89/angular-modal-gallery';
import { CorrectionPageComponent } from './correction-page/correction-page.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {SharedModule} from '../../shared/shared.module';
import {AuthModule} from '../auth/auth.module';
import {PipesModule} from "../../shared/pipes/pipes.module";
import {parse, stringify} from 'flatted';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';
import {ReportModule} from "../report/report.module";
import {NgxPaginationModule} from "ngx-pagination";
import {InfiniteScrollModule} from "ngx-infinite-scroll";


@NgModule({
  declarations: [ListCorrectionComponent, CorrectionPageComponent],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        GalleryModule,
        FormsModule,
        Ng2SearchPipeModule,
        AssignmentCorrectionRoutingModule,
        NgSelectModule,
        PdfViewerModule,
        SharedModule,
        AuthModule,
        PipesModule,
        CorporateschoolModule,
        ReportModule,
        NgxPaginationModule,
        InfiniteScrollModule
    ]
})
export class AssignmentCorrectionModule { }
