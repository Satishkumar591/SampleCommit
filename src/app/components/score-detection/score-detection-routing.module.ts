import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScoreDetectionComponent } from './score-detection.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'score-details/:type',
        component: ScoreDetectionComponent,
        data: {
          title: "Score Details",
          breadcrumb: "Score Details"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoreDetectionRoutingModule { }
