import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) { }

  contentAdd(data) {
    const json = JSON.stringify(data);
    const url = 'contentcreator/add';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  contentEdit(data) {
    const json = JSON.stringify(data);
    const url = 'contentcreator/edit';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  contentList(data) {
    const json = JSON.stringify(data);
    const url = 'contentcreator/list';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  contentQuestion(data) {
    const json = JSON.stringify(data);
    const url = 'content/questiontypes';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  answerKeyRequestList(data) {
    const json = JSON.stringify(data);
    const url = 'content/answerkeyRequestList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  updateRequestList(data) {
    const json = JSON.stringify(data);
    const url = 'content/updateAnswerKey';
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
