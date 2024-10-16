import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CountToModule } from 'angular-count-to';
import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {NgApexchartsModule} from "ng-apexcharts";
import {PipesModule} from "../../shared/pipes/pipes.module";


@NgModule({
  declarations: [DashboardComponent],
    imports: [
        NgbModule,
        CommonModule,
        DashboardRoutingModule,
        CountToModule,
        SharedModule,
        ChartsModule,
        Ng2GoogleChartsModule,
        NgxChartsModule,
        ChartistModule,
        ReactiveFormsModule,
        NgApexchartsModule,
        PipesModule
    ]
})
export class DashboardModule { }
