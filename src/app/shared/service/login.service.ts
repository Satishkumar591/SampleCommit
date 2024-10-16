
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
export class LoginService {
    public homeList = new BehaviorSubject<any>('');
    cast = this.homeList.asObservable();
    constructor(private http: HttpClient, private configurationService: ConfigurationService, private authService: AuthService) {

    }
    changeHomePage(data){
        this.homeList.next(data);
    }

    logout() {
        const url = 'auth/logout';
        return this.http.get(url);
    }


    login(data) {
        const json = JSON.stringify(data);
        const url = 'user/login';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError), ) ;
    }
    tcUpdateList(data) {
        const json = JSON.stringify(data);
        const url = 'user/tcUpdate';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError), ) ;
    }
    corporateLogin(data) {
        const json = JSON.stringify(data);
        const url = 'corporate/login';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError), ) ;
    }
    forgotPassword(data) {
        const json = JSON.stringify(data);
        const url = 'user/forgotPassword';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    changePassword(data) {
        const json = JSON.stringify(data);
        const url = 'user/setPassword';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    changeForgotPassword(data) {
        const json = JSON.stringify(data);
        const url = 'user/resetPassword';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    selectSchool(data) {
        const json = JSON.stringify(data);
        const url = 'user/forgotPassword';
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
