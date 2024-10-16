import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {observable, Observable} from 'rxjs';
import {AuthService} from '../../../shared/service/auth.service';
import {StudentService} from '../../../shared/service/student.service';


@Injectable()
export class AnsweringResolver implements Resolve<any> {
public getData: any;
    constructor(public auth: AuthService, public  student: StudentService) {
        console.log('constructor');
    }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        this.getData = JSON.parse(this.auth.getSessionData('rista-classDetails'));
        const data = {
            platform: 'web',
            role_id: this.auth.getRoleId(),
            user_id: this.auth.getUserId(),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.getData.content_id,
            content_format: this.getData.content_format,
            class_id: this.getData.class_id,
            student_id: this.auth.getUserId(),
            student_content_id: this.getData.student_content_id
        };
        try {
            console.log(this.student?.questionList(data) ,'sdsfd');
            return this.student?.questionList(data);
        }catch (e) {
            console.log(e ,'e in resol');
        }
    }
}
