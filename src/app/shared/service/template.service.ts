
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
export class TemplateService {

    constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) {

    }

    getTemplateList(data) {
        const json = JSON.stringify(data);
        const token = this.authService.getAccessToken();
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Accesstoken: token})
        };
        const url = this.configurationService.getHost() + 'student/listCategory';
        return this.http.post(url , json, httpOptions).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    templateAdd(data) {
        const json = JSON.stringify(data);
        const token = this.authService.getAccessToken();
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Accesstoken: token})
        };
        const url = this.configurationService.getHost() + 'student/addCategory';
        return this.http.post(url , json, httpOptions).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }

    templateEdit(data) {
        const json = JSON.stringify(data);
        const token = this.authService.getAccessToken();
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Accesstoken: token})
        };
        const url = this.configurationService.getHost() + 'student/editCategory';
        return this.http.post(url , json, httpOptions).pipe(
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
