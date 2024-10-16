import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {TeacherService} from '../../../shared/service/teacher.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NavService} from '../../../shared/service/nav.service';
import {CreatorService} from '../../../shared/service/creator.service';
import {parse, stringify} from 'flatted';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {jsPDF} from 'jspdf';
import {Subscription} from 'rxjs';
import {SseClient} from 'ngx-sse-client';

@Component({
    selector: 'app-correction-page',
    templateUrl: './correction-page.component.html',
    styleUrls: ['./correction-page.component.scss']
})
export class CorrectionPageComponent implements OnInit, OnDestroy {
    public webhost: any;
    public filterForm: FormGroup;
    public classData: any;
    public studentData: any;
    public studentList: any;
    public correctionStudentList: any;
    public studentAnswer: any;
    public totalPoints: any;
    public totalFeedBack: any;
    public totalStudentFeedBack: any;
    public studentPoints: any;
    public pageType: any;
    public questionType: any;
    public interval: any;
    public sectionFilterVal: any = 'all';
    public totalAns: any = [];
    public totalAnsSample: any = [];
    public releaseStudent: any = [];
    public releaseStudentContentId: any = [];
    public dragQuestion: any = [];
    public workAnnotate: any = [];
    public workAnnotatePage: any = 0;
    public invalidData: boolean;
    public dataMissing: boolean;
    public functionCalled: boolean = false;
    public resetAnswer = false;
    public showpdf: boolean;
    public showfeed: boolean = false;
    public invalidScore: boolean = false;
    public answerSheet: boolean = false;
    public blink = false;
    public studentContentlist: any;
    public workAnnotatePDF: any;
    public showstudentContentlist: boolean;
    public anserPdfTemplate: any;
    public page = 0;
    public jsPDF: jsPDF;
    public selector: string = '.scrollPanelCorrection';
    public questionFilter = 'all';

    rect: Rectangle = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
    lastMousePosition: Position = {x: 0, y: 0};
    canvasPosition: Position = {x: 0, y: 0};
    mousePosition: Position = {x: 0, y: 0};
    mouseDownFlag: boolean = false;
    pagePosition: Position = {x: 0, y: 0};
    show: boolean = false;
    public shapesType: any = 'select';
    public pointerType: any;
    public elem: any;
    public globalPdfViewerPath: any;
    public queNum: any;
    public showInput: any;
    public pendingCall: any;
    public scoreStatus: any;
    public pdfpath: any;
    public answerSheetPath: any;
    public inputElement: any;
    public pageVariable: any;
    public deleteAnnatation: boolean;
    public mathEditor: boolean;
    public roughArea: boolean = false;
    public mathDelayer = false;
    public isPdfAvailable: boolean = true;
    public sheetIndex = 0;

    cnv;
    pdfBody;
    ctx;
    element = null;
    dataPageNumber: number;

    areaInfo: AreaInfo[] = [];
    previewInfo: any = [];
    sheetInfo: AreaInfo[] = [];
    subs: Subscription[] = [];
    indexOfPage: number = 1;
    showPopup: boolean = false;
    listRectangleId: string = '';

    public multiform: FormGroup;
    public repeatlink: FormArray;
    public icons: any;
    public subtype: any;
    public pdfTemplate: any;
    public count = 0;
    public totalPointsArray = [];
    public studentPointsArray = [];
    public closeResult: string;
    public options: any;
    public choices: any = [];
    public hide: boolean;
    public schoolId: any;
    public gradeData: any;
    public subjectData: any;
    public rectElem: any;
    public svgColor: any;
    public zoom = 1.0;
    public alphabets: any;
    public editData: any;
    public getTag: any = [];
    public detailData: any = [];
    public gradeSplit: any;
    public subjectSplit: any;
    public uploadType: any;
    public countList: any;
    public tagArray: any;
    public subQuestion: any = [];
    public totalSheetInfo: any = [];
    public itemsList: any = [];
    public totalsub: any = [];
    public teachername: any;
    public imagepath: any;
    public imagepaththumb: any;
    public getpdf: any;
    public getlinks: any;
    public recordBase64Url: any;
    public type: any;
    public selectedDeleteIcon: boolean = false;
    public dragCount: any = [];
    public buffer: any;
    public strPath: any;
    public textPosition: any;
    public dragpaths: any;
    public showdropdown: boolean;
    public queDrag: boolean;
    public savaText: boolean;
    public dragPageNumber: any;
    public studentName: any;
    public showPDFAnswer: boolean;
    // ];
    public dragQuestionsList: any = [];
    public textFontSize: any;
    public originalSize = false;
    public dragButton: any;
    public buttonName: any;
    public showingType: any;
    public draftAdd: any;
    public submitType: any;
    public selectedPageAnnatation: any;
    public deleteID: any;
    public disable: boolean;
    public currentPage: number = 1;
    public selectedQueNum: number;
    public itemSelect: any = [];
    public redoListArray: any = [];
    public correctPdfPath: any;
    public correctAnswerKeyPath: any;
    public uploadAnswerPath: any;
    public openmenu: boolean;
    public textValue: any;
    public showGrid: boolean;
    public allowSelect: boolean;
    public gridView: any;
    public studentListHighlight: any;
    public roleId: any;
    public redirect = '';
    @ViewChild('pdfPage') pdfPage: ElementRef<HTMLElement>;
    @ViewChild('class') deleteClass: TemplateRef<any>;
    @ViewChild('deleteAlert') deleteAlert: TemplateRef<any>;
    @ViewChild('workArea') workArea: TemplateRef<any>;
    private modalRef: NgbModalRef;
    private cx: CanvasRenderingContext2D;


    constructor(public config: NgbModalConfig, public confi: ConfigurationService, public sanitizer: DomSanitizer,
                public teacher: TeacherService, private formBuilder: FormBuilder, private modalService: NgbModal,
                public auth: AuthService, public commondata: CommonDataService, public navServices: NavService,
                public common: CommonService, public route: Router, public validationService: ValidationService,
                private sseClient: SseClient, public toastr: ToastrService, public creator: CreatorService,
                public newSubject: NewsubjectService) {
        this.studentContentlist = this.auth.getSessionData('student-content');
        console.log(this.studentContentlist, 'studentContent');
        console.log(this.auth.getSessionData('student-content'), 'this.auth.getSessionData(\'student-content\')');
        if (this.auth.getSessionData('correction-return')) {
            this.redirect = this.auth.getSessionData('correction-return');
        }
        this.showstudentContentlist = this.studentContentlist == 1;
        if (this.showstudentContentlist) {
            this.pageType = 2;
        } else {
            this.pageType = 1;
        }
        this.invalidData = false;
        this.showpdf = false;
        this.buttonName = 'Assignments and uploads';
        this.questionType = 4;
        this.showingType = 1;
        this.showPDFAnswer = false;
        this.webhost = this.confi.getimgUrl();
        this.filterForm = this.formBuilder.group({
            studentlist: '',
        });
        this.classData = JSON.parse(this.auth.getSessionData('rista-classDetails'));
        this.studentName = this.classData.student_name;
        this.studentsDetails(this.classData, 0);
        this.auth.removeSessionData('readonly_data');
        this.studentContentlist = this.auth.getSessionData('student-content');
        this.showstudentContentlist = this.studentContentlist == 1;
        this.showInput = true;
        this.svgColor = '#ff0000';
        this.disable = true;
        this.showInput = true;
        this.savaText = false;
        this.queDrag = false;
        this.deleteAnnatation = false;
        this.textFontSize = '16';
        this.queNum = [];
        this.previewInfo = [];
        this.roleId = this.auth.getSessionData('rista-roleid');
    }

