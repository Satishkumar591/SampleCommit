import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {StudentService} from '../../../shared/service/student.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {EnvironmentService} from '../../../environment.service';

@Component({
    selector: 'app-enrollclass',
    templateUrl: './enrollclass.component.html',
    styleUrls: ['./enrollclass.component.scss']
})
export class EnrollclassComponent implements OnInit {
    public classCode: any;

    constructor(public auth: AuthService, public student: StudentService, public env: EnvironmentService, private toastr: ToastrService, public route: Router) {
        if (localStorage.getItem('studentClassCode') == 'undefined' || localStorage.getItem('studentClassCode') == null) {
            this.classCode = '';
        } else {
            this.classCode = localStorage.getItem('studentClassCode');
        }
    }

    ngOnInit(): void {
    }

    enrollClass() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_code: this.classCode,
            student_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        console.log(data, 'data');

        this.student.enrollClass(data).subscribe((successData) => {
                this.enrollClassSuccess(successData);
            },
            (error) => {
                this.enrollClassFailure(error);
            });
    }

    enrollClassSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.Message);
            this.auth.setSessionData('class-id', successData.ResponseObject.class_id);
            this.auth.setSessionData('schedule_id', successData.ResponseObject.schedule_id);
            this.route.navigate(['/studentlogin/class-detail']);
            localStorage.removeItem('studentClassCode');
        } else {
            this.toastr.error(successData.ErrorObject);
        }
    }

    enrollClassFailure(error) {
        console.log(error);
    }

}
