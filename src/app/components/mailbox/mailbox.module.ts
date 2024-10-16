import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailboxComponent } from './mailbox/mailbox.component';
import { MailboxRoutingModule} from './mailbox-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthModule} from "../auth/auth.module";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [MailboxComponent],
    imports: [
        CommonModule,
        MailboxRoutingModule,
        ReactiveFormsModule,
        AuthModule,
        NgSelectModule
    ]
})
export class MailboxModule { }
