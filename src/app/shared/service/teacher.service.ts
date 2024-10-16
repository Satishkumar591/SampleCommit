import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) { }

  teacherList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/list';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  teacherAdd(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/add';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  teacherEdit(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/edit';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  PermissionTeacher(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/teacherPermissionList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  dashboardList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/dashboard';
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
  classDashboardList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/classList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentClassDashboardList(data) {
    const json = JSON.stringify(data);
    const url = 'student/classList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  assignmentDashboardList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/assignmentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentAssignmentDashboardList(data) {
    const json = JSON.stringify(data);
    const url = 'student/assignmentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  assessmentDashboardList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/assessmentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentAssessmentDashboardList(data) {
    const json = JSON.stringify(data);
    const url = 'student/assessmentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/teacherassignStudent';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  changeToPending(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/studentContentStatusChange';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentData(data) {
    const json = JSON.stringify(data);
    const url = 'student/contentStudentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  saveCorrection(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/teacherCorrection';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  releaseScore(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/releaseScore';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  releaseScoreAll(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/releaseScoreAll';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentAnswerList(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/studentAnswerList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  teacherParentAdd(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/individualTeacherAdd';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  schoolRegistrationAdd(data) {
    const json = JSON.stringify(data);
    const url = 'school/staticSiteSchoolRegistration';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  saveTeacherResourceAnnotation(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/saveAnnotation';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  saveTeacherCorrectionAnnotation(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/teacherCorrectionAnnotation';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  saveAnswerSheetAnnotation(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/saveAnswerSheetAnnotation';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentCorrectionInfo(data) {
    const json = JSON.stringify(data);
    const url = 'teacher/studentCorrectionInfo';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  mailBoxList(data) {
    const json = JSON.stringify(data);
    const url = 'mailbox/list';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  composeMail(data) {
    const json = JSON.stringify(data);
    const url = 'mailbox/compose';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  updateMail(data) {
    const json = JSON.stringify(data);
    const url = 'mailbox/update';
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
