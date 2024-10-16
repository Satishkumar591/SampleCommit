import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {AuthService} from './auth.service';
import {catchError, map} from 'rxjs/operators';
import {throwError as observableThrowError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClassService {

    constructor(private http: HttpClient, private configurationService: ConfigurationService, public authService: AuthService) {
    }

    addClasses(data) {
        const json = JSON.stringify(data);
        const url = 'classes/add';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    deleteclass(data) {
        const json = JSON.stringify(data);
        const url = 'classes/delete';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    viewResources(data) {
        const json = JSON.stringify(data);
        const url = 'classes/viewResources';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    viewCurriculumList(data) {
        const json = JSON.stringify(data);
        const url = 'classes/curriculumList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    topicList(data) {
        const json = JSON.stringify(data);
        const url = 'classes/topicList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    addTopic(data, url) {
        const json = JSON.stringify(data);
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    updateTopicOrder(data) {
        const json = JSON.stringify(data);
        const url = 'classes/updateTopicOrder';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError)); 
    }

    moveTopic(data) {
        const json = JSON.stringify(data);
        const url = 'classes/addCurriculumTopic';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    studentClass(data) {
        const json = JSON.stringify(data);
        const url = 'student/studentClassList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    studentContentDetails(data) {
        const json = JSON.stringify(data);
        const url = 'student/classDetail';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    viewAssignments(data) {
        const json = JSON.stringify(data);
        const url = 'classes/viewAssignments';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    viewAssessments(data) {
        const json = JSON.stringify(data);
        const url = 'classes/viewAssessments';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    viewBatchResources(data) {
        const json = JSON.stringify(data);
        const url = 'batch/classroomresourcesList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    viewBatchAssignment(data) {
        const json = JSON.stringify(data);
        const url = 'batch/classroomAssignmentsList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    viewBatchAssessment(data) {
        const json = JSON.stringify(data);
        const url = 'batch/classroomAssessmentsList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    deleteContentDetail(data) {
        const json = JSON.stringify(data);
        const url = 'content/deleteContent';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    editContentDetail(data) {
        const json = JSON.stringify(data);
        const url = 'classes/editClassContent';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    deleteBatchContent(data) {
        const json = JSON.stringify(data);
        const url = 'batch/delete';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    editClasses(data) {
        const json = JSON.stringify(data);
        const url = 'classes/edit';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    classesList(data) {
        const json = JSON.stringify(data);
        const url = 'classes/list';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    submit(data) {
        const json = JSON.stringify(data);
        const url = 'classes/addStudent';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    idList(data) {
        const json = JSON.stringify(data);
        const url = 'user/myProfile';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    classDetails(data) {
        const json = JSON.stringify(data);
        const url = 'classes/classDetail';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    recording(data) {
        const json = JSON.stringify(data);
        const url = 'student/ClassRecording';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    zoomInstant(data) {
        const json = JSON.stringify(data);
        const url = 'classes/zoomInstantCreation';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    gradeList(data) {
        const json = JSON.stringify(data);
        const url = 'grade/list';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    slotList(data) {
        const json = JSON.stringify(data);
        const url = 'classes/slotList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    zoomPermission(data) {
        const json = JSON.stringify(data);
        const url = 'classes/zoomPermission';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    individualTeacherList(data) {
        const json = JSON.stringify(data);
        const url = 'classes/teacherList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    subjectList(data) {
        const json = JSON.stringify(data);
        const url = 'subject/list';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    timeSlotedit(data) {
        const json = JSON.stringify(data);
        const url = 'classes/updateClassSchedule';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    timeValidation(data) {
        const json = JSON.stringify(data);
        const url = 'common/availabilityTimeCheck';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    updateAttendance(data) {
        const json = JSON.stringify(data);
        const url = 'classes/attendance';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    attendanceList(data) {
        const json = JSON.stringify(data);
        const url = 'classes/attendanceList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    overallClassAttendance(data) {
        const json = JSON.stringify(data);
        const url = 'classes/overallClassAttendance';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    scheduleDate(data) {
        const json = JSON.stringify(data);
        const url = 'classes/scheduleDate';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    scheduleNotesList(data) {
        const json = JSON.stringify(data);
        const url = 'feedback/list';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    addScheduleNotes(data) {
        const json = JSON.stringify(data);
        const url = 'feedback/add';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    batchList(data) {
        const json = JSON.stringify(data);
        const url = 'batch/list';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    tagsList(data) {
        const json = JSON.stringify(data);
        const url = 'common/tagsList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    studentList(data) {
        const json = JSON.stringify(data);
        const url = 'grade/studentList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    searchList(data) {
        const json = JSON.stringify(data);
        const url = 'grade/allStudentList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    addLeavesDetails(data) {
        const json = JSON.stringify(data);
        const url = 'school/addHolidayCalendar';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    studentClassDashboardList(data) {
        const json = JSON.stringify(data);
        const url = 'student/classList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    studentClassDetail(data) {
        const json = JSON.stringify(data);
        const url = 'student/classDetail';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    editLeavesDetails(data) {
        const json = JSON.stringify(data);
        const url = 'school/editHolidayCalendar';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    deleteLeavesDetails(data) {
        const json = JSON.stringify(data);
        const url = 'school/deleteHolidayCalendar';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    LeavesDetailsList(data) {
        const json = JSON.stringify(data);
        const url = 'school/calendarList';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    getNotesList(data) {
        const json = JSON.stringify(data);
        const url = 'classes/classAddNotes';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    deleteStudentList(data) {
        const json = JSON.stringify(data);
        const url = 'classes/removeStudent';
        return this.http.post(url, json).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    bulkMail(data) {
        const json = JSON.stringify(data);
        const url = 'classes/classCodeNotification';
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
