import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorporateschoolRoutingModule } from './corporateschool-routing.module';
import { EmptyschoolComponent } from './emptyschool/emptyschool.component';


@NgModule({
    declarations: [EmptyschoolComponent],
    exports: [
        EmptyschoolComponent
    ],
    imports: [
        CommonModule,
        CorporateschoolRoutingModule
    ]
})
export class CorporateschoolModule { }
