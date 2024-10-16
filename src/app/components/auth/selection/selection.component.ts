import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginService} from '../../../shared/service/login.service';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
    public webHost: any;
    public listData: any;
    public schoolDetails: any = [];

    constructor(
        public commondata: CommonDataService, public sanitizer: DomSanitizer,
        public auth: AuthService, public confi: ConfigurationService, public loginService: LoginService,
        public router: Router, private toastr: ToastrService, public validation: ValidationService) {
        this.webHost = this.confi.getimgUrl();
        this.listData = JSON.parse(this.auth.getSessionData('rista-permission'));
        this.schoolDetails = JSON.parse(this.auth.getSessionData('rista-school_details'));
        console.log(this.listData, 'console.log(data, \'school_id\');');

    }

    ngOnInit(): void {
    }

    loginIntoSchool(data) {
        console.log(data, 'dasdasdas');
        this.auth.setSessionData('rista_data1', JSON.stringify(data));
        this.auth.setSessionData('rista-school_id', data.school_id);
        this.auth.setSessionData('rista-school_name', data.name);
        this.auth.setSessionData('rista-school_profile', data.profile_url);
        this.auth.setSessionData('rista-resourceAccess', false);

        this.loginService.changeHomePage(this.auth.getRoleId());
        if (this.auth.getRoleId() == '2') {
            setTimeout(() => {
                data.allow_dashboard == '1' ? this.router.navigate(['/dashboard/default']) :
                    this.router.navigate(['/schedule/schedule-page']);
            }, 700);
        } else if (this.auth.getRoleId() == '3') {
            this.auth.setSessionData('rista-designation', data.designation);
            this.router.navigate(['/repository/content-home']);
        } else if (this.auth.getRoleId() == '4') {
            this.auth.setSessionData('rista-teacher_type', data.individual_teacher);
            this.auth.setSessionData('rista-teacher_id', data.school_idno);
            setTimeout(() => {
                this.router.navigate(['/schedule/schedule-page']);
            }, 700);
        } else if (this.auth.getRoleId() == '5') {
            this.auth.setSessionData('selected-name', data.school_id);
            const getClassCode = localStorage.getItem('studentClassCode');
            if (getClassCode) {
                if (getClassCode != '') {
                    this.router.navigate(['/studentlogin/enrollclass']);
                } else {
                    this.router.navigate(['/studentlogin/list-home']);
                }
            } else {
                this.router.navigate(['/studentlogin/list-home']);
            }
        } else if (this.auth.getRoleId() == '6') {
            this.router.navigate(['/dashboard/default']);
        } else if (this.auth.getRoleId() == '7') {
            this.auth.setSessionData('rista-teacher_type', data.individual_teacher);
            this.router.navigate(['/student-content/list-content/old']);
        }
    }
}
