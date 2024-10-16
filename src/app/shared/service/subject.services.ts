import {Injectable} from '@angular/core';
import {BehaviorSubject, throwError as observableThrowError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {ConfigurationService} from './configuration.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()

export class SubjectServices {

    public profileList = new BehaviorSubject<any>('');
    cast = this.profileList.asObservable();
    constructor(private http: HttpClient, public authService: AuthService,
                private configurationService: ConfigurationService){}

    changeProfile(data){
        this.profileList.next(data);
    }
    getSubjectList(data) {
        const json = JSON.stringify(data);
        const url = 'subject/list';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    subjectAdd(data) {
        const json = JSON.stringify(data);
        const url = 'subject/add';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    subjectEdit(data) {
        const json = JSON.stringify(data);
        const url = 'subject/edit';
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
