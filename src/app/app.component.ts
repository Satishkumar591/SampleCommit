import {ChangeDetectorRef, OnInit, Component, SecurityContext} from '@angular/core';

import {EnvironmentService} from './environment.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Title} from '@angular/platform-browser';
import {ConnectionService} from 'ng-connection-service';
import {Router} from '@angular/router';
import {ZoomServiceService} from './shared/service/zoom-service.service';
import {AuthService} from './shared/service/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'RistaINc';
    public allow: boolean;
    public zoomAllow: boolean = true;
    isInternet = true;
    public href: any;
    favIcon: HTMLLinkElement = document.querySelector('#appIcon');

    constructor(public envService: EnvironmentService, private deviceService: DeviceDetectorService, private titleService: Title,
                private connectionService: ConnectionService, public zoomService: ZoomServiceService, public cdr: ChangeDetectorRef,
                public router: Router, public auth: AuthService) {
        const url = window.location.href;
        console.log(url, 'url')
        if (url.toString().indexOf('xtracurriculum') > -1) {
            this.favIcon.href = 'assets/xtraCurriculum.ico';
            this.titleService.setTitle('XtraCurriculum');
        } else if (url.toString().indexOf('safeteen') > -1) {
            this.favIcon.href = 'assets/safeteen.png';
            this.titleService.setTitle('Safeteens - by the Teens for the Teens');
        } else if (url.toString().indexOf('elevenace') > -1) {
            this.favIcon.href = 'assets/elevenAce.ico';
            this.titleService.setTitle('ElevenAce');
        } else if (url.toString().indexOf('uniqprep') > -1) {
            this.favIcon.href = 'assets/uniqprep.png';
            this.titleService.setTitle('Uniq Prep');
        } else if (url.toString().indexOf('edveda') > -1) {
            this.favIcon.href = 'assets/edquill.ico';
            this.titleService.setTitle('EdVeda');
        } else if (url.toString().indexOf('localhost') > -1 || url.toString().indexOf('uthkal') > -1 || url.toString().indexOf('edquill') > -1) {
            this.favIcon.href = 'assets/edquill.ico';
            this.titleService.setTitle('EdQuill');
        }
        this.connectionService.monitor().subscribe(isConnected => {
            /// isconected false means no internet ...true means internet connected
            this.isInternet = isConnected;
        });
        this.envService.envRecieved.subscribe((res) => {
            this.allow = res;
        });
        this.zoomService.cast.subscribe(data => {
            if (data == true) {
                console.log(data, 'data');
                // this.zoomAllow = false;
                window.location.reload();
                this.cdr.detectChanges();
                // setTimeout( ()=>{
                //     console.log('innn app comonent');
                //     this.zoomAllow = true;
                //     this.cdr.detectChanges();
                // },2000);
            }
        });
        const checkForForgotPassword = url.toString().indexOf('forgotPassword') > -1;
        const checkEnrollClassCode = url.toString().indexOf('enrollclasscode') > -1;
        const checkStudentRegister = url.toString().indexOf('studentRegister') > -1;
        console.log(checkEnrollClassCode, 'checkEnrollClassCode');
        console.log(checkForForgotPassword, 'checkForForgotPassword');
        console.log(checkStudentRegister, 'checkStudentRegister');
        const checkForIPADApp = url.toString().indexOf('student-annotation') > -1 || url.toString().indexOf('student-link') > -1 ||
                url.toString().indexOf('student-scratch') > -1 || url.toString().indexOf('graphing') > -1 || url.toString().indexOf('ipad-question-view') > -1
        console.log(checkForIPADApp, 'checkForIPADApp');
        if (!checkForForgotPassword && !checkEnrollClassCode && !checkStudentRegister) {
            if (this.router.url.toString() == '/' && this.auth.getSessionData('rista-roleid')) {
                if (this.auth.getSessionData('rista-roleid') == '1' || this.auth.getSessionData('rista-roleid') == '2') {
                    console.log('rouetrFuntionCalled');
                    this.router.navigate(['/class/list-class']);
                } else if (this.auth.getSessionData('rista-roleid') == '3') {
                    this.router.navigate(['/repository/content-home']);
                } else if (this.auth.getSessionData('rista-roleid') == '4') {
                    this.router.navigate(['/class/list-class']);
                } else if (this.auth.getSessionData('rista-roleid') == '5') {
                    this.router.navigate(['/studentlogin/list-home']);
                } else if (this.auth.getSessionData('rista-roleid') == '6') {
                    this.router.navigate(['/dashboard/default']);
                } else if (this.auth.getSessionData('rista-roleid') == '7') {
                    this.router.navigate(['/student-content/list-content/old']);
                }

            } else if (this.deviceService.getDeviceInfo().os !== 'iOS' &&
                (this.deviceService.getDeviceInfo().os !== 'Mac' || !this.deviceService.isTablet())) {
                    if (!checkForIPADApp) {
                        this.router.navigate(['/auth/login']);
                        // if (splitURL[1] == 'enrollclasscode') {
                        //     this.router.navigate([endURL[1]]);
                        // } else {
                        //     this.router.navigate(['/auth/login']);
                        // }
                    }
            } else {
                if (!checkForIPADApp) {
                    this.router.navigate(['/auth/login']);
                    // if (splitURL[1] == 'enrollclasscode') {
                    //     this.router.navigate([endURL[1]]);
                    // } else {
                    //     this.router.navigate(['/auth/login']);
                    // }
                }
            }
        } else if (checkStudentRegister) {
            // const classCode = window.location.href;
            // localStorage.setItem('studentClassCode', classCode.split('studentRegister')[1].split('/'))
        }
    }

}
