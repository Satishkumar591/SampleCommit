import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {throwError as observableThrowError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) { }

  existScratchNotificationIos(data){
    const json = JSON.stringify(data);
    const url = 'common/scratchNotification';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  studentAdd(data) {
    const json = JSON.stringify(data);
    const url = 'student/add';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  studentAnswer(data) {
    const json = JSON.stringify(data);
    const url = 'student/answerDetails';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  studentAttendanceList(data) {
    const json = JSON.stringify(data);
    const url = 'student/attendanceDetail';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  stateList(data) {
    const json = JSON.stringify(data);
    const url = 'common/state';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  countryList(data) {
    const json = JSON.stringify(data);
    const url = 'common/country';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentEdit(data) {
    const json = JSON.stringify(data);
    const url = 'student/edit';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  studentClassList(data) {
    const json = JSON.stringify(data);
    const url = 'student/StudentFromClassList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  answerKeyRequest(data) {
    const json = JSON.stringify(data);
    const url = 'student/answerKeyRequest';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  getStudentList(data) {
    const json = JSON.stringify(data);
    const url = 'student/list';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  getAllClassOfStudent(data) {
    const json = JSON.stringify(data);
    const url = 'student/studentAllClassList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));

  }

  changeClass(data) {
    const json = JSON.stringify(data);
    const url = 'student/studentClassShift';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  getgradeList(data) {
    const json = JSON.stringify(data);
    const url = 'grade/list';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentUpgrade(data) {
    const json = JSON.stringify(data);
    const url = 'school/studentUpgrade';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  assessmentList(data) {
    const json = JSON.stringify(data);
    const url = 'student/assessmentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  assingmentList(data) {
    const json = JSON.stringify(data);
    const url = 'student/assignmentList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  checkTime(data) {
    const json = JSON.stringify(data);
    const url = 'student/checkContentTime';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  resourceList(data) {
    const json = JSON.stringify(data);
    const url = 'student/resourcesList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
    getReports(data) {
        const json = JSON.stringify(data);
        const url = 'report/reportCard';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
  zoomLink(data) {
    const json = JSON.stringify(data);
    const url = 'student/getZoomLink';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
    studentGradeList(data) {
        const json = JSON.stringify(data);
        const url = 'school/studentGradeList';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
    questionList(data) {
    const json = JSON.stringify(data);
    const url = 'content/contentDetail';
    return this.http.post(url , json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  saveAnnotation(data) {
    const json = JSON.stringify(data);
    const url = 'student/saveAnnotation';
    return this.http.post(url , json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  submitAnswer(data) {
    const json = JSON.stringify(data);
    const url = 'content/addStudentAnswer';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  submitQuery(data) {
    const json = JSON.stringify(data);
    const url = 'student/addStudentQuery';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  folderList(data) {
    const json = JSON.stringify(data);
    const url = 'student/contentFolderList';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  folderContent(data) {
    const json = JSON.stringify(data);
    const url = 'student/folderContents';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  addFolder(data) {
    const json = JSON.stringify(data);
    const url = 'student/addContentFolder';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  editFolder(data) {
    const json = JSON.stringify(data);
    const url = 'student/editContentFolder';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  contentList(data) {
    const json = JSON.stringify(data);
    const url = 'student/repositoryList';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  addContent(data) {
    const json = JSON.stringify(data);
    const url = 'student/addRepository';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  editContent(data) {
    const json = JSON.stringify(data);
    const url = 'student/editRepository';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  classList(data) {
    const json = JSON.stringify(data);
    const url = 'student/classList';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  shareRepository(data) {
    const json = JSON.stringify(data);
    const url = 'student/shareRepository';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  moveRepository(data) {
    const json = JSON.stringify(data);
    const url = 'student/moveRepository';
    return this.http.post(url, json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  enrollClass(data) {
    const json = JSON.stringify(data);
    const url = 'classes/enrollStudent';
    return this.http.post(url , json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  enrollLoginClass(data) {
    const json = JSON.stringify(data);
    const url = 'classes/loginAndEnroll';
    return this.http.post(url , json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  checkClassCode(data) {
    const json = JSON.stringify(data);
    const url = 'classes/checkClassCode';
    return this.http.post(url , json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  enrollRegisterClass(data) {
    const json = JSON.stringify(data);
    const url = 'student/register';
    return this.http.post(url , json).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  contentScore(data) {
    const json = JSON.stringify(data);
    const url = 'student/contentScoreDetails';
    return this.http.post(url , json).pipe(
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
