
import {throwError as observableThrowError, Observable, BehaviorSubject} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {ConfigurationService} from './configuration.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class SchoolService {
    public corporateSchoolView = new BehaviorSubject<any>('');
    list = this.corporateSchoolView.asObservable();
    constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) {}
    changeSideCorporateSchoolList(data){
        this.corporateSchoolView.next(data);
    }
    deleteUser(data) {
        const json = JSON.stringify(data);
        const url = 'user/remove';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    getSchoolList(data) {
        const json = JSON.stringify(data);
        const url = 'school/list';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    brandAdd(data) {
        const json = JSON.stringify(data);
        const url = 'school/registration';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    brandEdit(data) {
        const json = JSON.stringify(data);
        const url = 'school/edit';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }





    private extractData(res: Response) {
        const body = res;
        return body || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            // const body = error.json() || '';
            const err = error || JSON.stringify(error);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return observableThrowError(error);
    }

}
