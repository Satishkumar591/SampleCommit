import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContentdetailService {

    constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) {
    }

    passageAllService(data, type) {
        const json = JSON.stringify(data);
        const url = 'content/' + type + 'Passage';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    studentContent(data) {
        const json = JSON.stringify(data);
        const url = 'teacher/studentAssessment';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    classList(data) {
        const json = JSON.stringify(data);
        const url = 'teacher/studentCorrectionList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    notesList(data) {
        const json = JSON.stringify(data);
        const url = 'feedback/list';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    notesAdd(data) {
        const json = JSON.stringify(data);
        const url = 'feedback/add';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    notesDelete(data) {
        const json = JSON.stringify(data);
        const url = 'feedback/delete';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    notifiyParent(data) {
        const json = JSON.stringify(data);
        const url = 'teacher/notifyParents';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    notifiyAllParent(data) {
        const json = JSON.stringify(data);
        const url = 'teacher/notifyAllStudentParents';
        return this.http.post(url, json).pipe(
            map(this.extractData),
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
