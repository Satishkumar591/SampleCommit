import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ConfigurationService} from "./configuration.service";
import {AuthService} from "./auth.service";
import {throwError as observableThrowError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) { }
  iconList(data) {
    const json = JSON.stringify(data);
    const url = 'content/question_types';
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
