import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {throwError as observableThrowError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient, public authService: AuthService,
              private configurationService: ConfigurationService) {
  }
  getBookList(data) {
    const json = JSON.stringify(data);
    const url = 'book/list';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  gradeList(data) {
    const json = JSON.stringify(data);
    const url = 'grade/list';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  subjectList(data) {
    const json = JSON.stringify(data);
    const url = 'subject/list';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  addBook(data) {
    const json = JSON.stringify(data);
    const url = 'book/add1';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  editBook(data) {
    const json = JSON.stringify(data);
    const url = 'book/edit';
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
