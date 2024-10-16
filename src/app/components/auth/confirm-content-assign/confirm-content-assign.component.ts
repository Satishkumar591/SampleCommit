import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {dateOptions, timeZone} from '../../../shared/data/config';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../../shared/service/auth.service';
import {CreatorService} from '../../../shared/service/creator.service';
import {ClassService} from '../../../shared/service/class.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-confirm-content-assign',
    templateUrl: './confirm-content-assign.component.html',
    styleUrls: ['./confirm-content-assign.component.scss']
})
export class ConfirmContentAssignComponent implements OnInit {

    @Input() classData: any = [];
    @Input() contentDetails: any = {};
    @Output() closePopUp: any = new EventEmitter<any>();
    public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
    public dateValidation: boolean;
    public showClassRelatedField = false;
    public showContentFolderRelatedField = false;

    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() != 1 ? new Date(this.setDate).getDate() - 1 : -1,
        },
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: this.myDpOptions.disableUntil.year,
            month: this.myDpOptions.disableUntil.month,
            day: this.myDpOptions.disableUntil.day
        },
    };
    myDpOptions2: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: this.myDpOptions.disableUntil.year,
            month: this.myDpOptions.disableUntil.month,
            day: this.myDpOptions.disableUntil.day
        },
    };
    public showStudentList: boolean;
    public assignForm: FormGroup;
    public timeErr: boolean;
    public studentData = [];
    public choosedData = [];
    public meridian = true;
    public spinner = false;
    public endDate: any;
    public startdate: any;
    public contentAssignedForm = '';
    public model: { singleDate: { jsDate: Date }; isRange: boolean };
    public showBatch = false;
    public assignType = '1';
    public classListData = [];
    public classDataSample = [];
    public teacherListData = [];
    public contentFolderListData = [];
    public releaseGrade: any = '';
    public contentType: any = '1';
    public checkQuestion: any = '0';
    public allowScore = false;
    public contentFormat = '1';

    constructor(public formBuilder: FormBuilder, public datePipe: DatePipe, public auth: AuthService, public creatorService: CreatorService,
                public classService: ClassService, public router: Router, public toastr: ToastrService) {
        this.model = {isRange: false, singleDate: {jsDate: new Date()}};
        this.contentAssignedForm = this.auth.getSessionData('rista-assignedForm');
        this.assignForm = this.formBuilder.group({
            class: [''],
            radio: ['1'],
            downloadcontent: [''],
            releaseScore: ['0'],
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            confirmpassword: '',
            startDate: [''],
            endDate: [''],
            startTime: [''],
            endTime: [''],
            specificstudent: [''],
            typeSelection: ['n/a'],
            contentFolder: [null],
            classSelect: [null],
            teacherSelect: [null]
        });
        this.showStudentList = false;
    }

    ngOnInit(): void {
        console.log(this.classData, 'classData');
        console.log(this.contentDetails, 'contentDetails');
        if (this.contentAssignedForm == 'class') {
            this.assignType = '1';
            this.showClassRelatedField = true;
            this.showContentFolderRelatedField = false;
            this.liststudent(this.classData[0].class_id);
            this.patchValue();
        } else if (this.contentAssignedForm == 'content-Folder') {
            this.assignType = '2';
            this.contentFolderList();
            this.showContentFolderRelatedField = true;
            this.showClassRelatedField = false;
        } else {
            this.classData = [];
            this.classList();
            this.contentFolderList();
            const stObject = {hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00')};
            this.assignForm.controls.startTime.patchValue(stObject);
            const etObject = {hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00')};
            this.assignForm.controls.endTime.patchValue(etObject);
        }
        this.teacherList();
        this.contentType = this.contentDetails.content_type;
        this.releaseGrade = this.contentDetails.allow_autograde;
        this.checkQuestion = this.contentDetails.without_question;
        this.contentFormat = this.contentDetails.content_format;
        console.log(this.contentDetails, 'conte');
        console.log(this.showClassRelatedField, this.showContentFolderRelatedField, this.contentAssignedForm, 'condotion');
    }


    onDateChanged(event: IMyDateModel): void {
        this.myDpOptions1 = {};
        this.myDpOptions1 = {
            dateRange: false,
            dateFormat: dateOptions.pickerFormat,
            firstDayOfWeek: 'su',
            disableUntil: {
                year: event.singleDate.date.year,
                month: event.singleDate.date.month,
                day: event.singleDate.date.day - 1
            },
        };
    }


    onDateChanged1(event: any): void {
        this.myDpOptions.disableSince = event.date;
    }


    changeStartTime() {
        if (this.assignForm.controls.startDate.value.singleDate.jsDate && this.assignForm.controls.endDate.value.singleDate.jsDate) {
            const startDate = this.datePipe.transform(this.assignForm.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const endDate = this.datePipe.transform(this.assignForm.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            if (this.assignForm.controls.startTime.value && this.assignForm.controls.endTime.value) {
                const startTime = parseInt(this.assignForm.controls.startTime.value.hour);
                const startTimeHour = parseInt(this.assignForm.controls.startTime.value.minute);
                const endTime = parseInt(this.assignForm.controls.endTime.value.hour);
                const endTimeHour = parseInt(this.assignForm.controls.endTime.value.minute);
                const totalStartTimeMins = (startTime * 60) + startTimeHour;
                const totalendTimeHour = (endTime * 60) + endTimeHour;
                if (startDate == endDate) {
                    this.timeErr = totalStartTimeMins >= totalendTimeHour;
                } else {
                    this.timeErr = false;
                }
            }
        }
    }

    typeSelection() {
        const selectBox: any = document.getElementById('selectBox');
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        console.log(selectedValue, 'selected');
        if (selectedValue == 1) {
            this.showContentFolderRelatedField = false;
            this.showClassRelatedField = true;
            this.assignType = '1';
        } else if (selectedValue == 2) {
            this.assignForm.controls.radio.patchValue('1');
            this.showContentFolderRelatedField = true;
            this.showClassRelatedField = false;
            this.assignType = '2';
            this.startdate = '';
            this.endDate = '';
            this.assignForm.controls.classSelect.patchValue(null);
            this.assignForm.controls.notes.patchValue('');
            const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
            const dropped = dr1.split('-');
            const droppedObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2]))},
                dateRange: null
            };
            this.assignForm.controls.startDate.patchValue(droppedObject);
        }
        this.allowScore = this.releaseGrade == '1' && this.contentType != '1';   
        console.log(this.allowScore, 'allowScore');                 
        console.log(this.releaseGrade, 'releaseGrade');                 
        console.log(this.contentType, 'contentType');                 
    }

    selectStudent(event) {
        console.log(event, 'get ev');
        if (event != undefined) {
            this.classData = [event];
            this.assignForm.controls.specificstudent.patchValue([]);
            // this.classbatchid = event.batch_id;
            if (event.start_date != '0000-00-00') {
                const sd = event.end_date.split('-');
                const sdObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))},
                    dateRange: null
                };
                const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
                const dropped = dr1.split('-');
                const droppedObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2]))},
                    dateRange: null
                };
                this.assignForm.controls.startDate.patchValue(droppedObject);
                this.myDpOptions2 = {};
                this.myDpOptions2 = {
                    dateRange: false,
                    dateFormat: dateOptions.pickerFormat,
                    firstDayOfWeek: 'su',
                    disableUntil: {
                        year: this.myDpOptions.disableUntil.year,
                        month: this.myDpOptions.disableUntil.month,
                        day: this.myDpOptions.disableUntil.day
                    }
                };

                this.startdate = event.start_date;
            } else {
                const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
                const dropped = dr1.split('-');
                const droppedObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2]))},
                    dateRange: null
                };
                this.assignForm.controls.startDate.patchValue(droppedObject);
            }
            if (event.end_date != '0000-00-00') {
                const sd = event.end_date.split('-');
                const sdObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))},
                    dateRange: null
                };
                // this.linkform.controls.endDate.patchValue(sdObject);
                this.myDpOptions1 = {};
                this.myDpOptions1 = {
                    dateRange: false,
                    dateFormat: dateOptions.pickerFormat,
                    firstDayOfWeek: 'su',
                    disableUntil: {
                        year: this.myDpOptions.disableUntil.year,
                        month: this.myDpOptions.disableUntil.month,
                        day: this.myDpOptions.disableUntil.day
                    }
                };
                this.endDate = event.end_date;
            } else {
                this.assignForm.controls.endDate.patchValue(null);
            }
            const stObject = {hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00')};
            this.assignForm.controls.startTime.patchValue(stObject);
            const etObject = {hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00')};
            this.assignForm.controls.endTime.patchValue(etObject);
            this.liststudent(event.class_id);
        } else {
            this.assignForm.controls.endDate.patchValue(null);
            this.assignForm.controls.specificstudent.patchValue([]);
            this.studentData = [];
            this.classData = [];
            this.startdate = '';
            this.endDate = '';
        }
    }

    teacherFilter(event) {
        console.log(event);
        this.assignForm.controls.classSelect.patchValue([]);
        this.assignForm.controls.specificstudent.patchValue([]);
        this.studentData = [];
        this.assignForm.controls.endDate.patchValue(null);
        if (event != undefined) {
            this.classData = this.classDataSample.filter((val) => {
                return event.teacher_id == val.teacher_id;
            });
        } else {
            this.classData = this.classDataSample;
        }
        console.log(this.classData, 'classData');
        console.log(this.classDataSample, 'classDataSample');
    }

    classList() {
        const data = {
            platform: 'web',
            type: '5',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0'
        };
        this.classService.classesList(data).subscribe((successData) => {
                this.classListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_classLst');
            });
    }

    classListSuccess(successData) {
        if (successData.IsSuccess) {
            this.classListData = successData.ResponseObject;
            this.classDataSample = successData.ResponseObject;
        }
    }

    liststudent(classId) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: classId
        };
        this.creatorService.classList(data).subscribe((successData) => {
                this.studentListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_studentList');
            });
    }

    studentListSuccess(successData) {
        if (successData.IsSuccess) {
            this.studentData = successData.ResponseObject;
        }
    }

    teacherList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.individualTeacherList(data).subscribe((successData) => {
                this.teacherListSuccess(successData);
            },
            (error) => {
                console.log(error, 'error');
            });
    }

    teacherListSuccess(successData) {
        if (successData.IsSuccess) {
            this.teacherListData = successData.ResponseObject;
        }
    }

    contentFolderList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            type: '2'
        };
        this.classService.batchList(data).subscribe((successData) => {
                this.contentFolderListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_batchData');
            });
    }

    contentFolderListSuccess(successData) {
        if (successData.IsSuccess) {
            this.contentFolderListData = successData.ResponseObject;
        }
    }

    dateValidation1() {
        if (this.assignForm.controls.startDate.value != null && this.assignForm.controls.endDate.value != null && this.assignForm.controls.startDate.value != '' && this.assignForm.controls.endDate.value != '') {
            const startdate = this.datePipe.transform(this.assignForm.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const st = startdate.split('-');
            const endDate = this.datePipe.transform(this.assignForm.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const et = endDate.split('-');
            if (st[0] == et [0]) {
                if (st[1] == et [1]) {
                    this.dateValidation = st[2] <= et [2];
                } else {
                    this.dateValidation = st[1] <= et [1];
                }
            } else {
                this.dateValidation = true;
            }
        } else {
            this.dateValidation = true;
        }
    }

    submitAssign(type) {
        this.dateValidation1();
        const allstudent = this.assignForm.controls.radio.value;
        const typeSelection = this.assignForm.controls.typeSelection.value;
        let batchId = '';
        let classId = '';
        const assignedForm = this.auth.getSessionData('rista-assignedForm');
        if (assignedForm == 'class') {
            if (this.auth.getSessionData('rista-batchassign') == '1' || this.auth.getSessionData('rista-batchassign') == '3') {
                batchId = this.classData[0].batch_id;
                classId = this.classData[0].class_id;
            } else if (this.auth.getSessionData('rista-batchassign') == '2') {
                batchId = this.assignForm.controls.contentFolder.value;
                classId = '';
            }
        } else if (assignedForm == 'content-Folder') {
            batchId = this.assignForm.controls.contentFolder.value;
            classId = '';
        } else {
            if (typeSelection == '1') {
                batchId = this.classData.length != 0 ? this.classData[0].batch_id : '';
                classId = this.classData.length != 0 ? this.classData[0].class_id : '';
            } else {
                const batchValue = JSON.parse(this.auth.getSessionData('selectedbatchId'));
                batchId = batchValue ? (batchValue.length == 0  ? '' : batchValue) : '';
                classId = '';
            }
        }
        const allStudentValue = allstudent == '1' || type == '2' || typeSelection == '2' ? '1' : '0';
        const selectedStudentId = allstudent == '1' || type == '2' || typeSelection == '2' ? '' : this.assignForm.controls.specificstudent.value == '' ? [] : this.assignForm.controls.specificstudent.value
        if (classId != '' || batchId != '') {
            if ((allStudentValue == '0' && this.studentData.length != 0) || allStudentValue == '1') {
                if ((allStudentValue == '0' && selectedStudentId != '' && selectedStudentId != null) || allStudentValue == '1') {
                    if (this.dateValidation == true) {
                        const data = {
                            platform: 'web',
                            role_id: this.auth.getSessionData('rista-roleid'),
                            user_id: this.auth.getSessionData('rista-userid'),
                            assign: this.assignType,
                            school_id: this.auth.getSessionData('rista-school_id'),
                            classdetails: [{
                                content_id: this.contentDetails.content_id,
                                class_id: this.classData[0]?.class_id,
                                start_date: this.assignForm.controls.startDate.value == null || this.assignForm.controls.startDate.value == '' || this.showBatch == true ? '' : this.datePipe.transform(this.assignForm.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                                end_date: this.assignForm.controls.endDate.value == null || this.assignForm.controls.endDate.value == '' || this.showBatch == true ? '' : this.datePipe.transform(this.assignForm.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                                start_time: this.assignForm.controls.startTime.value == null || this.showBatch == true ? '' : this.assignForm.controls.startTime.value,
                                end_time: this.assignForm.controls.endTime.value == null || this.showBatch == true ? '' : this.assignForm.controls.endTime.value,
                                all_student: allStudentValue,
                                student_id: selectedStudentId,
                                batch_id: '',
                                auto_review: this.assignForm.controls.releaseScore.value,
                                notes: '',
                                download: this.assignForm.controls.downloadcontent.value ? '1' : '0'
                            }],
                            classroomDetails: [{
                                content_id: [this.contentDetails.content_id],
                                batch_id: batchId,
                                start_date: this.assignForm.controls.startDate.value == null || this.assignForm.controls.startDate.value == '' || this.showBatch == true ? '' : this.datePipe.transform(this.assignForm.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                                end_date: this.assignForm.controls.endDate.value == null || this.assignForm.controls.endDate.value == '' || this.showBatch == true ? '' : this.datePipe.transform(this.assignForm.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                                start_time: this.assignForm.controls.startTime.value == null || this.showBatch == true ? '' : this.assignForm.controls.startTime.value,
                                end_time: this.assignForm.controls.endTime.value == null || this.showBatch == true ? '' : this.assignForm.controls.endTime.value,
                            }],
                            editor_type: ''
                        };
                        this.creatorService.addAssignResourse(data).subscribe((successData) => {
                                this.submitSuccess(successData);
                            },
                            (error) => {
                                console.error(error, 'error_submit');
                            });
                    } else {
                        this.toastr.error('End Date Should be greater than Start Date');
                    }
                } else {
                    this.toastr.error('Select Atleast one Student');
                }
            } else {
                this.toastr.error('No Student Available in this class please select all student');
            }
        } else {
            this.toastr.error('Please fill the mandatory field');
        }
    }

    submitSuccess(successData) {
        if (successData.IsSuccess) {
            // this.submitData = successData.ResponseObject;
            this.toastr.success('Class Resource Updated Successfully');
            this.auth.setSessionData('rista-contentType', '');
            console.log(this.auth.getSessionData('rista-assignedForm'), 'ristaAssigned');
            if (this.auth.getSessionData('rista-assignedForm') == 'class') {
                this.router.navigate(['class/topicsAndCurriculum/1']);
            } else if (this.auth.getSessionData('rista-assignedForm') == 'content-Folder') {
                this.router.navigate(['class/view-assign/2']);
            } else {
                this.router.navigate(['repository/content-home']);
            }
            this.auth.setSessionData('rista-resourceAccess', false);
            this.auth.removeSessionData('rista-assignedForm');
        } else {
            this.toastr.error(successData.ErrorObject ? successData.ErrorObject : successData.ResponseObject);
            this.assignForm.controls.startDate.patchValue(null);
            this.assignForm.controls.endDate.patchValue(null);
            this.startdate = '';
            this.endDate = '';
            const stObject = {hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00')};
            this.assignForm.controls.startTime.patchValue(stObject);
            const etObject = {hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00')};
            this.assignForm.controls.endTime.patchValue(etObject);
            this.myDpOptions2 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
            };
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
            };
        }
        this.closePopUp.emit();
    }

    classDetailService() {
        // this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: this.classData[0].class_id
        };
        this.classService.classDetails(data).subscribe((successData) => {
                this.enterListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_enter');
            });
    }

    enterListSuccess(successData) {
        if (successData.IsSuccess) {
            // this.commondata.showLoader(false);
            this.auth.setSessionData('classView', true);
            this.auth.setSessionData('card-data', JSON.stringify(successData.ResponseObject));
            this.auth.setSessionData('studentlist', JSON.stringify(successData.ResponseObject[0].students));
            this.auth.setSessionData('studentlist1', JSON.stringify(successData.ResponseObject[0].students));
            if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
                if (this.auth.getSessionData('rista-batchassign') == '1') {
                    this.router.navigate(['class/topicsAndCurriculum/1']);
                }else if (this.auth.getSessionData('rista-batchassign') == '3'){
                    this.router.navigate(['class/topicsAndCurriculum/3']);
                }
            }
        }
    }

    close() {
        // this.router.navigate(['repository/content-home']);
        if (this.auth.getSessionData('rista-assignedForm') == 'class') {
            this.router.navigate(['class/topicsAndCurriculum/1']);
        } else if (this.auth.getSessionData('rista-assignedForm') == 'content-Folder') {
            this.router.navigate(['class/view-assign/2']);
        } else {
            this.router.navigate(['repository/content-home']);
        }
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.removeSessionData('rista-assignedForm');
        this.closePopUp.emit();
    }

    patchValue() {
        this.assignForm.controls.class.patchValue(this.classData[0].class_id);
        if (this.classData[0].start_date != '0000-00-00') {
            const sd = this.classData[0].start_date.split('-');
            const sdObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))},
                dateRange: null
            };
            const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
            const dropped = dr1.split('-');
            const droppedObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2]))},
                dateRange: null
            };
            this.assignForm.controls.startDate.patchValue(droppedObject);
            this.myDpOptions1 = {};
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
                disableUntil: {
                    year: parseInt(sd[0]),
                    month: parseInt(sd[1]),
                    day: parseInt(sd[2]) - 1
                },
            };
            this.startdate = this.classData[0].start_date;
        } else {
            const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
            const dropped = dr1.split('-');
            const droppedObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2]))},
                dateRange: null
            };
            this.assignForm.controls.startDate.patchValue(droppedObject);
            // this.linkform.controls.startDate.patchValue(null);
        }
        if (this.classData[0].end_date != '0000-00-00') {
            const sd = this.classData[0].end_date.split('-');
            const sdObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))},
                dateRange: null
            };
            // this.linkform.controls.endDate.patchValue(sdObject);
            this.myDpOptions1 = {};
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
                disableUntil: {
                    year: this.myDpOptions.disableUntil.year,
                    month: this.myDpOptions.disableUntil.month,
                    day: this.myDpOptions.disableUntil.day
                },
            };
            this.endDate = this.classData[0].end_date;
        } else {
            this.assignForm.controls.endDate.patchValue(null);
        }
        const stObject = {hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00')};
        this.assignForm.controls.startTime.patchValue(stObject);
        const etObject = {hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00')};
        this.assignForm.controls.endTime.patchValue(etObject);
    }
}