    ngOnInit(): void {
        this.clickEvent();
        const myPics = document.getElementById('pdf-page1');
        this.listView(1);
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);
        if (this.showstudentContentlist) {
            this.studentsAnswerList(this.classData, this.classData.status);
            this.scoreStatus = this.classData.status;
        } else {
            console.log(this.showstudentContentlist, 'showcontent');
        }
    }

    ngOnDestroy(): void {
        this.auth.removeSessionData('student-content');
        this.auth.removeSessionData('correction-return');
        clearInterval(this.interval);
        this.subs.forEach((val) => {
            val.unsubscribe();
        });
    }

    showAnswerPdf(event) {
        this.showPDFAnswer = !!event.target.checked;
        this.showCorrectPdf();
    }

    selectAnswerSheet(index) {
        this.blink = false;
        this.sheetIndex = index;
        this.answerSheetPath = this.webhost + '/' + this.uploadAnswerPath[index]?.original_image_url;
        console.log(this.totalSheetInfo[index], 'this.totalSheetInfo[index]');
        console.log(this.showingType, 'showingType');
        console.log(this.isPdfAvailable, 'isPdfAvailable');
        console.log(this.blink, 'blink');
        this.sheetInfo = [...this.totalSheetInfo[index]];
        console.log(this.areaInfo, 'areaInfo');
        console.log(this.sheetInfo, 'sheet')
        this.showType('2');
    }

    showType(id) {
        this.showingType = id;
        if (id == '1') {
            this.buttonName = 'Assignments and uploads';
        } else if (id == '2') {
            this.buttonName = 'Answer sheet';
        } else if (id == '3') {
            this.buttonName = 'Show PDF';
        }
        this.showCorrectPdf();
    }

    showCorrectPdf() {
        if ((this.showingType == '1' || this.showingType == '2') && this.showPDFAnswer) {
            this.deleteAnnatation = true;
            setTimeout(() => {
                this.blink = true;
            }, 1000);
        } else if (this.showingType == '3' && this.showPDFAnswer) {
            this.deleteAnnatation = false;
        } else if (this.showingType == '3' && !this.showPDFAnswer) {
            this.deleteAnnatation = false;
        } else if ((this.showingType == '1' || this.showingType == '2') && !this.showPDFAnswer) {
            this.deleteAnnatation = false;
            setTimeout(() => {
                this.blink = true;
            }, 1000);
        }
    }

    back() {
        if (this.showstudentContentlist) {
            this.route.navigate(['/student-content/list-content/old']);
        } else {
            const datum = JSON.parse(this.auth.getSessionData('rista-correctionDetail'));
            this.pageType = 1;
            this.studentsDetails(datum, 0);
        }
        this.sectionFilterVal = 'all';
        clearInterval(this.interval);
    }

    filterQues(event) {
        this.questionFilter = event.target.value;
        if (event.target.value == 'all') {
            if (this.correctPdfPath?.length == 0) {
                this.totalAns.forEach((item) => {
                    item.isShow = true;
                });
            } else {
                console.log('pdf type');
                this.totalAns.forEach((value) => {
                    value.section.forEach((item) => {
                        item.isShow = true;
                    });
                });
            }
        } else if (event.target.value == 'correct') {
            if (this.correctPdfPath?.length == 0) {
                this.totalAns.forEach((item) => {
                    if (item.given_points != '0') {
                        item.isShow = true;
                    } else {
                        item.isShow = false;
                    }
                });
            } else {
                console.log('pdf type');
                this.correctFilter();
            }
            console.log(this.totalAns, 'totalAns');
        } else if (event.target.value == 'wrong') {
            if (this.correctPdfPath?.length == 0) {
                this.totalAns.forEach((item) => {
                    if (item.given_points == '0') {
                        item.isShow = true;
                    } else {
                        item.isShow = false;
                    }
                });
            } else {
                console.log('pdf type');
                this.wrongFilter();
            }
        }
    }

    correctFilter() {
        this.totalAns.forEach((value, index) => {
            let len = 0;
            value.section.forEach((item) => {
                if (item.given_points != '0') {
                    len += 1;
                    item.isShow = true;
                } else {
                    item.isShow = false;
                }
            });
            if (len < 3 && this.totalAns.length < this.totalAnsSample.length && index == (this.totalAns.length - 1) && this.sectionFilterVal == 'all') {
                this.page += 1;
                this.totalAns.push(this.totalAnsSample[this.page]);
                this.correctFilter();
            }
        });
    }

    wrongFilter() {
        this.totalAns.forEach((value, index) => {
            let len = 0;
            value.section.forEach((item) => {
                if (item.given_points == '0') {
                    len += 1;
                    item.isShow = true;
                } else {
                    item.isShow = false;
                }
            });
            if (len < 3 && this.totalAns.length < this.totalAnsSample.length && index == (this.totalAns.length - 1) && this.sectionFilterVal == 'all') {
                this.page += 1;
                this.totalAns.push(this.totalAnsSample[this.page]);
                this.wrongFilter();
            }
        });
    }

    openRoughArea() {
        this.roughArea = !this.roughArea;
    }

    openWorkArea(item) {
        this.workAnnotate = [...item.workarea];
        this.workAnnotatePage = 0;
        if (this.workAnnotate.length != 0) {
            this.workAnnotate.forEach((val) => {
                if (val.pageNumber > this.workAnnotatePage) {
                    this.workAnnotatePage = val.pageNumber;
                }
            });
            this.jsPDF = new jsPDF();
            for (let i = 0; i < this.workAnnotatePage - 1; i++) {
                this.jsPDF.addPage();
            }
            this.workAnnotatePDF = this.jsPDF.output('datauristring');
            console.log(this.workAnnotatePDF, 'this.workAnnotatePDF');
        }
        this.modalRef = this.modalService.open(this.workArea, {size: 'xl', backdrop: 'static'});
    }

    showAnswerSheet() {
        this.answerSheet = !this.answerSheet;
        this.showpdf = true;
        this.buttonName = 'Hide PDF';
    }

    getSheetInfo(event) {
        this.sheetInfo = event;
        this.totalSheetInfo[this.sheetIndex] = this.sheetInfo;
        this.saveAnswerAnnotation();
    }

    openStudentFeedback() {
        this.showfeed = !this.showfeed;
    }

    moveToPendingAlert(value) {
        this.pendingCall = value;
        this.resetAnswer = false;
        this.modalRef = this.modalService.open(this.deleteAlert);
    }

    moveToPending() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.pendingCall != '' ? this.pendingCall.student_id : this.studentAnswer.student_id,
            student_content_id: this.pendingCall != '' ? this.pendingCall.student_content_id : this.studentAnswer.student_content_id,
            content_id: this.classData.content_id,
            class_id: this.classData.class_id,
            reset_answer: this.resetAnswer == true ? '1' : '0',
            teacher_feedback: this.pendingCall == '' ? this.totalFeedBack : this.pendingCall.teacher_feedback
        };
        this.teacher.changeToPending(data).subscribe((successData) => {
                this.moveToPendingSuccess(successData);
            },
            (error) => {
                this.moveToPendingFailure(error);
            });
    }

    moveToPendingSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject);
            this.close();
            clearInterval(this.interval);
            if (this.showstudentContentlist) {
                this.route.navigate(['/student-content/list-content/old']);
            } else {
                this.pageType = 1;
                this.studentsDetails(this.classData, 0);
            }
        }
    }

    moveToPendingFailure(error) {
        console.log(error);
    }

    resetStudentAns(event) {
        this.resetAnswer = event.target.checked;
    }

    matchcase(val, match) {
        let value;
        if (val != '' && val != undefined && val != 'undefined' && val != null) {
            if (match) {
                value = val.trim();
            } else {
                value = val.trim().toLowerCase().split(' ').join('');
            }
        } else {
            value = val;
        }
        return value;
    }

    clickEvent() {
        if (!this.mathDelayer) {
            this.mathDelayer = true;
            setTimeout(() => {
                document.getElementById('myDiv').click();
            }, 1000);
        }
        setTimeout(() => {
            this.mathDelayer = false;
        }, 1500);
    }

    parseVal(val) {
        if (val != '' && val != null) {
            let graph = parse(val);
            return graph;
        } else {
            let graph = false;
            return graph;
        }
    }

    listView(id) {
        this.gridView = id;
        this.showGrid = id == 1;
    }

    studentsDetails(val, id) {
        this.auth.setSessionData('rista-correctionDetail', JSON.stringify(val));
        this.studentListHighlight = id;
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: val.content_id,
            content_format: val.content_format,
            class_id: val.class_id,
            type: id,
            class_content_id: val.class_content_id
        };
        this.teacher.studentList(data).subscribe((successData) => {
                this.detailsSuccess(successData, data);
            },
            (error) => {
                this.detailsFailure(error);
            });
    }

    detailsSuccess(successData, data) {
        if (successData.IsSuccess) {
            this.correctionStudentList = [];
            this.studentList = successData.ResponseObject;
            this.studentList.forEach((item) => {
                item.checked = false;
            });
            for (let i = 0; i < this.studentList.length; i++) {
                if (this.studentList[i].status != '1') {
                    this.correctionStudentList.push(this.studentList[i]);
                }
            }
            if (this.pageType == 1) {
                $('#selectAll').prop('checked', false);
                $('#selectAllAlt').prop('checked', false);
                // sse client service call //
                this.subs.forEach((item) => {
                    item.unsubscribe();
                });
                this.sseClientService(data);
            }
        }
    }

    sseClientService(bodyValue) {
        const sseUrl = 'teacher/teacherassignStudentPrint';
        this.subs.push(this.sseClient.stream(sseUrl, {
            keepAlive: true, reconnectionDelay: 3_000,
            responseType: 'event'
        }, {body: bodyValue}, 'POST').subscribe((event) => {
            if (event.type === 'error') {
                const errorEvent = event as ErrorEvent;
                console.error(errorEvent, errorEvent.message);
            } else {
                const messageEvent = event as MessageEvent;
                console.log(typeof messageEvent.data, 'SSE client called');
                this.studentReportDetailsSSESuccess(messageEvent.data === 'No Records found' ? messageEvent.data : JSON.parse(messageEvent.data));
            }
        }));
    }

    studentReportDetailsSSESuccess(successData) {
        this.correctionStudentList = [];
        const updatedStudentList = successData;
        updatedStudentList.forEach((item, index) => {
            item.checked = this.studentList[index].checked;
        });
        this.studentList = [...updatedStudentList];
        for (let i = 0; i < this.studentList.length; i++) {
            if (this.studentList[i].status != '1') {
                this.correctionStudentList.push(this.studentList[i]);
            }
        }
    }

    detailsFailure(error) {
        console.log(error, 'error');
    }

    studentsData() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: this.classData.class_id,
            content_id: this.classData.content_id
        };
        this.teacher.studentData(data).subscribe((successData) => {
                this.dataSuccess(successData);
            },
            (error) => {
                this.dataFailure(error);
            });
    }

    dataSuccess(successData) {
        if (successData.IsSuccess) {
            this.studentData = successData.ResponseObject;
        }
    }

    dataFailure(error) {
        console.log(error, 'error');
    }

    studentsAnswerList(id, status) {
        this.functionCalled = false;
        this.scoreStatus = status;
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.classData.content_id,
            content_format: this.classData.content_format,
            class_id: this.classData.class_id,
            student_id: id.student_id,
            student_content_id: id.student_content_id
        };
        this.teacher.studentAnswerList(data).subscribe((successData) => {
                this.answerListSuccess(successData, id);
            },
            (error) => {
                this.answerListFailure(error);
            });
    }

    answerListSuccess(successData, id) {
        if (successData.IsSuccess) {
            this.subs.forEach((val) => {
                val.unsubscribe();
            });
            //// sidenav closes///
            // this.openmenu = true;
            // this.creator.changeViewList(this.openmenu);
            // this.navServices.collapseSidebar = true;
            //// sidenav closes///

            this.studentAnswer = successData.ResponseObject;
            this.studentAnswer['student_content_id'] = id.student_content_id;
            this.studentName = this.studentAnswer.student_name;
            this.totalAns = [];
            this.areaInfo = [];
            let pdfpath: any;
            pdfpath = this.common.convertBase64(this.studentAnswer?.file_path);
            this.correctPdfPath = this.common.convertBase64(this.studentAnswer?.file_path);
            this.uploadAnswerPath = this.common.convertBase64(this.studentAnswer.upload_answer);
            if (this.studentAnswer.answer_sheet_annotation.length === 0) {
                this.totalSheetInfo = [];
                this.uploadAnswerPath.forEach((item) => this.totalSheetInfo.push([]));
                console.log(this.totalSheetInfo, 'totalSheetInfototalSheetInfo');
            } else {
                this.totalSheetInfo = this.studentAnswer.answer_sheet_annotation;
            }
            console.log(this.totalSheetInfo, 'totalSheetInfototalSheetInfototalSheetInfototalSheetInfo')
            this.answerSheetPath = this.webhost + '/' + this.uploadAnswerPath[0]?.original_image_url;
            this.correctAnswerKeyPath = this.common.convertBase64(this.studentAnswer.answerkey_path);
            if (pdfpath.length != 0) {
                this.studentAnswer.annotation.forEach((item) => {
                    item.isTeacherCorrection = false;
                });
                this.studentAnswer.student_annotation.forEach((item) => {
                    item.isTeacherCorrection = false;
                });
                this.areaInfo = [...this.studentAnswer.student_annotation,
                    ...this.studentAnswer.teacher_annotation, ...this.studentAnswer.annotation];
                this.dragQuestion = [...this.studentAnswer.question_annotation];
                if (this.studentAnswer.answer_sheet_annotation.length != 0) {
                    this.sheetInfo = this.studentAnswer.answer_sheet_annotation[0];
                } else {
                    this.sheetInfo = [];
                }
                // this.sheetInfo = this.studentAnswer.answer_sheet_annotation;
                console.log(this.sheetInfo, 'sheetInfo')
                this.pdfpath = pdfpath[0];
                if (pdfpath[0].original_image_url != undefined) {
                    this.common.downloadfilewithbytes(this.webhost + '/' + pdfpath[0]?.original_image_url)
                        .subscribe((filebytes: ArrayBuffer) => {
                            this.pdfTemplate = filebytes;
                            this.functionCalled = true;
                            this.isPdfAvailable = true;
                        });
                } else {
                    this.functionCalled = true;
                    this.isPdfAvailable = false;
                }

                // this.pdfTemplate = this.webhost + '/' + this.pdfpath.original_image_url;
                // this.uploadAnswerPath = this.common.convertBase64(this.studentAnswer.upload_answer);
                this.correctAnswerKeyPath = this.common.convertBase64(this.studentAnswer.answerkey_path);
                // this.common.downloadfilewithbytes(this.webhost + '/' + this.uploadAnswerPath[0]?.original_image_url)
                //     .subscribe((filebytes: ArrayBuffer) => {
                //       this.answerSheetPath = filebytes;
                //     });
                this.anserPdfTemplate = this.webhost + '/' + this.correctAnswerKeyPath[0]?.original_image_url;
                // this.common.downloadfilewithbytes(this.webhost + '/' + this.correctAnswerKeyPath[0]?.original_image_url)
                //     .subscribe((filebytes: ArrayBuffer) => {
                //       this.anserPdfTemplate = filebytes;
                //     });
                if (this.studentAnswer.answers.length != 0) {
                    this.totalPoints = '';
                    this.totalPointsArray = [];
                    this.studentPoints = '';
                    this.totalFeedBack = '';
                    this.totalStudentFeedBack = '';
                    this.studentPointsArray = [];
                    for (let i = 0; i < this.studentAnswer.answers.length; i++) {
                        this.totalAns[i] = {heading: this.studentAnswer.answers[i].heading, section: []};
                        for (let x = 0; x < this.studentAnswer.answers[i].section.length; x++) {
                            for (let j = 0; j < this.studentAnswer.answers[i].section[x].sub_questions.length; j++) {
                                const val = this.studentAnswer.answers[i].section[x].sub_questions[j].match_case == '1';
                                this.studentAnswer.answers[i].section[x].sub_questions[j].match_case = val;
                                /// if auto grade enables ///
                                if (this.studentAnswer.answers[i].section[x].sub_questions[j].auto_grade == '1' && (this.studentAnswer.status == '4' || this.studentAnswer.status == '2')) {
                                    const ans = this.studentAnswer.answers[i].section[x].sub_questions[j].answer;
                                    const student_ans = this.studentAnswer.answers[i].section[x].sub_questions[j].student_answer;
                                    if (this.studentAnswer.answers[i].section[x].sub_questions[j].question_type_id != '54') {
                                        if (this.matchcase(ans, val) == this.matchcase(student_ans, val)) {
                                            this.studentAnswer.answers[i].section[x].sub_questions[j].given_points = this.studentAnswer.answers[i].section[x].sub_questions[j].points;
                                            this.studentAnswer.answers[i].section[x].sub_questions[j].correction_status = '1';
                                        }
                                    } else {
                                        let allCorrect = true;
                                        for (let y = 0; y < ans.length; y++) {
                                            if (this.matchcase(ans[y].value, val) != this.matchcase(student_ans[y], val)) {
                                                allCorrect = false;
                                            }
                                        }
                                        if (allCorrect) {
                                            this.studentAnswer.answers[i].section[x].sub_questions[j].given_points = this.studentAnswer.answers[i].section[x].sub_questions[j].points;
                                            this.studentAnswer.answers[i].section[x].sub_questions[j].correction_status = '1';
                                        }
                                    }
                                    // if (this.studentAnswer.answers[i].section[x].sub_questions[j].question_type_id != '54') {
                                    //   if (ans == student_ans || this.matchcase(ans) == this.matchcase(student_ans)) {
                                    //     this.studentAnswer.answers[i].section[x].sub_questions[j].given_points = this.studentAnswer.answers[i].section[x].sub_questions[j].points;
                                    //   }
                                    // }
                                }
                                // auto grading ends //
                                this.totalPointsArray.push({point: parseFloat(this.studentAnswer.answers[i].section[x].sub_questions[j].points)});
                                this.studentPointsArray.push({point: parseFloat(this.studentAnswer.answers[i].section[x].sub_questions[j].given_points)});
                                this.totalAns[i].section.push(this.studentAnswer.answers[i].section[x].sub_questions[j]);
                            }
                        }
                        this.totalAns[i].section.forEach((item) => {
                            item.maxValErr = false;
                            item.isShow = true;
                        });
                        this.totalFeedBack = this.studentAnswer.feedback;
                        this.totalStudentFeedBack = this.studentAnswer.student_feedback;
                        if (this.studentAnswer.status == '2' || this.studentAnswer.status == '4') {
                            this.totalPoints = this.totalPointsArray.reduce((acc, value) => acc += value.point, 0);
                            this.studentPoints = this.studentPointsArray.reduce((acc, value) => acc += value.point, 0);
                        } else {
                            this.totalPoints = this.studentAnswer.points;
                            this.studentPoints = this.studentAnswer.earned_points;
                        }
                    }
                    this.totalAnsSample = this.totalAns;
                    this.page = 0;
                    this.totalAns = [];
                    this.totalAns.push(this.totalAnsSample[this.page]);
                    if (this.totalAnsSample.length > 1 && this.totalAnsSample[this.page].section.length < 3) {
                        this.page += 1;
                        this.totalAns.push(this.totalAnsSample[this.page]);
                    }
                    if (this.scoreStatus != 2 && this.scoreStatus != 3) {
                        this.interval = setInterval(() => {
                            this.saveAnswer(2, 1, false);
                        }, 60000);
                    }
                } else {
                    this.showingType = '1';
                    this.buttonName = 'Assignments and uploads';
                    this.studentPoints = this.studentAnswer.earned_points;
                    this.totalPoints = this.studentAnswer.points;
                    this.totalFeedBack = this.studentAnswer.feedback;
                    this.totalStudentFeedBack = this.studentAnswer.student_feedback;
                }
                this.pageType = 2;
                if (this.pageType == 2) {
                    this.clickEvent();
                    this.filterForm.controls.studentlist.patchValue(this.studentAnswer.student_id);
                }
                // console.log(this.areaInfo[2]?.rectangleId, 'afterLOaded');
                // console.log(this.areaInfo, 'afterLOaded');
            } else {
                this.totalAns = this.studentAnswer.answers;
                this.totalAnsSample = this.studentAnswer.answers;
                this.pageType = 2;
                console.log(this.studentAnswer.status, 'status');
                if (this.studentAnswer.status == '4' || this.studentAnswer.status == '2' || this.studentAnswer.status == '3') {
                    this.autoGradeScratch();
                }
                this.filterForm.controls.studentlist.patchValue(this.studentAnswer.student_id);
                this.totalFeedBack = this.studentAnswer.feedback;
                this.totalStudentFeedBack = this.studentAnswer.student_feedback;
                this.totalPoints = this.totalAns.reduce((acc, value) => acc += parseFloat(value.points), 0);
                this.studentPoints = this.totalAns.reduce((acc, value) => acc += parseFloat(value.given_points), 0);
                this.totalAns.forEach((item) => {
                    item.maxValErr = false;
                    item.isShow = true;
                });
                this.totalAnsSample = this.totalAns;
                setTimeout(() => {
                    for (let i = 0; i < this.totalAns.length; i++) {
                        if (this.totalAns[i].question_type_id == 7) {
                            for (let j = 0; j < this.totalAns[i].heading_option.length; j++) {
                                let index = i;
                                let row = this.totalAns[i].heading_option[j].correctActive;
                                let column = this.totalAns[i].heading_option[j].correctAnswer;
                                let final = index.toString() + row.toString() + column.toString();
                                document.getElementById('chooseMultipass' + final).setAttribute('checked', 'true');
                            }
                        } else if (this.totalAns[i].question_type_id == 9) {
                            for (let j = 0; j < this.totalAns[i].answer.length; j++) {
                                for (let k = 0; k < this.totalAns[i].answer[j].options.length; k++) {
                                    if (this.totalAns[i].answer[j].options[k].selected == 'true') {
                                        document.getElementById(i + 'dropdownCorrect' + j).innerHTML = this.totalAns[i].answer[j].options[k].listOption;
                                    }
                                }
                            }
                            for (let j = 0; j < this.totalAns[i].student_answer.length; j++) {
                                let val = this.totalAns[i].student_answer[j].isSelected;
                                if (val !== '') {
                                    document.getElementById(i + 'dropdownStudent' + j).innerHTML = this.totalAns[i].answer[j].options[val].listOption;
                                } else {
                                    document.getElementById(i + 'dropdownStudent' + j).innerHTML = 'Student Not Answered';
                                }
                            }
                        }
                        if (this.totalAns[i].question_type_id == 24) {
                            for (let j = 0; j < this.totalAns[i].subQuestions.length; j++) {
                                for (let k = 0; k < this.totalAns[i].subQuestions[j].heading_option.length; k++) {
                                    let index1 = i;
                                    let id = j;
                                    let row1 = this.totalAns[i].subQuestions[j].heading_option[k].correctActive;
                                    let column1 = this.totalAns[i].subQuestions[j].heading_option[k].correctAnswer;
                                    let final1 = index1.toString() + id.toString() + row1.toString() + column1.toString();
                                    document.getElementById('chooseMultipass1' + final1)?.setAttribute('checked', 'true');
                                }
                            }
                        }
                    }
                    // this.clickEvent();
                }, 3000);
            }
        }
    }

    answerListFailure(error) {
        console.log(error, 'error');
    }

    checkEnteredAnswer(value) {
        let correctAnswer: any;
        if (value.question_type_id == '1') {
            correctAnswer = value.answer.every((items, index) => {
                return !(items.correctActive == '1' && value.student_answer[index].isSelected == '');
            });
            console.log(correctAnswer, 'coorectAnswer');
            value.given_points = correctAnswer ? value.points : 0;
        } else if (value.question_type_id == '2') {
            correctAnswer = value.answer.every((items, index) => {
                return !((items.correctActive == '1' && value.student_answer[index].isSelected == '') || (items.correctActive == '' && value.student_answer[index].isSelected != ''));
            });
            value.given_points = correctAnswer ? value.points : 0;
        } else if (value.question_type_id == '5') {
            correctAnswer = value.student_answer.every((items, index) => {
                return items.isSelected == value.heading_option[index].correctActive.toString();
            });
            value.given_points = correctAnswer ? value.points : 0;
        } else if (value.question_type_id == '7') {
            let pushArrayValue = [];
            value.student_answer.forEach((item) => {
                const splitedValue = item.isSelected != '' ? item.isSelected.split(',') : [];
                splitedValue.forEach((splitForEach) => {
                    pushArrayValue.push({
                        question: item.options,
                        isSelected: splitForEach
                    });
                });
            });
            const result = pushArrayValue.filter((o1) => {
                return !value.heading_option.some((o2) => {
                    return o1.question == o2.correctOption && o1.isSelected == o2.correctAnswer;
                });
            });
            correctAnswer = pushArrayValue.length == value.heading_option.length && result.length == 0;
            value.given_points = correctAnswer ? value.points : 0;
        } else if (value.question_type_id == '9') {
            correctAnswer = value.student_answer.every((item) => {
                return !(item.isSelected == '' || item.options[item.isSelected].selected != 'true');
            });
            value.given_points = correctAnswer ? value.points : 0;
        } else if (value.question_type_id == '10') {
            correctAnswer = value.student_answer.every((items) => {
                const enteredValue = items.options[0]?.value.trim().toLowerCase().split(' ').join('');
                return !(items.isSelected == '' || enteredValue != items.isSelected.trim().toLowerCase().split(' ').join(''));
            });
            value.given_points = correctAnswer ? value.points : 0;
        } else if (value.question_type_id == '16') {
            correctAnswer = value.answer.every((items, index) => {
                return items.correctAnswer == value.student_answer[index].options;
            });
            value.given_points = correctAnswer ? value.points : 0;

        }
    }

    autoGradeScratch() {
        this.totalAns.forEach((value) => {
            console.log(value, 'value');
            if (value?.audo_grade == '1' && value.question_type_id != '24' &&
                (this.studentAnswer.status == '2' ||
                    ((this.studentAnswer.status == '3' || this.studentAnswer.status == '4') && value.correction_status == '0'))) {
                this.checkEnteredAnswer(value);
                // let correctAnswer: any;
                //   if (value.question_type_id == '1') {
                //       correctAnswer = value.answer.every((items, index) => {
                //         return !(items.correctActive == '1' && value.student_answer[index].isSelected == '');
                //       });
                //       console.log(correctAnswer, 'coorectAnswer');
                //       value.given_points = correctAnswer ? value.points : 0;
                //   }
                //   else if (value.question_type_id == '2') {
                //     correctAnswer = value.answer.every((items, index) => {
                //       return !((items.correctActive == '1' && value.student_answer[index].isSelected == '') || (items.correctActive == '' && value.student_answer[index].isSelected != ''));
                //     });
                //     value.given_points = correctAnswer ? value.points : 0;
                //   }
                //   else if (value.question_type_id == '5') {
                //     correctAnswer = value.student_answer.every((items, index) => {
                //       return items.isSelected == value.heading_option[index].correctActive;
                //     });
                //     value.given_points = correctAnswer ? value.points : 0;
                //   }
                //   else if (value.question_type_id == '7') {
                //     let pushArrayValue = [];
                //     value.student_answer.forEach((item) => {
                //       const splitedValue = item.isSelected != '' ? item.isSelected.split(',') : [];
                //       splitedValue.forEach((splitForEach) => {
                //         pushArrayValue.push({
                //           question : item.options,
                //           isSelected: splitForEach
                //         });
                //       });
                //     });
                //     const result = pushArrayValue.filter((o1) => {
                //       return !value.heading_option.some((o2) => {
                //         return o1.question == o2.correctOption && o1.isSelected == o2.correctAnswer;
                //       });
                //     });
                //     correctAnswer = pushArrayValue.length == value.heading_option.length && result.length == 0;
                //     value.given_points = correctAnswer ? value.points : 0;
                //   }
                //   else if (value.question_type_id == '9') {
                //     correctAnswer = value.student_answer.every((item) => {
                //       return !(item.isSelected == '' || item.options[item.isSelected].selected != 'true');
                //     });
                //     value.given_points = correctAnswer ? value.points : 0;
                //   }
                //   else if (value.question_type_id == '10') {
                //     correctAnswer = value.student_answer.every((items) => {
                //       const enteredValue = items.options[0]?.value.trim().toLowerCase().split(' ').join('');
                //       return !(items.isSelected == '' || enteredValue != items.isSelected.trim().toLowerCase().split(' ').join(''));
                //     });
                //     value.given_points = correctAnswer ? value.points : 0;
                //   }
                //   else if (value.question_type_id == '16') {
                //     correctAnswer = value.answer.every((items, index) => {
                //       return items.correctAnswer == value.student_answer[index].options;
                //     });
                //     value.given_points = correctAnswer ? value.points : 0;
                //
                //   }
            } else if (value.question_type_id == '24') {
                value.subQuestions.forEach((sub) => {
                    if (sub?.audo_grade == '1' && (this.studentAnswer.status == '2' ||
                        ((this.studentAnswer.status == '3' || this.studentAnswer.status == '4') && value.correction_status == '0'))) {
                        this.checkEnteredAnswer(sub);
                        // if (sub.question_type_id == '1') {
                        //     sub.answer.forEach((item, index) => {
                        //         if (item.correctActive !== '' && sub.student_answer[index].isSelected !== '') {
                        //             sub.given_points = sub.points;
                        //         }
                        //     });
                        // }
                        // else if (sub.question_type_id == '2') {
                        //     let correct = true;
                        //     sub.answer.forEach((item, index) => {
                        //         if (item.correctActive !== '' && sub.student_answer[index].isSelected == '') {
                        //             correct = false;
                        //         } else if (item.correctActive === '' && sub.student_answer[index].isSelected != '') {
                        //             correct = false;
                        //         }
                        //     });
                        //     if (correct) {
                        //         sub.given_points = sub.points;
                        //     }
                        // }
                        // else if (sub.question_type_id == '5') {
                        //     let correct = true;
                        //     sub.heading_option.every((item, index) => {
                        //         if (item.correctActive.toString() !== sub.student_answer[index].isSelected || sub.student_answer[index].isSelected === '') {
                        //             correct = false;
                        //         }
                        //     });
                        //     if (correct) {
                        //         sub.given_points = sub.points;
                        //     }
                        // }
                        // else if (sub.question_type_id == '7') {
                        //     let correct = true;
                        //     sub.student_answer.forEach((ans) => {
                        //         let split = ans.isSelected.split(',');
                        //         console.log(split, 'split');
                        //         let count = 0;
                        //         sub.heading_option.forEach((item) => {
                        //             if (item.correctOption == ans.options) {
                        //                 count += 1;
                        //                 let got = false;
                        //                 split.forEach((val) => {
                        //                     if (val == item.correctAnswer) {
                        //                         got = true;
                        //                     }
                        //                 });
                        //                 if (!got) {
                        //                     correct = false;
                        //                 }
                        //             }
                        //         });
                        //         if (count != split.length) {
                        //             correct = false;
                        //         }
                        //     });
                        //     if (correct) {
                        //         sub.given_points = sub.points;
                        //     }
                        // }
                        // else if (sub.question_type_id == '10') {
                        //     let correct = true;
                        //     sub.student_answer.forEach((item) => {
                        //         item.options.forEach((val, index) => {
                        //             console.log(item.isSelected, 'select', index);
                        //             if (this.matchcase(val.value, false) != this.matchcase(item.isSelected, false)) {
                        //                 correct = false;
                        //             }
                        //         });
                        //     });
                        //     if (correct) {
                        //         sub.given_points = sub.points;
                        //     }
                        // }
                    }
                });
                value.given_points = value.subQuestions.reduce((acc, val) => acc += parseFloat(val.given_points), 0);
            }
        });
    }

    onScrollDown(event) {
        if ((this.page + 1) < this.totalAnsSample.length && this.sectionFilterVal == 'all') {
            this.page += 1;
            this.totalAns.push(this.totalAnsSample[this.page]);
            this.answerFiter();
            this.clickEvent();
        }
    }

    answerFiter() {
        this.totalAns.forEach((item) => {
            if (this.questionFilter == 'correct') {
                item.section.forEach((value) => {
                    if (value.points == value.given_points) {
                        value.isShow = true;
                    } else {
                        value.isShow = false;
                    }
                });
            } else if (this.questionFilter == 'wrong') {
                item.section.forEach((value) => {
                    if (value.points != value.given_points) {
                        value.isShow = true;
                    } else {
                        value.isShow = false;
                    }
                });
            } else {
                item.section.forEach((value) => {
                    value.isShow = true;
                });
            }
        });
    }

    onPageChange(data) {
        this.page = data;
        this.studentsAnswerList(this.classData, this.classData.status);
        window.scrollTo(0, 0);
        this.clickEvent();
        // this.save
        // this.saveAnswer('2', 'noExit');
    }

    async saveAnswer(id, type, loader) {
        if (loader) {
            this.commondata.showLoader(true);
        }
        let pdfpath: any;
        let filterArr: any = [];
        pdfpath = this.common.convertBase64(this.studentAnswer.file_path);
        if (pdfpath.length == 1 && this.totalAnsSample.length != 0 && this.sectionFilterVal == 'all') {
            for (let i = 0; i < this.totalAns.length; i++) {
                this.totalAnsSample[i] = this.totalAns[i];
            }
        }
        // this.areaInfo = this.areaInfo.filter(value => value.isTeacherCorrection == true);
        this.invalidData = false;
        this.dataMissing = false;
        this.invalidScore = false;
        if (parseInt(this.studentPoints) > parseInt(this.totalPoints)) {
            this.invalidScore = true;
        }
        let contentFormat = 1;
        if (type != 3 && type != 4) {
            if (pdfpath.length == 1) {
                contentFormat = 1;
                for (let i = 0; i < this.studentAnswer.answers.length; i++) {
                    for (let x = 0; x < this.studentAnswer.answers[i].section.length; x++) {
                        for (let j = 0; j < this.studentAnswer.answers[i].section[x].sub_questions.length; j++) {
                            const ans = this.studentAnswer.answers[i].section[x].sub_questions[j];
                            for (let k = 0; k < this.totalAnsSample[i].section.length; k++) {
                                if (this.totalAnsSample[i].section[k].sub_question_no == ans.sub_question_no) {
                                    if (this.totalAnsSample[i].section[k].givenpoints != undefined) {
                                        ans.given_points = this.totalAnsSample[i].section[k].givenpoints;
                                    }
                                    if (this.totalAnsSample[i].section[k].feedback != undefined) {
                                        ans.feedback = this.totalAnsSample[i].section[k].feedback;
                                    }
                                }
                                if (this.totalAnsSample[i].section[k].maxValErr == true) {
                                    this.invalidData = true;
                                }
                                // if (this.totalAnsSample[i].section[k].correction_status) {
                                //     // let status = this.totalAnsSample[i].section[k].correction_status;
                                //     ans.correction_status = this.totalAnsSample[i].section[k].correction_status;
                                // }
                                // if (this.studentAnswer.answers[i].section[x].sub_questions[j].given_points == undefined || this.studentAnswer.answers[i].section[x].sub_questions[j].given_points == '') {
                                //   this.dataMissing = true;
                                // }
                            }
                        }
                    }
                }

                filterArr = parse(stringify(this.studentAnswer.answers));

                filterArr = filterArr.filter((val) => {
                    val.section = val.section.filter((item) => {
                        item.sub_questions = item.sub_questions.filter((sub) => {
                            if (sub.correction_status == '1') {
                                sub.correction_status = '2';
                                return true;
                            } else {
                                return false;
                            }
                        });
                        return item.sub_questions.length !== 0;
                    });
                    return val.section.length !== 0;
                });
                this.totalAns.forEach((val) => {
                    val.section.forEach((item) => {
                        if (item.correction_status == '1') {
                            item.correction_status = '2';
                        }
                    });
                });
                console.log(filterArr, 'filtered array');
                console.log(this.studentAnswer.answers, 'studentAnswer.answers array');
                if (filterArr.length == 0 && !loader && contentFormat != 3) {
                    return false;
                }
            } else if (pdfpath.length == 0) {
                contentFormat = 3;
                this.studentAnswer.answers = this.totalAns;
                for (let i = 0; i < this.studentAnswer.answers.length; i++) {
                    console.log(this.studentAnswer.answers[i].given_points, 'this.studentAnswer.answers[i].given_points');
                    if (this.studentAnswer.answers[i].given_points === '') {
                        this.dataMissing = true;
                    }
                    if (this.studentAnswer.answers[i].maxValErr == true) {
                        this.dataMissing = true;
                    }
                }
            }
        }
        if (((!this.invalidData && !this.dataMissing && !this.invalidScore) || id == 2) && (type != 3 && type != 4)) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                student_id: this.studentAnswer.student_id,
                content_id: this.studentAnswer.content_id,
                student_content_id: this.studentAnswer.student_content_id,
                content_format: contentFormat,
                class_id: this.classData.class_id,
                type: id,
                answers: contentFormat == 3 ? this.studentAnswer.answers : filterArr,
                points: this.totalPoints,
                feedback: this.totalFeedBack,
                earned_points: this.studentPoints,
            };
            this.teacher.saveCorrection(data).subscribe((successData) => {
                    this.correctionSuccess(successData, data, type, loader, pdfpath);
                },
                (error) => {
                    this.correctionFailure(error);
                });
        } else if (type == 3 || type == 4) {
            if (!this.invalidScore) {
                const data = {
                    platform: 'web',
                    role_id: this.auth.getSessionData('rista-roleid'),
                    user_id: this.auth.getSessionData('rista-userid'),
                    student_id: this.studentAnswer.student_id,
                    content_id: this.studentAnswer.content_id,
                    student_content_id: this.studentAnswer.student_content_id,
                    class_id: this.classData.class_id,
                    type: id,
                    answers: [],
                    points: this.totalPoints,
                    feedback: this.totalFeedBack,
                    earned_points: this.studentPoints
                };
                this.teacher.saveCorrection(data).subscribe((successData) => {
                        this.correctionSuccess(successData, data, type, loader, pdfpath);
                    },
                    (error) => {
                        this.correctionFailure(error);
                    });
            } else if (loader) {
                this.commondata.showLoader(false);
                if (type == 2 || type == 3) {
                    this.toastr.error('Invalid obtained points', 'Release Score failed');
                } else {
                    this.toastr.error('Invalid obtained points', 'Saving correction failed');
                }
            }
        } else if (this.invalidData == true && loader) {
            this.commondata.showLoader(false);
            if (type == 2 || type == 3) {
                this.toastr.error('Invalid correction', 'Release Score failed');
            } else {
                this.toastr.error('Invalid correction', 'Saving correction failed');
            }
        } else if (this.dataMissing === true && loader) {
            this.commondata.showLoader(false);
            if (type == 2 || type == 3) {
                this.toastr.error('Please correct all the questions', 'Release Score failed');
            } else {
                this.toastr.error('Please correct all the questions', 'Saving correction failed');
            }
        } else if (this.invalidScore) {
            this.commondata.showLoader(false);
            if (type == 2 || type == 3) {
                this.toastr.error('Obtained points must be lesser than Total points', 'Release Score failed');
            } else {
                this.toastr.error('Obtained points must be lesser than Total points', 'Saving correction failed');
            }
        }
    }

    correctionSuccess(successData, data, type, loader, pdfpath) {
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            this.studentList.forEach((item) => {
                if (item.student_id === data.student_id) {
                    item.saved = true;
                }
            });
            if (this.studentAnswer.answers && pdfpath.length == 1) {
                this.studentAnswer.answers.forEach((value) => {
                    value.section.forEach((sec) => {
                        sec.sub_questions.forEach((item) => {
                            if (item.answer_attended == '1') {
                                item.answer_attended = '2';
                            }
                        });
                    });
                });
            }
            if (loader == true) {
                if (type == 2 || type == 3) {
                    this.releaseScore();
                } else {
                    this.toastr.success(successData.ResponseObject, 'Saved');
                }
                if (this.showstudentContentlist) {
                    this.route.navigate(['/student-content/list-content/old']);
                    this.auth.removeSessionData('student-content');
                } else {
                    this.pageType = 1;
                    const datum = JSON.parse(this.auth.getSessionData('rista-correctionDetail'));
                    this.studentsDetails(datum, 0);
                    this.sectionFilterVal = 'all';
                }
                clearInterval(this.interval);
            }
        }
    }

    correctionFailure(error) {
        this.commondata.showLoader(false);
        this.toastr.error(error, 'Failed');
    }

    saveAndRelease(id) {
        this.releaseStudent = [];
        this.releaseStudentContentId = [];
        if (id == 1) {
            this.studentList.forEach((item) => {
                if (item.checked == true) {
                    this.releaseStudent.push(item.student_id);
                    this.releaseStudentContentId.push(item.student_content_id);
                }
            });
            this.releaseScore();
        } else if (id == 2) {
            if (this.totalAns.length < this.totalAnsSample.length) {
                for (let i = 0; i < this.totalAnsSample.length; i++) {
                    if (this.totalAns.length - 1 < i) {
                        this.totalAns.push(this.totalAnsSample[i]);
                    }
                }
            }
            this.saveAnswer(1, id, true);
            this.releaseStudent.push(this.studentAnswer.student_id);
            this.releaseStudentContentId.push(this.studentAnswer.student_content_id);
        } else if (id == 3) {
            this.saveAnswer(1, id, true);
            this.releaseStudent.push(this.studentAnswer.student_id);
            this.releaseStudentContentId.push(this.studentAnswer.student_content_id);
        }
    }

    releaseScore() {
        console.log(this.studentList, 'studentList');
        if (this.releaseStudent.length > 0) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                student_id: this.releaseStudent,
                content_id: this.studentAnswer.content_id,
                student_content_id: this.releaseStudentContentId,
                class_id: this.classData.class_id,
                release_score: '1'
            };
            this.teacher.releaseScore(data).subscribe((successData) => {
                    this.releaseScoreSuccess(successData);
                },
                (error) => {
                    this.releaseScoreFailure(error);
                });
        } else {
            this.toastr.error('Select atleast one student');
        }
    }

    releaseScoreSuccess(successData) {
        if (successData.IsSuccess) {
            const datum = JSON.parse(this.auth.getSessionData('rista-correctionDetail'));
            if (this.pageType) {
                this.studentsDetails(datum, 0);
                this.toastr.success(successData.ResponseObject, 'Score released');
            }
        }
    }

    releaseScoreFailure(error) {
        this.toastr.error(error, 'Failed');
    }

    saveCorrectionAnnotation() {
        console.log(this.studentAnswer, 'this.studentAnswer');
        console.log(this.classData, 'this.classData');
        const val = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.studentAnswer.school_id,
            content_id: this.studentAnswer.content_id,
            class_id: this.classData.class_id,
            student_id: this.studentAnswer.student_id,
            student_content_id: this.studentAnswer.student_content_id,
            annotation: this.areaInfo,
            type: '1'
        };
        this.teacher.saveTeacherCorrectionAnnotation(val).subscribe((successData) => {
                this.AnnotateSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    AnnotateSuccess(successData) {
        if (successData.IsSuccess) {
            console.log(successData.isSuccess);
        }
    }

    saveAnswerAnnotation() {
        const val = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.studentAnswer.school_id,
            content_id: this.studentAnswer.content_id,
            class_id: this.classData.class_id,
            student_content_id: this.studentAnswer.student_content_id,
            student_id: this.studentAnswer.student_id,
            answer_sheet_annotation: this.totalSheetInfo,
        };
        this.teacher.saveAnswerSheetAnnotation(val).subscribe((successData) => {
                this.answerSheetSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    answerSheetSuccess(successData) {
        if (successData.IsSuccess) {
            console.log(successData.isSuccess);
        }
    }

    /// number validation///

    numberValidate(event) {
        this.validationService.numberValidate(event);
    }

    markValidation(event, high, i, j, type) {
        let val = parseFloat(event.target.value);
        let pt = parseFloat(high);
        if (val > pt) {
            if (type == 'scratch') {
                this.totalAns[i].maxValErr = true;
            } else if (type == 'passage') {
                this.totalAns[i].subQuestions[j].maxValErr = true;
            } else {
                this.totalAns[i].section[j].maxValErr = true;
            }
        } else {
            if (type == 'scratch') {
                this.totalAns[i].maxValErr = false;
            } else if (type == 'passage') {
                this.totalAns[i].subQuestions[j].maxValErr = false;
            } else {
                this.totalAns[i].section[j].maxValErr = false;
            }
        }
    }

    listSelect(event, id) {
        this.studentList[id].checked = !event;
    }

    deSelect(event) {
        if (event.target.checked) {
            this.studentList.forEach((item) => {
                if (item.status == 5 || item.status == 3) {
                    item.checked = true;
                }
            });
        } else {
            this.studentList.forEach((item) => {
                item.checked = false;
            });
        }

    }

    sectionFilter(event) {
        const scroll = document.getElementById('scrollinnnersection');
        scroll.scrollTo(0, 0);
        if (event.target.value == 'all') {
            this.page = 0;
            this.totalAns = [];
            if (this.totalAnsSample.length > 2) {
                for (let i = 0; i < 3; i++) {
                    this.page = i;
                    this.totalAns.push(this.totalAnsSample[this.page]);
                }
            } else {
                this.totalAns = [...this.totalAnsSample];
            }
            // this.totalAns.push(this.totalAnsSample[this.page]);
            // if (this.totalAnsSample.length > 1 && this.totalAnsSample[this.page].section.length < 3) {
            //   this.page += 1;
            //   this.totalAns.push(this.totalAnsSample[this.page]);
            // }
        } else {
            this.totalAns = [this.totalAnsSample[parseInt(event.target.value)]];
        }
        this.answerFiter();
    }

    givePoints(val, item, type, index, id) {
        item.correction_status = '1';
        console.log(item, 'correction');
        if (val == 'true') {
            item.given_points = item.points;
        } else {
            item.given_points = 0;
        }
        if (type == 'scratch') {
            item.correction_status = '2';
            this.studentPoints = this.totalAns.reduce((acc, value) => acc += parseFloat(value.given_points), 0);
        } else if (type == 'pdf') {
            let count = 0;
            console.log(this.totalAns, 'totalAns');
            for (let i = 0; i < this.totalAns.length; i++) {
                for (let j = 0; j < this.totalAns[i].section.length; j++) {
                    count += 1;
                    if (index == i && id == j) {
                        console.log(this.studentPointsArray[count - 1], 'enter studentIndex');
                        this.studentPointsArray[count - 1].point = parseFloat(item.given_points);
                    }
                }
            }
            this.studentPoints = this.studentPointsArray.reduce((acc, value) => acc += value.point, 0);
        } else {
            item.correction_status = '2';
            this.totalAns[index].given_points = this.totalAns[index].subQuestions.reduce((acc, value) => acc += parseFloat(value.given_points), 0);
            this.studentPoints = this.totalAns.reduce((acc, value) => acc += parseFloat(value.given_points), 0);
        }
    }

    getPoints(event, index, id, type) {
        if (type == 'scratch') {
            if (event.target.value != '') {
                this.totalAns[index].correction_status = '2';
                this.totalAns[index].given_points = parseFloat(event.target.value);
                this.studentPoints = this.totalAns.reduce((acc, value) => acc += parseFloat(value.given_points), 0);
            }
        } else if (type == 'passage') {
            if (event.target.value != '') {
                this.totalAns[index].correction_status = '2';
                this.totalAns[index].subQuestions[id].given_points = parseFloat(event.target.value);
                this.totalAns[index].given_points = this.totalAns[index].subQuestions.reduce((acc, value) => acc += parseFloat(value.given_points), 0);
                this.studentPoints = this.totalAns.reduce((acc, value) => acc += parseFloat(value.given_points), 0);
            }
        } else {
            if (event.target.value != '') {
                this.totalAns[index].section[id].givenpoints = event.target.value;
                this.totalAns[index].section[id].correction_status = '1';
                let count = 0;
                for (let i = 0; i < this.totalAns.length; i++) {
                    for (let j = 0; j < this.totalAns[i].section.length; j++) {
                        count += 1;
                        if (index == i && id == j) {
                            this.studentPointsArray[count - 1].point = parseFloat(event.target.value);
                        }
                    }
                }
                this.studentPoints = this.studentPointsArray.reduce((acc, value) => acc += value.point, 0);
            }
        }
    }

    getFeedback(event, i, j) {
        this.totalAns[i].section[j].feedback = event.target.value;
        this.totalAns[i].section[j].correction_status = '1';
    }

    cfsGetFeedback(event, i) {
        this.totalAns[i].feedback = event.target.value;
    }

    cfsGetPassageFeedback(event, i, j) {
        this.totalAns[i].subQuestions[j].feedback = event.target.value;
    }

    getDelete(event) {
        this.deleteAnnatation = event;
    }

    getAnnotation(event) {
        this.areaInfo = event;
        this.saveCorrectionAnnotation();
        let other = [...this.studentAnswer.annotation, ...this.studentAnswer.student_annotation];
        other.forEach((item) => {
            item.isTeacherCorrection = false;
        });
        this.areaInfo = [...this.areaInfo, ...other];
    }

    pdfshow() {
        this.showpdf = !this.showpdf;
        if (this.showpdf == true) {
            this.buttonName = 'Hide PDF';
        } else {
            this.buttonName = 'Show PDF';
            this.answerSheet = false;
        }
    }

    splitMultiChoose(val, index) {
        if (val != '') {
            val = val.toString();
            let value = val.split(',');
            for (let i = 0; i < value.length; i++) {
                if (value[i] == index) {
                    return true;
                }
            }
        } else {
            return false;
        }

    }

    close() {
        this.modalRef.close();
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

interface Position {
    x: number;
    y: number;
}

interface Rectangle {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    d: string;
    text: any;
    width: number;
    height: number;
}

interface AreaInfo {
    rectangleId: string;
    pageNumber: number;
    rect: Rectangle;
    isDelete?: boolean;
    isTeacherCorrection?: boolean;
    shape: string;
    color: any;
    fontSize: any;
}
