import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {catchError, map} from 'rxjs/operators';
import {BehaviorSubject, throwError as observableThrowError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) {

  }

  convertBase64PdfPath(b64Data){
    const byteCharacters = atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    //const blob = new Blob([byteArray], {type: 'application/pdf'});
    return byteArray
  }
  fileUpload(data) {
    const json = JSON.stringify(data);
    const url = 'common/fileUpload';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  tagList(data) {
    const json = JSON.stringify(data);
    const url = 'common/tagsList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getSignature(data) {
    const json = JSON.stringify(data);
    const url = 'classes/zoomSignature';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }

  convertBase64(b64urlData){
    if (b64urlData != '' && b64urlData.length != 0){
      let b64Data: any;
      b64Data = atob(atob(atob(atob(b64urlData))));
      b64Data = JSON.parse(b64Data);
      return b64Data;
    }else {
      return b64urlData;
    }
  }

  public downloadfilewithbytes(url: any) {
    console.log(url, 'url');
    const apiUrl = url;
    return this.http.get(apiUrl, { responseType: 'arraybuffer' });
  }
  excelUpload(data) {
    const json = JSON.stringify(data);
    const url = 'common/bulkUpload';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  bulkInsert(data) {
    const json = JSON.stringify(data);
    const url = 'common/bulkInsert';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  emailInviteUpload(data) {
    const json = JSON.stringify(data);
    const url = 'common/emailInvite';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  excelDownload(data) {
    const json = JSON.stringify(data);
    const url = 'common/downloadExcel';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getStateList(data) {
    const json = JSON.stringify(data);
    const url = 'common/state';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  getCountryList(data) {
    const json = JSON.stringify(data);
    const url = 'common/country';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  studentRegis(data) {
    const json = JSON.stringify(data);
    const url = 'user/getUserDetail';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  saveRegistration(data) {
    const json = JSON.stringify(data);
    const url = 'user/editProfile';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  settingsDetails(data) {
    const json = JSON.stringify(data);
    const url = 'common/settingList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
    dateFormat(data) {
        const json = JSON.stringify(data);
        const url = 'school/dateformat';
        return this.http.post(url , json).pipe(
            map(this.extractData ),
            catchError(this.handleError));
    }
  timeZone(data) {
    const json = JSON.stringify(data);
    const url = 'school/timeZoneList';
    return this.http.post(url , json).pipe(
        map(this.extractData ),
        catchError(this.handleError));
  }
  editsettings(data) {
    const json = JSON.stringify(data);
    const url = 'common/settingEdit';
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
