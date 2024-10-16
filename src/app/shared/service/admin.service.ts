import {throwError as observableThrowError, Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {ConfigurationService} from './configuration.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public authService: AuthService, private configurationService: ConfigurationService, private http: HttpClient) { }

  adminList(data) {
    const json = JSON.stringify(data);
    const url = 'user/adminList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  adminAdd(data) {
    const json = JSON.stringify(data);
    const url = 'school/addAdmin';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  adminEdit(data) {
    const json = JSON.stringify(data);
    const url = 'user/editStatus';
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
