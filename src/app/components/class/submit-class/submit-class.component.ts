import {Component, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {ClassService} from '../../../shared/service/class.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ViewChild} from '@angular/core';
import {ValidationService} from '../../../shared/service/validation.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {DomSanitizer} from '@angular/platform-browser';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {StudentService} from '../../../shared/service/student.service';
import {dateOptions, timeZone} from "../../../shared/data/config";

@Component({
    selector: 'app-submit-class',
    templateUrl: './submit-class.component.html',
    styleUrls: ['./submit-class.component.scss']
})
export class SubmitClassComponent implements OnInit {
    @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
    public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() - 1
        },
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() - 1
        },
    };
    public studentClassChange: FormGroup;
    public choosedData: any;
    public schoolId: any;
    public webhost: any;
    public listData: any;
    public settings: any;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public modifyList: boolean;
    searchedKeyword: string;
    public selected: any;
    public selectedRows: any;
    rows = [];
    temp = [];
    public valid: any;
    loadingIndicator = true;
    public studentData: any;
    public selectedChangeStudent: any;
    public studentData1: any;
    public allGrade: any = [];
    public allClassList: any = [];
    public classStudentList: any = [];
    public listView: any;
    public classType: any;
    public teacherType: any;
    public classname: any;
    public gradeid: any;
    public classid: any;
    public roleId: any;
    public editButton: boolean;
    public hideButton: boolean;
    public hideTableButton: boolean;
    public hidedeleteButton: boolean;
    public schoolIdNum: any;
    public gradeData: any;
    public gradeValue: any;
    public gradName: any;
    public schoolListDetails: any;
    public allowClass: boolean;
    public allowTransfer: boolean;
    public curriculumButton: boolean;
    public allowSelect: boolean;
    public datanew: [];
    public selectedToClass: any;
    @ViewChild('validity') validityContent: TemplateRef<any>;
    @ViewChild('class') deleteClass: TemplateRef<any>;
    @ViewChild('editvalidation') editValidityCheck: TemplateRef<any>;
    @ViewChild('studentChange') changeStudent: TemplateRef<any>;
    public searchedword: any;
    public newrow: [];
    constructor(private formBuilder: FormBuilder, public config: NgbModalConfig, public confi: ConfigurationService, private modalService: NgbModal,
                public auth: AuthService, public commondata: CommonDataService, public classes: ClassService, public router: Router, public sanitizer: DomSanitizer,
                public route: ActivatedRoute, public firstcaps: TitleCasePipe, public toastr: ToastrService, public validationService: ValidationService,
                public common: CommonService, public newSubject: NewsubjectService, public student: StudentService, public datePipe: DatePipe) {
        this.roleId = this.auth.getRoleId();
        this.route.params.forEach((params) => {
            this.classType = params.id;
        });
        this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
        this.choosedData = JSON.parse(this.auth.getSessionData('card-data'));
        this.studentClassChange = this.formBuilder.group({
            toClass: [null, Validators.required],
            from_startdate: ['', Validators.required]
        });
        this.classname = this.choosedData[0].class_name;
        this.newrow = [];
        this.teacherType = this.auth.getSessionData('rista-teacher_type');
        this.listView = this.auth.getSessionData('classView');
        this.schoolIdNum = this.auth.getSessionData('rista-school_id');
        if (this.classType == '1'){
            this.gradeid = ['-1'];
            this.classid = this.choosedData[0].class_id;
        }
        else if (this.classType == '2'){
            if (this.choosedData[0].grade == ''){
                this.gradeid = [];
            }else {
                this.gradeid = [this.choosedData[0].grade];
            }
            this.classid = '0';
        }
        if (this.choosedData[0].grade.length >= 3) {
            const splitGrade = this.choosedData[0].grade.split(',');
            for (let i = 0; i < splitGrade.length; i++) {
                this.allGrade.push(splitGrade[i]);
            }
        } else {
            this.allGrade.push(this.choosedData[0].grade);
        }
        this.hideTableButton = this.choosedData[0].classDate_status != '4' || this.roleId == '2';
        this.curriculumButton = this.choosedData[0].classDate_status != '4' || this.roleId == '2';
        this.hidedeleteButton = !((this.choosedData[0].classDate_status == '3' && this.choosedData[0].class_status == '0') || (this.choosedData[0].classDate_status == '4' && this.roleId != '2'));
        this.hideButton = true;
        this.editButton = this.auth.getSessionData('editView') == 'true';
        if (this.choosedData[0].classDate_status == '5'){
            this.editButton = true;
            this.hideButton = false;
        }else if (this.choosedData[0].classDate_status == '4' && this.choosedData[0].class_status == '1'){
            this.curriculumButton = true;
            this.hideTableButton = true;
            this.hidedeleteButton = true;
        }
        else if (this.choosedData[0].classDate_status == '4' && this.choosedData[0].class_status == '0') {
            this.hideButton = false;
        }
        this.schoolId = JSON.parse(this.auth.getSessionData('rista_data1'));
        if (this.auth.getSessionData('rista-roleid') == '2'){
            this.schoolIdNum = this.auth.getSessionData('rista-school_id');
        }else if (this.auth.getSessionData('rista-roleid') == '4'){
            this.schoolIdNum = this.schoolId.school_id;
        }
        this.modifyList = false;
        config.backdrop = 'static';
        config.keyboard = false;
        this.selected = [];
        this.valid = [];
        this.webhost = this.confi.getimgUrl();
        if ((this.auth.getSessionData('rista-roleid') == '4') && this.auth.getSessionData('rista-teacher_type') == '0'){
            if (this.schoolListDetails.permissions[6].permission[0].status == 1){
                this.allowClass = true;
            }else if (this.schoolListDetails.permissions[6].permission[0].status == 0){
                this.allowClass = false;
            }
            if (this.schoolListDetails.permissions[7].permission[0].status == 1){
                this.allowTransfer = true;
            }else if (this.schoolListDetails.permissions[7].permission[0].status == 0){
                this.allowTransfer = false;
            }
        }else {
            this.allowClass = true;
            this.allowTransfer = true;
        }
        if (this.allowClass == false){
            this.hideTableButton = false;
            this.hideButton = false;
            this.editButton = false;
            // this.curriculumButton = true;
            this.hidedeleteButton = false;
        }
    }
    ngOnInit(): void {
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);
        this.gradeStudentList();
        this.gradeList();
        // this.searchStudent(1);
        this.studentClassList(0);
        this.auth.removeSessionData('rista-backOption');
    }
    gradeList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.classes.gradeList(data).subscribe( (successData) => {
                this.gradeListSuccess(successData);
            },
            (error) => {
                this.gradeListFailure(error);
            });
    }
    gradeListSuccess(successData) {
        if (successData.IsSuccess) {
            this.gradeData = successData.ResponseObject;
        }
    }
    gradeListFailure(error) {
        console.log(error, 'error');
    }
    addGradeOutside(list, id, student_id, status){
        if (status == '0'){
           this.addGrade(list, id);
        }else{
            this.removeGrade(student_id, id);
        }
    }
    addGrade(list, id){
        this.studentData.forEach((value, index) => {
            if (value.student_id == list.student_id) {
                this.temp.push(this.studentData[index]);
                this.studentData[index].status = '1';
                this.studentData[index].isSelect = false;
            }
        });
        this.rows =  [...this.temp];
    }
    getGradeValue(event){
        if (typeof event == 'undefined') {
            this.gradeValue = [];
            this.searchStudent(1);
        }else if (event.length == 0){
            this.gradeValue = undefined;
            if (this.searchedword == '' || this.searchedword == undefined) {
                this.searchStudent(2);
                this.studentData = [];
            } else {
                this.searchStudent(1);
            }
        }
        else {
            this.gradeValue = [];
            for (let i = 0; i < event.length ; i++){
                this.gradeValue.push(event[i].grade_id);
            }
            this.searchStudent(1);
        }
    }
    updateFilter(event) {
        this.searchedword = event.target.value;
        const val = event.target.value.toLowerCase();
        if (val != ''){
            const temp = this.studentData1.filter(function(d) {
                return d.student_id.toLowerCase().indexOf(val) !== -1 ||  d.name.toLowerCase().indexOf(val) !== -1  || d.grade_name.toLowerCase().indexOf(val) !== -1 || !val;
            });
            this.studentData = temp;
        }
        else if (val == '' && (this.gradeValue == '' || this.gradeValue == undefined)) {
            this.searchStudent(2);
            this.studentData = [];
        }else if (val == '' && this.gradeValue != ''){
            this.searchStudent(1);
        }
    }
    removeGrade(schoolid, id){
        let pos = this.temp.map((e) => { return e.student_id; }).indexOf(schoolid);
        this.temp.splice(pos, 1);
        this.studentData[id].status = '0';
        this.studentData[id].isSelect = false;
        this.rows =  [...this.temp];
    }
    deleteAction(){
        this.modalRef = this.modalService.open(this.deleteClass, { size: 'md', backdrop: 'static' });
    }
    updateDelete(){
        this.classdelete();
    }
    onActivate(event) {
    }
    onSelect(selected, type){
        let selectedItem = [];
        if (type == 'direct'){
            this.selected = selected.selected;
            selected.selected.forEach((item) => {
                selectedItem.push(item.user_id);
            });
        }else {
            let shiftSelected = [selected]
            this.selected = shiftSelected;
            shiftSelected.forEach((item) => {
                selectedItem.push(item.user_id);
            });
        }
        // type == 'direct' ? selected.selected : selected;
        // this.selected = selected.selected;
        // selected.selected.forEach((item) => {
        //     selectedItem.push(item.user_id);
        // });
        this.rows.forEach((item) => {
            item.isSelect = selectedItem.includes(item.user_id);
        });
    }
    removeAction(selected) {
       let data = [];
       this.selected = [];
       this.rows.forEach((item , index) => {
            if (item.isSelect == false){
                data.push(item);
            }
        });

       this.selected.filter((item) => {
            return item.isSelect == true;
        });
       this.selectedRows = selected;
        for (let j = 0; j < this.selectedRows.length; j++) {
            for (let k = 0; k < this.studentData.length; k++) {
                if (this.selectedRows[j].student_id == this.studentData[k].student_id) {
                    this.studentData[k].status = '0';
                }
            }
        }
       this.rows = [...data];
       this.temp = data;
       this.auth.setSessionData('studentlist1', JSON.stringify(this.rows));
       this.auth.setSessionData('studentlist', JSON.stringify(this.rows));
    }
    modifylist() {
        this.modifyList = !this.modifyList;
        for (let i = 0; i < this.studentData.length; i++){
            this.gradName = this.studentData[i].grade_id;
        }
        this.studentData = [];
    }
    editAction(){
        this.auth.setSessionData('classView', true );
        this.auth.setSessionData('editclass', JSON.stringify(this.choosedData));
        this.auth.setSessionData('studentlist', JSON.stringify(this.rows));
        this.auth.setSessionData('studentlist1', JSON.stringify(this.rows));
        this.auth.setSessionData('updatedStudent', 1);
        this.router.navigate(['/class/create-class/edit']);
        if (this.choosedData[0].classDate_status == '2'){
            this.auth.removeSessionData('readonly_startdate');
        }else if (this.choosedData[0].classDate_status == '3'){
            if (this.choosedData[0].class_status == '1'){
                this.auth.removeSessionData('readonly_startdate');
                this.auth.removeSessionData('readonly_data');
            }else {
                this.auth.setSessionData('readonly_startdate', 'yes');
                if (this.auth.getSessionData('rista-roleid') == '4' && this.teacherType == '0'){
                    this.auth.setSessionData('readonly_data', 'true');
                }else {
                    this.auth.removeSessionData('readonly_data');
                }
            }
        }
    }
    backAction(){
        this.listView = false;
        this.router.navigate(['/class/create-class/addEdit']);
        this.auth.setSessionData('editclass', JSON.stringify(this.choosedData));
        this.auth.setSessionData('studentlist', JSON.stringify(this.rows));
        this.auth.setSessionData('studentlist1', JSON.stringify(this.rows));
        this.auth.setSessionData('updatedStudent', 1);
        if (this.roleId == '2' && this.choosedData[0].classDate_status == '4') {
            this.auth.setSessionData('readonly_startdate', 'yes');
        } else if (this.choosedData[0].classDate_status == '3' || this.choosedData[0].classDate_status == '5') {
            this.auth.setSessionData('readonly_startdate', 'yes');
            // this.auth.setSessionData('readonly_data', 'true');
        }
    }
    gradeStudentList() {
        if (this.auth.getSessionData('studentlist') != ''){
            this.classid = this.choosedData[0].class_id;
            this.gradeid = ['-1'];
            // this.batchid = ['0'];
        }else {
            this.classid = '0';
            // this.batchid = this.choosedData[0].batch_id;
            if (this.choosedData[0].grade == ''){
                this.gradeid = [];
            }else {
                this.gradeid = [this.choosedData[0].grade];
            }
        }
        const data = {
            platform: 'web',
            type: 'list',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
            class_id: this.classid,
            grade_id: this.gradeid,
            // batch_id: this.batchid,
            end_date: this.choosedData[0].end_date
        };
        this.classes.studentList(data).subscribe( (successData) => {
                this.studentListSuccess(successData);
            },
            (error) => {
                this.studentListFailure(error);
            });
    }
    studentListSuccess(successData) {
        if (successData.IsSuccess) {
            this.listData = successData.ResponseObject;
            if (this.auth.getSessionData('studentlist') != ''){
                // This rows is used when the user goes to add class component after class is created//
                this.rows = JSON.parse(this.auth.getSessionData('studentlist'));
                this.temp = [...this.rows];
            }
            else {
                this.datanew = this.listData;
                if (this.auth.getSessionData('studentlist1') != ''){
                    this.newrow = JSON.parse(this.auth.getSessionData('studentlist1'));
                    this.rows = [...this.datanew, ...this.newrow];
                }else {
                    this.rows = [...this.datanew];
                }
                this.rows = this.rows.filter((item, index, array) =>
                    index === array.findIndex((findTest) =>
                    findTest.student_id === item.student_id
                    )
                );
                this.temp = this.rows;
            }
            this.rows.forEach((item) => {
                item.isSelect = false;
            });
            this.searchStudent(1);
        }
    }
    studentListFailure(error) {
        console.log(error, 'error');
    }
    searchStudent(id) {
        if (this.gradeValue != ''){
            const data = {
                platform: 'web',
                type: 'list',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.schoolIdNum,
                end_date: this.choosedData[0].end_date,
                grade_id: this.gradeValue,
            };
            this.classes.searchList(data).subscribe( (successData) => {
                    this.addstudentListSuccess(successData, id);
                },
                (error) => {
                    this.addstudentListFailure(error);
                });
        }
        else{
            this.studentData = [];
        }
    }
    addstudentListSuccess(successData , id) {
        if (successData.IsSuccess) {
            this.studentData = successData.ResponseObject;
            this.studentData1 = successData.ResponseObject;
            for (let i = 0; i < this.studentData.length; i++){
                this.studentData[i].status = '0';
                this.studentData[i].name = this.studentData[i].first_name + ' ' + this.studentData[i].last_name;
                for (let j = 0; j < this.rows.length; j++){
                    if (this.studentData[i].student_id == this.rows[j].student_id){
                        this.studentData[i].status = '1';
                    }
                }
            }
            if (id == 2){
                this.studentData = [];
            }
        }
    }
    addstudentListFailure(error) {
        console.log(error, 'error');
    }
    viewAssign(type){
        this.submitClass(type);
    }
    submitClass(type) {
        for (let i = 0; i < this.temp.length; i++) {
            if (this.temp[i].grade_id !== this.allGrade) {
                this.allGrade.push(this.temp[i].grade_id);
            }
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
            teacher_id: this.choosedData[0].teacher_id,
            class_name: this.choosedData[0].class_name,
            subject: this.choosedData[0].subject,
            start_date: this.choosedData[0].start_date,
            end_date: this.choosedData[0].end_date,
            start_time: this.choosedData[0].start_time,
            end_time: this.choosedData[0].end_time,
            grade: this.allGrade,
            meeting_link: this.choosedData[0].meeting_link,
            meeting_id: this.choosedData[0].meeting_id,
            passcode: this.choosedData[0].passcode,
            class_code: this.choosedData[0].class_code,
            status: this.choosedData[0].status,
            class_id: this.choosedData[0].class_id,
            students: this.temp,
        };
        this.classes.submit(data).subscribe((successData) => {
                this.submitClassSuccess(successData, type);
            },
            (error) => {
                this.submitClassFailure(error);
            });
    }
    submitClassSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.auth.setSessionData('submit-data', JSON.stringify(successData.ResponseObject[0]));
            this.auth.removeSessionData('updatedStudent');
            this.auth.removeSessionData('readonly_data');
            this.auth.removeSessionData('readonly_startdate');
            this.auth.removeSessionData('studentlist1');
            this.auth.removeSessionData('class-curriculum');
            const redirectSchedulePage = !!this.auth.getSessionData('enterThroughSchedule');

            if (type == '1'){
                this.toastr.success(successData.ResponseObject, 'Class');
                this.auth.removeSessionData('editView');
                if (redirectSchedulePage == true) {
                    this.auth.removeSessionData('enterThroughSchedule');
                    this.router.navigate(['/schedule/schedule-page']);
                } else {
                    this.router.navigate(['/class/list-class']);
                }
            }else if (type == '2'){
                this.router.navigate(['/class/topicsAndCurriculum/1']);
            }
        } else{
            this.toastr.error(successData.ResponseObject, 'Class');
        }
    }
    submitClassFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject, 'Class');
    }
    classdelete(){
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id
        };
        this.classes.deleteclass(data).subscribe((successData) => {
                this.deleteClassSuccess(successData);
            },
            (error) => {
                this.deleteClassFailure(error);
            });
    }
    deleteClassSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success('Class deleted Successfully', 'Class');
            // this.auth.setSessionData('card-data', false);
            this.modalRef.close();
            const redirectSchedulePage = !!this.auth.getSessionData('enterThroughSchedule');
            if (redirectSchedulePage == true) {
                this.auth.removeSessionData('enterThroughSchedule');
                this.router.navigate(['/schedule/schedule-page']);
            } else {
                this.router.navigate(['/class/list-class']);
            }
        } else{
            this.toastr.error(successData.ResponseObject, 'Class');
        }
    }
    deleteClassFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject, 'Class');
    }
    showModal(selected) {
        this.selectedRows = selected;
        if (this.selectedRows == ''){
            this.modalRef = this.modalService.open(this.editValidityCheck);
        }else {
        this.valid = [];
        for (let i = 0; i < this.temp.length; i++) {
            for (let j = 0; j < this.selectedRows.length; j++) {
                if (this.selectedRows[j].student_id == this.temp[i].student_id) {
                    const date = this.temp[i].validity.split('-');
                    const dateObj: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]))}, dateRange: null};
                    this.temp[i].validity = dateObj;
                    this.temp[i].validity1 = dateObj;
                    this.valid.push(this.temp[i]);
                }
            }
        }
        this.modalRef = this.modalService.open(this.validityContent);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        }
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }


    typeChecking(value){
        let val = typeof value;
        return val;
    }

    update() {
        for (let i = 0; i < this.temp.length ; i++) {
            for (let j = 0; j < this.valid.length; j++) {
                if (this.valid[j].student_id == this.temp[i].student_id) {
                    if (this.valid[j].validity1 == this.temp[i].validity1) {
                        const patchDate = this.valid[j].validity1.singleDate.jsDate;
                        function convert(str) {
                            var date = new Date(str),
                                mnth = ('0' + (date.getMonth() + 1)).slice(-2),
                                day = ('0' + date.getDate()).slice(-2);
                            return [date.getFullYear(), mnth, day].join('-');
                        }
                        this.temp[i].validity = convert(patchDate);
                    } else {
                        const patchDate = this.valid[j].validity1.singleDate.formatted;
                        this.temp[i].validity = patchDate;
                    }
                }
            }
        }
        this.modalRef.close();
    }
    onDateChanged(event: IMyDateModel): void {
    }
    cancel() {
        for (let i = 0; i < this.temp.length ; i++) {
            for (let j = 0; j < this.valid.length; j++) {
                if (this.valid[j].student_id == this.temp[i].student_id) {
                    const patchDate = this.valid[j].validity.singleDate.jsDate;
                    function convert(str) {
                        var date = new Date(str),
                            mnth = ('0' + (date.getMonth() + 1)).slice(-2),
                            day = ('0' + date.getDate()).slice(-2);
                        return [date.getFullYear(), mnth, day].join('-');
                    }
                    this.temp[i].validity = convert(patchDate);
                }
            }
        }
        this.modalRef.close();
    }
    close(){
        this.modalRef.close();
    }

    classChange(event) {
        console.log(event);
        this.selectedChangeStudent = event;
        // this.student_id = event.user_id;
        this.studentClassList(event.user_id);
        this.modalRef = this.modalService.open(this.changeStudent, {size: 'lg'});
    }

    studentClassList(id) {

        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            student_id: id,
            class_id: this.choosedData[0].class_id,
            school_id: this.schoolId.school_id
        };
        this.student.studentClassList(data).subscribe((successData) => {
                this.studentClassListSuccess(successData, id);
            },
            (error) => {
                console.error(error, 'error');
            });
    }

    studentClassListSuccess(successData, id) {
        if (successData.IsSuccess) {
            if (id == 0) {
                this.allClassList = successData.ResponseObject;
                this.allClassList.forEach((val) => {
                    val['fromClassLabel'] = val.class_name + '  -  ' + val.teacher_name;
                });
                console.log(this.allClassList, 'allClassList');
            } else {
                this.classStudentList = successData.ResponseObject;
            }
        }
    }
