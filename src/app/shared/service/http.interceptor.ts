import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter, tap, finalize } from 'rxjs/operators';
import { CommonDataService } from './common-data.service';
import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';
import { ToastrService } from 'ngx-toastr';
import { EnvironmentService } from '../../environment.service';


@Injectable()


export class ServerHttpInterceptor implements HttpInterceptor {

    allow: boolean;
    constructor(public commondata: CommonDataService, public auth: AuthService, public configurationService: EnvironmentService,
        public toastr: ToastrService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url == 'content/sortMaster' || req.url == 'teacher/saveAnnotation' || req.url == 'student/studentClassList' ||
            (this.auth.getRoleId() == '2' && req.url == 'teacher/list') || (this.auth.getRoleId() == '2' && req.url == 'student/list') || (this.auth.getRoleId() == '2' && req.url == 'student/StudentFromClassList') || (this.auth.getRoleId() == '2' && req.url == 'contentcreator/list')
            || req.url == 'student/saveAnnotation' || req.url == 'teacher/teacherCorrectionAnnotation' || req.url == 'teacher/teacherassignStudentPrint' || req.url == 'report/studentReportClassPrint'
            || req.url == 'teacher/saveAnswerSheetAnnotation' || req.url == 'classes/addScheduleNotes' || req.url == 'mailbox/update' || req.url == 'mailbox/list'
            || req.url == 'classes/classDetail' || req.url == 'content/addStudentAnswer' || req.url == 'teacher/teacherCorrection') {
            // this.commondata.showLoader(false);
        } else if (req.url == 'classes/updateTopicOrder') {
            this.commondata.showLoader(false);
        } else {
            this.commondata.showLoader(true);
        }
        if (req.url == '') {
            this.allow = true;
        } else {
            this.configurationService.envRecieved.subscribe((res) => {
                this.allow = res;
            });
        }
        if (this.allow) {
            const requestUrl = req.method != 'GET' ? this.configurationService.apiHost + req.url : req.url;
            const authToken = this.auth.getAccessToken() ? this.auth.getAccessToken() : '';
            // const authToken = this.auth.getAccessToken() ? '' : '';
            let authReq: any;
            if (req.method != 'GET') {

                // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone ,'zone')
                // console.log(req.body ,'req');
                // req.body.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                // let val = req.body;

                // req = req.clone({
                //     body: req.body.append('s', '2323')
                // });
                if (req.url != 'report/studentReportClassPrint' && req.url != 'teacher/teacherassignStudentPrint') {
                    let val = JSON.parse(req.body);
                    val.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    authReq = req.clone(
                        {
                            url: requestUrl,
                            setHeaders: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Accesstoken': authToken },
                            body: JSON.stringify(val)
                        });
                } else {
                    authReq = req.clone(
                        {
                            url: requestUrl,
                            setHeaders: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Accesstoken': authToken },
                        });
                }
            } else {
                authReq = req.clone(
                    {
                        url: requestUrl,
                        // setHeaders: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Accesstoken': authToken}
                    });
            }

            return next.handle(authReq)
                .pipe(
                    tap(
                        event => {
                            let eve: any = event;
                            if (event instanceof HttpResponse) {
                                if (event.body && event.body.IsSuccess) {
                                    this.commondata.showLoader(false);
                                } else {
                                    this.commondata.showLoader(false);
                                }
                            }
                            if (eve.status == 401) {
                                this.auth.logout();
                            }
                        },
                        error => {
                            if (error.status == 401) {
                                this.auth.logout();
                            }
                            if (error instanceof HttpErrorResponse) {
                                if (error.error instanceof ErrorEvent) {
                                    console.error("Error Event");
                                } else {
                                }
                            }
                            this.commondata.showLoader(false);
                        }
                    )
                );
        }


    }

}
