import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import {ForgotComponent} from './components/auth/forgot/forgot.component';
import {AuthGuardService} from './shared/service/authgaurd';
import {ConfirmPasswordComponent} from './components/auth/confirm-password/confirm-password.component';
import {PdfComponent} from './components/pdf/pdf.component';
import {RoleGaurd} from './shared/service/roleGaurd';
import {EnrollclasscodeComponent} from './components/enrollclasscode/enrollclasscode.component';
import {SelectionComponent} from './components/auth/selection/selection.component';
import {PaymentComponent} from './components/payment/payment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    component: ContentLayoutComponent,
    children: content
  },
  {
    path: 'auth/login',
    canActivate: [RoleGaurd],
    component: LoginComponent,
  },
  {
    path: 'auth/login/:type/:classCode',
    // canActivate: [RoleGaurd],
    component: LoginComponent,
  },
  {
    path: 'auth/login/:type/',
    canActivate: [RoleGaurd],
    component: LoginComponent,
  },
  {
    path: 'pdf',
    component: PdfComponent,
  },
  {
    path: 'enrollclasscode/:type',
    component: EnrollclasscodeComponent,
  },
  {
    path: 'auth/forgotPassword',
    component: ForgotComponent,
  },
  {
    path: 'auth/select',
    component: SelectionComponent,
  },
  {
    path: 'auth/forgotPassword/:id',
    component: ForgotComponent,
  },
  {
    path: 'auth/setPassword/:id',
    component: ConfirmPasswordComponent,
  },
  {
    path: 'fortepayment',
    component: PaymentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    useHash: true
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
