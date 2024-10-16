import { NgModule } from '@angular/core';

import {CommonModule, TitleCasePipe} from '@angular/common';
import {HandwritingRoutingModule} from './handwriting-routing.module';
import {TextHandwritingComponent} from './text-handwriting/text-handwriting.component';
import {DiagramHandwritingComponent} from './diagram-handwriting/diagram-handwriting.component';
import {MathHandwritingComponent} from './math-handwriting/math-handwriting.component';



@NgModule({
    declarations: [
        TextHandwritingComponent,
        DiagramHandwritingComponent,
        MathHandwritingComponent
    ],
    imports: [
        CommonModule,
        HandwritingRoutingModule
    ],
    exports: [
        TextHandwritingComponent,
        DiagramHandwritingComponent,
        MathHandwritingComponent
    ],
    providers: [TitleCasePipe]
})
export class HandwritingModule { }