selectedClass
    (event){
        this.selectedToClass = event;
        if (event.status == '1'){
            const sd = event.start_date.split('-');
            const sdObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))}, dateRange: null};
            this.myDpOptions1 = {};
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat:dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
                disableUntil: {
                    year: parseInt(sd[0]),
                    month: parseInt(sd[1]),
                    day: parseInt(sd[2]) - 1
                },
            };
        }
    }
    submitChangeClass(){
        if (this.choosedData[0].class_id == this.studentClassChange.controls.toClass.value){
            this.toastr.error('From Class and To Class should be different');
            return false;
        }
        console.log(this.studentClassChange.controls.from_startdate.value, 'startdata');
        if (this.studentClassChange.valid){
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.schoolId.school_id,
                from_class: this.choosedData[0].class_id,
                to_class: this.studentClassChange.controls.toClass.value,
                from_date: this.selectedToClass.start_date,
                end_date: this.selectedToClass.end_date,
                joining_date: this.studentClassChange.controls.from_startdate.value == null ? '' : this.datePipe.transform(this.studentClassChange.controls.from_startdate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                student_id: this.selectedChangeStudent.user_id,
                status: '1'
            };
            this.student.changeClass(data).subscribe((successData) => {
                    this.submitChangeSuccess(successData);
                },
                (error) => {
                    console.error(error, 'Submit_error');
                });
        }else {
            this.validationService.validateAllFormFields(this.studentClassChange);
            this.toastr.error('Please Select all the mandatory fields');
        }
    }

    submitChangeSuccess(successData){
        if (successData.IsSuccess){
            this.onSelect(this.selectedChangeStudent, 'non_direct');
            console.log(successData.ResponseObject, 'dasd');
            this.toastr.success(successData.ResponseObject);
            this.removeAction([this.selectedChangeStudent]);
            this.modalRef.close();
        }else {
            this.toastr.error(successData.ErrorObject);
        }
    }
}




