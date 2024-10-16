import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {DashboardModule} from './components/dashboard/dashboard.module';
import {SharedModule} from './shared/shared.module';
import {ProductsModule} from './components/products/products.module';
import {SalesModule} from './components/sales/sales.module';
import {CouponsModule} from './components/coupons/coupons.module';
import {PagesModule} from './components/pages/pages.module';
import {MailboxModule} from './components/mailbox/mailbox.module';
import {MenusModule} from './components/menus/menus.module';
import {VendorsModule} from './components/vendors/vendors.module';
import {UsersModule} from './components/users/users.module';
import {LocalizationModule} from './components/localization/localization.module';
import {InvoiceModule} from './components/invoice/invoice.module';
import {SettingModule} from './components/setting/setting.module';
import {ReportsModule} from './components/reports/reports.module';
import {AuthModule} from './components/auth/auth.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {AuthGuardService} from './shared/service/authgaurd';
import {CommonDataService} from './shared/service/common-data.service';
import {SubjectServices} from './shared/service/subject.services';
import {CommonService} from './shared/service/common.service';
import {PdfComponent} from './components/pdf/pdf.component';
import {ServerHttpInterceptor} from './shared/service/http.interceptor';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {DatePipe} from '@angular/common';
import {PipesModule} from './shared/pipes/pipes.module';
import {RoleGaurd} from './shared/service/roleGaurd';
import {APP_INITIALIZER} from '@angular/core';
import {EnvironmentService} from './environment.service';
import {DeactivateAnswering} from './shared/service/answering-deactivate';
import {StudentContentModule} from './components/student-content/student-content.module';
import {NgbModule, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {ConnectionServiceModule} from 'ng-connection-service';
import { EnrollclasscodeComponent } from './components/enrollclasscode/enrollclasscode.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { CustomMaterialModule } from './material.module';
import { PaymentComponent} from './components/payment/payment.component';

@NgModule({
    declarations: [
        AppComponent,
        PdfComponent,
        EnrollclasscodeComponent,
        PaymentComponent
    ],
    imports: [
        BrowserAnimationsModule,
        ToastrModule.forRoot(), // ToastrModule added
        DeviceDetectorModule.forRoot(),
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        HttpClientModule,
        AppRoutingModule,
        DashboardModule,
        InvoiceModule,
        SettingModule,
        ReportsModule,
        StudentContentModule,
        AuthModule,
        SharedModule,
        LocalizationModule,
        ProductsModule,
        SalesModule,
        VendorsModule,
        CouponsModule,
        PagesModule,
        MailboxModule,
        MenusModule,
        UsersModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
        PdfJsViewerModule,
        DragDropModule,
        PipesModule,
        CKEditorModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgbModule,
        ConnectionServiceModule,
        NgSelectModule,
        CustomMaterialModule
    ],
    providers: [
        NgbTooltipConfig,
        AuthGuardService, RoleGaurd, CommonDataService, SubjectServices, CommonService, DatePipe, DeactivateAnswering,
        {provide: HTTP_INTERCEPTORS, useClass: ServerHttpInterceptor, multi: true},
        {
            provide: APP_INITIALIZER, useFactory: (envService: EnvironmentService) => () => envService.init(),
            deps: [EnvironmentService], multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
