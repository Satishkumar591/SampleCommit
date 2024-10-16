import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TextHandwritingComponent} from './text-handwriting/text-handwriting.component';
import {MathHandwritingComponent} from './math-handwriting/math-handwriting.component';
import {DiagramHandwritingComponent} from './diagram-handwriting/diagram-handwriting.component';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'text-handwriting',
        component: TextHandwritingComponent,
        data: {
          title: '',
          breadcrumb: ''
        }
      },
      {
        path: 'math-handwriting',
        component: MathHandwritingComponent,
        data: {
          title: '',
          breadcrumb: ''
        }
      },
      {
        path: 'diagram-handwriting',
        component: DiagramHandwritingComponent,
        data: {
          title: '',
          breadcrumb: ''
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HandwritingRoutingModule { }
