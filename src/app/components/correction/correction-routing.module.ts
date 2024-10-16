import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCorrectionComponent} from './list-correction/list-correction.component';
import { CorrectionPageComponent} from './correction-page/correction-page.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-correction',
        component: ListCorrectionComponent,
        data: {
          title: 'Assessment - Correction List',
          breadcrumb: 'Assessment List'
        }
      },
      {
        path: 'correction-page',
        component: CorrectionPageComponent,
        data: {
          title: 'Student Progress',
          breadcrumb: 'Progress'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentCorrectionRoutingModule { }
