import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SortingPipe} from './sorting/sorting.pipe';
import {SanitizeHtmlPipe} from './sanitizer/SanitizeHtmlPipe.pipe';
import { CustomDateFormatPipe } from './custom-date-format.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SortingPipe,
        SanitizeHtmlPipe,
        CustomDateFormatPipe
    ],
    exports: [
        SortingPipe,
        SanitizeHtmlPipe,
        CustomDateFormatPipe
    ]
})
export class PipesModule { }
