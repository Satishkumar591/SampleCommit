
import {throwError as observableThrowError, Observable} from 'rxjs';

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
export class CategoryService {

    constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) {

    }


    getUserList(data) {
        const json = JSON.stringify(data);
        const url = 'user/list';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    getAddUser(data) {
        const json = JSON.stringify(data);
        const url = 'user/add';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }


    changePassword(data) {
        const json = JSON.stringify(data);
        const url = 'user/changePassword';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    getImgUrl(data) {
        const json = JSON.stringify(data);
        const url = 'common/fileUpload';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    updateImgUrl(data) {
        const json = JSON.stringify(data);
        const url = 'user/update';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    updatePermission(data) {
        const json = JSON.stringify(data);
        const url = 'settings/update';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }



    deleteUser(data) {
        const json = JSON.stringify(data);
        const url = 'user/remove';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    getCategoryList(data) {
        const json = JSON.stringify(data);
        const url = 'Teacher/list';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    categoryAdd(data) {
        const json = JSON.stringify(data);
        const url = 'Teacher/add';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    categoryEdit(data) {
        const json = JSON.stringify(data);
        const url = 'Teacher/edit';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    editProfile(data) {
        const json = JSON.stringify(data);
        const url = 'user/editProfile';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    Profile(data) {
        const json = JSON.stringify(data);
        const url = 'user/myProfile';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    registerList(data) {
        const json = JSON.stringify(data);
        const url = 'user/records';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    orderedList(data) {
        const json = JSON.stringify(data);
        const url = 'user/dashBoard';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    contentList(data) {
        const json = JSON.stringify(data);
        const url = 'user/content';
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
