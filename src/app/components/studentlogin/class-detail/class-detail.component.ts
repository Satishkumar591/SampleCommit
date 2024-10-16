import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {FormBuilder} from '@angular/forms';
import {ClassService} from '../../../shared/service/class.service';
import {DomSanitizer} from '@angular/platform-browser';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {StudentService} from '../../../shared/service/student.service';
import {ZoomServiceService} from '../../../shared/service/zoom-service.service';
import {dateOptions} from '../../../shared/data/config';
import {EnvironmentService} from '../../../environment.service';

@Component({
    selector: 'app-list-category',
    templateUrl: './class-detail.component.html',
    styleUrls: ['./class-detail.component.scss']
})
export class ClassDetailComponent implements OnInit {
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        // other options are here...
    };
    public listData: any;
    public deleteUser: any;
    public modalRef: NgbModalRef;
    public closeResult: string;
    public filetype: any;
    public url: any;
    public getUrl: any;
    public getUrl1: any;
    public schoolData: any;
    public schoolId: any;
    public webhost: any;
    public zoomResponse: any;
    public fileUploader: any;
    public schoolDataList: any = 0;
    public choosedData: any = [];
    public type: any;
    public tabShow = 'curriculum';
    public detailData: any;
    public gradeData: any;
    public subjectData: any;
    public videoSource: any = [];
    public settingList = [];
    public settingValue = '0';
    public assignData: any = [];
    public assignmentFilteredData = [];
    public assignmentFilterType = 'new';
    public assessmentFilteredData = [];
    public assessmentFilterType = 'new';
    public assessData: any = [];
    public allowSelect: boolean;
    public linkdata: any = [];
    public notesdata: any = [];
    public message: any;
    public ErrorTitle: any;
    public selectedClass: any;
    public selectedRecording: any;
    public topicListData = [];
    public totalCurriculumList = [];
    public curriculumListWithoutTopic = [];
    public contentFilterType = '1';

    @ViewChild('throwError') throwError: TemplateRef<any>;
    @ViewChild('content') link: TemplateRef<any>;
    @ViewChild('notesDetail') notesDetail: TemplateRef<any>;
    @ViewChild('zoomDialog') zoomDialog: TemplateRef<any>;
    @ViewChild('zoomDialog1') zoomDialog1: TemplateRef<any>;
    @ViewChild('video') video: TemplateRef<any>;
    public isCollapsed = false;

    constructor(private formBuilder: FormBuilder, public config: NgbModalConfig, public confi: ConfigurationService, public student: StudentService,
                public auth: AuthService, public commondata: CommonDataService, private modalService: NgbModal, public sanitizer: DomSanitizer,
                public route: Router, public firstcaps: TitleCasePipe, public toastr: ToastrService, public newSubject: NewsubjectService,
                public common: CommonService, public classes: ClassService, public env: EnvironmentService, public datePipe: DatePipe, public zoomService: ZoomServiceService) {
        this.classList('1');
        this.webhost = this.confi.getimgUrl();
        config.backdrop = 'static';
        config.keyboard = false;
    }

    ngOnInit() {
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }

    open(content) {
        this.modalService.open(content);
    }

    onSave() {
        this.modalRef.close();
    }

    close() {
        this.modalRef.close();
        this.schoolId = null;
        this.fileUploader = '';
        this.filetype = '';
    }

    checkContentTime(selectedData) {
        if (selectedData.content_type == '1') {
            this.auth.setSessionData('rista-classDetails', JSON.stringify(selectedData));
            this.route.navigate(['studentlogin/preview']);
        } else {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                class_id: selectedData.class_id,
                content_id: selectedData.content_id,
            };
            this.student.checkTime(data).subscribe((successData) => {
                    this.checkContentTimeSuccess(successData, selectedData);
                },
                (error) => {
                    console.error(error, 'checkContentTimeError');
                });
        }
    }

    checkContentTimeSuccess(successData, selectedData) {
        if (successData.IsSuccess) {
            this.enterCurriculum(selectedData);
        } else {
            this.message = successData.ResponseObject;
            this.ErrorTitle = selectedData.class_name;
            this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        }
    }

    // checkContentTimeFailure(error) {
    //     console.error(error);
    // }

    // assessmentPage(detail) {
    //     detail['class_id'] = this.auth.getSessionData('class-id');
    //     if (detail.status == 1) {
    //         this.message = detail.content_name + ' ' + 'is assessment not started';
    //         this.ErrorTitle = detail.class_name;
    //         this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
    //     } else if (detail.student_content_status == 3) {
    //         this.auth.setSessionData('rista-student-card', JSON.stringify(detail));
    //         this.route.navigate(['/studentlogin/score-card']);
    //     } else {
    //         this.auth.setSessionData('rista-classDetails', JSON.stringify(detail));
    //         this.route.navigate(['/studentlogin/answering']);
    //     }
    // }

    enterCurriculum(detail) {
        console.log(detail, 'detail');
        detail['class_id'] = this.auth.getSessionData('class-id');
        if (detail.status == 1) {
            this.message = detail.content_name + ' ' + 'is' + ' ' + detail.content_type == '2' ? 'assignment' : 'assessments' + ' not started';
            this.ErrorTitle = detail.class_name;
            this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        } else if (detail.student_content_status != 3) {
            this.auth.setSessionData('rista-classDetails', JSON.stringify(detail));
            this.route.navigate(['/studentlogin/answering']);
        } else {
            this.auth.setSessionData('rista-student-card', JSON.stringify(detail));
            this.route.navigate(['/studentlogin/score-card']);
        }
    }

    classList(id) {
        this.contentFilterType = id;
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            class_id: this.auth.getSessionData('class-id'),
            schedule_id: this.auth.getSessionData('schedule_id'),
            type: id
        };
        this.classes.studentClassDetail(data).subscribe((successData) => {
                this.classListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error');
            });
    }

    classListSuccess(successData) {
        if (successData.IsSuccess) {
            this.choosedData = successData.ResponseObject.class_detail;
            this.settingValue = this.choosedData[0].student_zoom_view;
            this.totalCurriculumList = successData.ResponseObject.curriculum_detail;
            this.getClassRecording(this.choosedData[0]);
            this.getTopicList();
            this.curriculumListWithoutTopic = [];
            this.totalCurriculumList.forEach((item) => {
                if (item.topic_id == '0' || item.topic_id == '') {
                    this.curriculumListWithoutTopic.push(item);
                }
            });
        }
    }

    getTopicList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.classes.topicList(data).subscribe((successData) => {
                this.viewTopicListSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewTopicListSuccess(successData) {
        if (successData.IsSuccess) {
            this.topicListData = successData.ResponseObject;
            this.topicListData.forEach((items) => {
                items.topicArray = [];
                this.totalCurriculumList.forEach((curriculum) => {
                    if (curriculum.topic_id == items.topic_id) {
                        items.contentCollapse = true;
                        items.topicArray.push(curriculum);
                    }
                });
            });
            console.log(this.topicListData, 'topicList');
        }
    }

    // filterAssignmentData(type, typeName) {
    //     this.assignmentFilterType = typeName;
    //     this.assignmentFilteredData = this.assignData.filter((item) => {
    //         if (type == '1') {
    //             return item.student_content_status == '1';
    //         } else if (type == '2') {
    //             return item.student_content_status == '2';
    //         } else if (type == '3') {
    //             return item.student_content_status == '3' || item.student_content_status == '4' || item.student_content_status == '5' || item.student_content_status == '6';
    //         }
    //     });
    // }
    //
    // filterAssessmentData(type, typeName) {
    //     this.assessmentFilterType = typeName;
    //     this.assessmentFilteredData = this.assessData.filter((item) => {
    //         if (type == '1') {
    //             return item.student_content_status == '1';
    //         } else if (type == '2') {
    //             return item.student_content_status == '2';
    //         } else if (type == '3') {
    //             return item.student_content_status == '3' || item.student_content_status == '4' || item.student_content_status == '5' || item.student_content_status == '6';
    //         }
    //     });
    // }

    // preview(data) {
    //     this.auth.setSessionData('rista-classDetails', JSON.stringify(data));
    //     this.route.navigate(['studentlogin/preview']);
    // }

    videoTemplate(data) {
        // document.getElementById('record' + i).click();
        // this.selectedRecording = data;
        // this.modalRef = this.modalService.open(this.video, {size: "lg"});
    }

    showNotes(data) {
        // this.modalRef = this.modalService.open(this.notesDetail, {size: 'xl'});
        this.notesdata = data;
        console.log(this.notesdata, 'daataa');
    }

    onDateChanged(event: IMyDateModel): void {
    }

    otherlink(data) {
        // this.modalRef = this.modalService.open(this.link);
        this.linkdata = data;
        console.log(this.linkdata, 'daataa');
    }

    openZoomDialog(classData) {
        this.selectedClass = classData;
        if (classData.allow_zoom_api[0].value == '0') {
            this.navigateOutsideZoom(this.selectedClass);
        } else {
            this.getZoomMeeting(classData);
        }
    }

    getZoomMeeting(classData) {
        console.log(classData, 'classData');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            schedule_id: classData.schedule_id
        };
        this.student.zoomLink(data).subscribe((successData: any) => {
            this.commondata.showLoader(false);
            this.getZoomMeetingSuccess(successData);
        }, (error) => {
            this.commondata.showLoader(false);
            this.toastr.error(error.ErrorObject);
        });
    }

    getZoomMeetingSuccess(successData) {
        if (successData.IsSuccess) {
            console.log(successData.ResponseObject, 'zoom link success');
            this.zoomResponse = successData.ResponseObject;
            if (this.selectedClass.allow_zoom_api[0].value == '0') {
                this.navigateOutsideZoom(successData.ResponseObject);
            } else if (this.selectedClass.allow_zoom_api[0].value == '1') {
                if (this.settingValue == '2') {
                    this.modalRef = this.modalService.open(this.zoomDialog, {size: 's'});
                } else if (this.settingValue == '1') {
                    this.navigateOutsideZoom(successData.ResponseObject);
                } else if (this.settingValue == '0') {
                    this.zoomService.initZoomMeeting(this.selectedClass);
                }
            }
        } else {
            this.toastr.error(successData.ResponseObject.message);
        }
    }

    getClassRecording(classData) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: classData.class_id,
            grade: [classData.grade],
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0'
        };
        this.classes.recording(data).subscribe((successData: any) => {
            this.commondata.showLoader(false);
            if (successData.IsSuccess) {
                console.log(successData, 'su')
                const recordings = [];
                successData.ResponseObject.forEach((item) => {
                    recordings.push(...item.meeting_recording);
                });
                this.videoSource = recordings;
                // this.videoSource = successData.ResponseObject;
            }
        }, (error) => {
            this.commondata.showLoader(false);

        });
    }

    navigateOutsideZoom(data) {
        console.log(data, 'datd')
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        if (this.selectedClass.allow_zoom_api[0].value == '0') {
            link.setAttribute('href', data.meeting_link);
        } else {
            link.setAttribute('href', data.student_link);
        }
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    navigateOutsideRecording(data) {
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        // link.setAttribute('href', data.meeting_recording);
        link.setAttribute('href', data.play_video);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
