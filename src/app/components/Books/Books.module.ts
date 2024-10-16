import { NgModule } from '@angular/core';
import {CommonModule, TitleCasePipe} from '@angular/common';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BooksRoutingModule } from './Books-routing.module';
import {ListBooksComponent} from './list-Books/list-Books.component';
import {ViewComponent} from './list-Books/list-Books.component';
import {AddBooksComponent} from './add-Books/add-Books.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {TagInputModule} from 'ngx-chips';
import {CorporateschoolModule} from '../corporateschool/corporateschool.module';
import {SharedModule} from '../../shared/shared.module';
import {TreeviewModule} from 'ngx-treeview';
import {AuthModule} from '../auth/auth.module';

@NgModule({
  declarations: [ListBooksComponent, AddBooksComponent
      , ViewComponent
  ],
    imports: [
        CommonModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        BooksRoutingModule,
        DropzoneModule,
        NgSelectModule,
        FormsModule,
        PdfViewerModule,
        TagInputModule,
        CorporateschoolModule,
        SharedModule,
        TreeviewModule,
        AuthModule
    ],
    providers: [TitleCasePipe],
    entryComponents: [
        ViewComponent
    ],

})
export class BooksModule { }
