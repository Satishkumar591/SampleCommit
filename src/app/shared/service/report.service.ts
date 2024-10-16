import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {throwError as observableThrowError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) { }
  classReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/classList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  assessmentReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/assessmentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  assignmentReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/assignmentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  assessmentDetailReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/assessmentReports';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  assignmentDetailReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/assignmentReports';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentContentReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/studentsContentReport';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentDetailReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/studentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentGradeSummaryReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/studentGradeSummary';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  gradeReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/gradeReport';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getMissedWorkClassList(data) {
    const json = JSON.stringify(data);
    const url = 'report/classPerformanceList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getMissedWorkStudentList(data) {
    const json = JSON.stringify(data);
    const url = 'report/studentPerformanceList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getMissedWorkReport(data) {
    const json = JSON.stringify(data);
    const url = 'report/studentReportClass';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getPerformanceContent(data) {
    const json = JSON.stringify(data);
    const url = 'report/studentPerformanceContent';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getStudentQuestionStatus(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/studentQuestionStatus';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getStudentQuestionList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/questionList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getItemWiseStudentList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/itemWiseStudentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  reportDateCount(data) {
    const json = JSON.stringify(data);
    const url = 'user/configValues';
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
