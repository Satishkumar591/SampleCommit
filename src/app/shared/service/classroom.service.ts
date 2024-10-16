import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) { }
  batchList(data) {
    const json = JSON.stringify(data);
    const url = 'batch/list';
    return this.http.post(url, json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  classRoomAdd(data) {
    const json = JSON.stringify(data);
    const url = 'batch/add';
    return this.http.post(url, json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  classRoomEdit(data) {
    const json = JSON.stringify(data);
    const url = 'batch/edit';
    return this.http.post(url, json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  classRoomDelete(data) {
    const json = JSON.stringify(data);
    const url = 'batch/delete';
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
