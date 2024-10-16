import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreDetectionRoutingModule } from './score-detection-routing.module';
import { ScoreDetectionComponent } from './score-detection.component';


@NgModule({
  declarations: [ScoreDetectionComponent],
  imports: [
    CommonModule,
    ScoreDetectionRoutingModule
  ]
})
export class ScoreDetectionModule { }
