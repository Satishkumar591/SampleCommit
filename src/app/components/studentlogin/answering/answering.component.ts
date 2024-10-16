import {
    Component,
    OnInit,
    AfterContentInit,
    ViewChild,
    TemplateRef,
    forwardRef,
    ChangeDetectorRef, AfterViewInit, ElementRef
} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {StudentService} from '../../../shared/service/student.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {CreatorService} from '../../../shared/service/creator.service';
import {NavService} from '../../../shared/service/nav.service';
import {parse, stringify} from 'flatted';
import {ToastrService} from 'ngx-toastr';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {TeacherService} from '../../../shared/service/teacher.service';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {CanvasWhiteboardComponent} from 'ng2-canvas-whiteboard';
import {jsPDF} from 'jspdf';
import {EnvironmentService} from '../../../environment.service';
// import {debounce} from 'rxjs/operators';
import { debounce } from 'lodash';

export interface TimeSpan {
    hours: number;
    minutes: number;
    seconds: number;
}

@Component({
    selector: 'app-answering',
    templateUrl: './answering.component.html',
    styleUrls: ['./answering.component.scss'],
    viewProviders: [CanvasWhiteboardComponent],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AnsweringComponent),
        multi: true,
    }],
})
export class AnsweringComponent implements OnInit, AfterContentInit, AfterViewInit {

    constructor(public auth: AuthService, public student: StudentService, public confi: ConfigurationService, public sanitizer: DomSanitizer, private modalService: NgbModal,
                public route: Router, public creator: CreatorService, public navServices: NavService, public toastr: ToastrService, public teacher: TeacherService,
                public common: CommonService,
                public cdr: ChangeDetectorRef, public env: EnvironmentService,
                public commondata: CommonDataService,
                public newSubject: NewsubjectService, public router: ActivatedRoute) {
        this.getData = JSON.parse(this.auth.getSessionData('rista-classDetails'));
        console.log(this.getData, 'getData');
        this.webhost = this.confi.getimgUrl();
        // try{
        //     this.questionListSuccess(this.router.snapshot.data['list']);
        // }catch (e) {
        //     console.log(e ,'ee');
        // }
        this.questionList();
        this.button = 'Hide PDF';
        // this.signaturePad.clear();
        this.delAnnotation = false;
        this.answerPatch = false;
        this.queries = '';
        this.queriesIndex = '';
    }

    // pdConfig = {
    //     multiple: true,
    //     formatsAllowed: '.pdf',
    //     uploadAPI:  {
    //         url: this.confi.getHost() + 'common/fileUpload',
    //         body: {
    //             platform: 'web',
    //             role_id: this.auth.getSessionData('rista-roleid'),
    //             user_id: this.auth.getSessionData('rista-userid'),
    //         },
    //         method: 'POST',
    //         headers: {
    //             "Content-Type" : 'text/plain; charset=UTF-8',
    //             "Authorization" : `Bearer ${this.auth.getAccessToken()}`,
    //         },
    //     },
    //     hideProgressBar: false,
    //     hideResetBtn: true,
    //     selectFileBtn: true,
    //     fileNameIndex: true,
    //     _fileInputView: true,
    //     replaceTexts: {
    //         selectFileBtn: 'Select Files',
    //         resetBtn: 'Reset',
    //         uploadBtn: 'Upload',
    //         attachPinBtn: 'Attach Files...',
    //         afterUploadMsg_success: 'Successfully Uploaded !',
    //         afterUploadMsg_error: 'Upload Failed !',
    //         sizeLimit: 'Size Limit'
    //     }
    // };
    areaInfo: AreaInfo[] = [];
    public contentType: any;
    public questionData: any;
    public questionData1: any;
    public getData: any;
    public webhost: any;
    public pdfTemplate: any;
    public button: any;
    public totalFeedBack: any;
    public samplePdf: any;
    public graphBoardValue: any;
    public settingList = [];
    public workAnnotate = [];
    public getGraph: any;
    public allowAutoScroll: any = true;
    public showAutoScroll: any = false;
    public expandPdf: any = false;
    public graphAnswerVal: any;
    public graphEditorAns: any = '';
    public uploadFileSize: any = 0;
    public workAreaId: any = 0;
    public workAreaIndex: any = 0;
    public writtingPadHeight: any = 700;
    public graphFeedback = '';
    public graphEditorAnsDup: any;
    public sigPadData: any;
    public jsPDF: jsPDF;
    public graphId: any;
    public graphIndex: any;
    public scrolledPageNumber: any = 1;
    public queries: any;
    public sectionFilterVal: any = 'all';
    public queriesIndex: any;
    public downloadTemplate: any;
    public downloadTemplateName: any;
    public checkAutoGradeQns = '0';
    public timeReset = false;
    @ViewChild('submitAlert') submitAlert: TemplateRef<any>;
    @ViewChild('answerGraph') answerGraph: TemplateRef<any>;
    @ViewChild('content') link: TemplateRef<any>;
    @ViewChild('workArea') workArea: TemplateRef<any>;
    @ViewChild('scrollContent', {static: false}) scrollContent: ElementRef;
    @ViewChild('rightArrow', {static: false}) rightArrow: ElementRef;
    @ViewChild('leftArrow', {static: false}) leftArrow: ElementRef;
    @ViewChild('feedback') feedback: TemplateRef<any>;
    // @ViewChild(SignaturePad , {static: true}) signaturePad: SignaturePad;

    signaturePad: any;
    public openmenu: boolean;
    public autoScoreRelease: boolean = false;
    public showpdf = true;
    public functionCalled: boolean;
    public delAnnotation: boolean;
    public answerPatch: boolean;
    public pdf: boolean;
    public guard = false;
    public showUploadFile = true;
    public mathDelayer = false;
    public workspacedata: any;
    public totalAns: any = [];
    public totalAnsSample: any = [];
    public answerEditor: any = [];
    public workSpaceEditor: any = [];
    public hideRuleContent = [];
    public hideRuleAnswer = [];
    public pdfPath: any;
    public isPdfAvailable: boolean = true;

    public dragQuestion: any = [];
    public blankAns: any = [];
    public answerPdf: any = [];
    public pageScroll = 0;

    private modalRef: NgbModalRef;
    private modalRef1: NgbModalRef;
    public contentName: any;
    public allowSelect: boolean;
    public linkdata: any = [];
    page = 1;
    public showAnswerItem: any;
    public interval: any;
    public showAnswerI: any;
    public showAnswerJ: any;
    public answerSaving = false;
    public expand = false;
    public expandData20: any;
    public maximumAttempt = 3;
    public correctAnswer = true;
    public signaturePadOptions = { // passed through to szimek/signature_pad constructor
        minWidth: 1,
        maxWidth: 1,
        penColor: '#ce2222',
        canvasWidth: 460,
        canvasHeight: this.writtingPadHeight
    };
    public canvasOptions = {
        drawButtonEnabled: true,
        drawButtonClass: 'drawButtonClass',
        drawButtonText: 'Write',
        clearButtonEnabled: true,
        clearButtonClass: 'clearButtonClass',
        clearButtonText: 'Clear',
        undoButtonText: 'Undo',
        undoButtonEnabled: true,
        redoButtonText: 'Redo',
        redoButtonEnabled: true,
        colorPickerEnabled: true,
        fillColorPickerText: 'Fill',
        strokeColorPickerText: 'Stroke',
        // saveDataButtonEnabled: true,
        // saveDataButtonText: "Save",
        // lineWidth: 2,
        // width: 100,
        strokeColor: 'rgb(0,0,0)',
        shouldDownloadDrawing: true
    };
    @ViewChild('showExpand') showExpand: TemplateRef<any>;
    private distance: number = 150;
    public showQuestion = 0;
    public timeTaken = 0;
    public no_of_correctAnswer = 0;
    public percentage = '0';
    public tryAgainButtonEnabled = false;
    public buttonClicked = '';
    public previouslySelectedIndex = 0;
    public needSaveForThisQns = false;
    public selectedIndexForSameQns = 0;
    public graphEdited = false;
    public overallFullData: any;

    getAreaInfo = debounce(
        (event: any) => {
            this.areaInfo = event;
            const data = {
                platform: 'web',
                student_id: this.auth.getSessionData('rista-userid'),
                annotation: this.areaInfo,
                content_id: this.getData.content_id,
                student_content_id: this.getData.student_content_id,
                class_id: this.getData.class_id,
            };
            this.creator.saveAnnotation(data).subscribe((successData) => {
                    this.saveAnnotationSuccess(successData);
                },
                (error) => {
                    this.saveAnnotationFailure(error);
                });
        }, 1000);

    ngOnInit(): void {
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);
        this.creator.changeViewList(true);
    }

    ngAfterContentInit(): void {
        setTimeout(() => {
            this.answerPatch = true;
        }, 3000);
        // 5 mins 300000
        this.interval = setInterval(() => {
            this.saveAnswer('2', 'noExit', false);
        }, 300000);
    }

    ngAfterViewInit() {
        console.log(this.signaturePad, 'signaturePadsignaturePad');
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy(): void {
        console.log('destroy');
        clearInterval(this.interval);
        this.creator.changeViewList(false);
    }

    showFeedback() {
        this.modalRef = this.modalService.open(this.feedback, {size: 'xl'});
    }

    numOfQuestionAnswered() {
        let questionAnswered = 0;
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.totalAns.forEach((items) => {
                const particularObjectValue = items.question_type_id != '24' ? items : items.subQuestions[0];

                if ( this.checkAutoGradeQns == '2' && (particularObjectValue.is_correct == 'true' || particularObjectValue.is_correct == 'false')) {
                    questionAnswered++;
                } else if (this.checkAutoGradeQns != '2' && particularObjectValue.is_correct == 'manual') {
                    questionAnswered++;
                }
            });
        } else {
            questionAnswered = this.totalAns.length;
        }
        return questionAnswered;
    }

    startTimer() {
        this.pauseTimer();
        this.interval = setInterval(() => {
            this.timeTaken++;
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.interval);
    }

    expandFullScreen(item, i, j) {
        console.log(item, 'item');
        console.log(i, 'j');
        console.log(i, 'j');
        if (item.question_type_id == 20) {
            this.modalRef = this.modalService.open(this.showExpand, {size: 'xl', backdrop: 'static'});
            this.showAnswerItem = item;
            this.showAnswerI = i;
            this.showAnswerJ = j;
        } else if (item.question_type_id == 30) {
            item.given_answer = item.given_answer1;
            this.modalRef = this.modalService.open(this.showExpand, {size: 'xl', backdrop: 'static'});
            this.showAnswerItem = item;
            this.showAnswerI = i;
            this.showAnswerJ = j;
            this.hideRuleAnswer[i].section[j] = false;
        }
    }

    patchMinimize(i, j, item) {
        this.close();
        if (item.question_type_id == '30') {
            this.totalAns[i].section[j].given_answer = this.totalAns[i].section[j].given_answer1;
            this.hideRuleAnswer[i].section[j] = true;
        } else if (item.question_type_id == '20') {
            this.totalAns[i].section[j].given_answer = this.expandData20;
        }
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
        }, 3000);
    }

    showPdf() {
        this.pdf = !this.pdf;
        if (this.pdf) {
            this.button = 'Hide PDF';
        } else {
            this.button = 'Show PDF';
        }
    }

    // getAreaInfo(event) {
    //     this.areaInfo = event;
    //     const data = {
    //         platform: 'web',
    //         student_id: this.auth.getSessionData('rista-userid'),
    //         annotation: this.areaInfo,
    //         content_id: this.getData.content_id,
    //         student_content_id: this.getData.student_content_id,
    //         class_id: this.getData.class_id,
    //     }
    //     const value = debounce({
    //
    //         this.creator.saveAnnotation(data).subscribe((successData) => {
    //                 this.saveAnnotationSuccess(successData);
    //             },
    //             (error) => {
    //                 this.saveAnnotationFailure(error);
    //             });
    //     }
    //         this.saveAnnotation(), 1000
    //     )
    //     // this.saveAnnotation();
    // }

    getDeleteAction(event) {
        this.delAnnotation = event;
    }

    getCurrentPageNo(event) {
        if (typeof event == 'number') {
            this.scrolledPageNumber = event;
        }
    }

    expandPdfSize(event) {
        this.expandPdf = event;
    }

    parseVal(val) {
        if (val != '' && val != null) {
            const graph = parse(val);
            return graph;
        } else {
            const graph = false;
            return graph;
        }
    }

    patchFreeTextVal() {
        this.totalAns.forEach((item, i) => {
            item.section.forEach((value, j) => {
                if (value.question_type_id == '30' && value.given_answer1) {
                    this.hideRuleAnswer[i].section[j] = false;
                    value.given_answer = value.given_answer1;
                }
            });
        });
        this.clickEvent();
    }

    patchWorkspaceVal() {
        this.totalAns.forEach((item, i) => {
            item.section.forEach((value, j) => {
                if (value.student_roughdata1) {
                    this.hideRuleContent[i].section[j] = false;
                    value.student_roughdata = value.student_roughdata1;
                }
            });
        });
    }

    setAnswer(id, index) {
        this.patchFreeTextVal();
        this.hideRuleAnswer[id].section[index] = !this.hideRuleAnswer[id].section[index];
    }

    submitAnswer(value, i, j) {
        console.log(value, 'value');
        console.log(i, 'j');
        console.log(i, 'j');
        this.totalAns[i].section[j].given_answer = value;
        this.hideRuleAnswer[i].section[j] = false;
        this.clickEvent();
    }

    toggle(i, j) {
        // toggle based on index
        this.patchWorkspaceVal();
        this.hideRuleContent[i].section[j] = true;
    }

    toggle1(i, j) {
        // toggle based on index
        this.hideRuleContent[i].section[j] = false;
    }

    getNumericAnswerValue(event, i, j) {
        if (this.answerEditor[i]) {
        } else {
            this.answerEditor[i] = {section: []};
        }
        this.answerEditor[i].section[j] = event;
        this.totalAns[i].section[j].given_answer1 = event.content;
        this.totalAns[i].section[j].answer_attended = '1';
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    getNumericAnswerValue1(event, i, j) {
        console.log(event.content, 'iopwe');
        // this.hideRuleAnswer[j] = false;
        console.log(this.answerEditor[i].section[j], 'small editor');
        // this.answerEditor[i].section[j].content = event.content;
        this.totalAns[i].section[j].given_answer1 = event.content;
        // this.totalAns[i].section[j].given_answer = event.content;
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    getNumericWorkSpaceValue(event, i, j) {
        if (this.workSpaceEditor[i]) {
        } else {
            this.workSpaceEditor[i] = {section: []};
        }
        // this.workSpaceEditor[i].section[j].content = event;
        this.totalAns[i].section[j].student_roughdata1 = event.content;
        this.totalAns[i].section[j].answer_attended = '1';
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    getWorkSpaceValue(event, i) {
        if (this.page != 1) {
            i = ((this.page - 1) * 10) + i;
        }
        if (event.content != '') {
            this.totalAns[i].student_roughdata = event.content;
        }
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    getPassageWorkSpaceValue(event, i, j, item) {
        console.log(item);
        console.log(item.student_roughdata);
        if (event.content != '') {
            item.student_roughdata = event.content;
        }
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    getGraphEditorValue(event) {
        this.graphEditorAns = event.content;
    }

    getChooseAns(event, i, j) {
        this.totalAns[i].section[j].given_answer = this.totalAns[i].section[j].array[event];
        this.totalAns[i].section[j].answer_attended = '1';
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    getInputAns(event, i, j) {
        this.totalAns[i].section[j].given_answer = event.target.value;
        this.totalAns[i].section[j].answer_attended = '1';
        this.expandData20 = event.target.value;
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    getBlanksValue(event, index, i, j) {
        for (let k = 0; k < this.totalAns[i].section[j].answer.length; k++) {
            if (k == index) {
                this.blankAns[i].section[j].input[index] = event.target.value;
            } else if (this.blankAns[i].section[j].input[k] == undefined) {
                this.blankAns[i].section[j].input[k] = '';
            }
        }
        this.totalAns[i].section[j].given_answer = this.blankAns[i].section[j].input;
        this.totalAns[i].section[j].answer_attended = '1';
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    cfsGetMultiChoice(index, id, item) {
        if (this.page != 1) {
            index = ((this.page - 1) * 10) + index;
        }
        if (item.question_type_id == '2') {
            if (this.totalAns[index].given_answer[id].isSelected == '') {
                this.totalAns[index].given_answer[id].isSelected = id.toString();
            } else {
                this.totalAns[index].given_answer[id].isSelected = '';
            }
        } else if (item.question_type_id == '1') {
            for (let i = 0; i < this.totalAns[index].given_answer.length; i++) {
                this.totalAns[index].given_answer[i].isSelected = '';
                if (i === id) {
                    if (this.totalAns[index].given_answer[id].isSelected == '') {
                        this.totalAns[index].given_answer[id].isSelected = id.toString();
                    } else {
                        this.totalAns[index].given_answer[id].isSelected = '';
                    }
                }
            }
        }
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    onPageChange(data) {
        this.pdfPath = this.common.convertBase64(this.questionData.file_path);
        if (this.pdfPath.length == 0) {
            this.workspacedata = this.totalAns;
            this.workspacedata.forEach((items) => {
                if (items.question_type_id != '24') {
                    items.PatchData = items.student_roughdata != '';
                } else {
                    items.subQuestions.forEach((sub) => {
                        sub.patchData = sub.student_roughdata != '';
                    });
                }
            });
        } else {
            this.workspacedata = this.totalAns;
            this.workspacedata.forEach((val) => {
                val.section.forEach((items) => {
                    if (items.question_type_id == '40') {
                        items.PatchData = items.student_roughdata != '';
                    }
                });
            });
        }

        this.page = data;
        window.scrollTo(0, 0);
        for (let i = 0; i < this.totalAns.length; i++) {
            if (this.totalAns[i].question_type_id == '20') {
                this.totalAns[i].given_answer[0].isSelected = this.totalAns[i].given_answer[0].isSelected1;
            } else if (this.totalAns[i].question_type_id == '10') {
                for (let j = 0; j < this.totalAns[i].given_answer.length; j++) {
                    if (this.totalAns[i].given_answer[j].isSelected1) {
                        this.totalAns[i].given_answer[j].isSelected = this.totalAns[i].given_answer[j].isSelected1;
                    } else {
                        this.totalAns[i].given_answer[j].isSelected = '';
                    }
                }
            } else if (this.totalAns[i].question_type_id == '24') {
                for (let j = 0; j < this.totalAns[i].subQuestions.length; j++) {
                    if (this.totalAns[i].subQuestions[j].question_type_id == '10') {
                        for (let k = 0; k < this.totalAns[i].subQuestions[j].given_answer.length; k++) {
                            if (this.totalAns[i].subQuestions[j].given_answer[k].isSelected1) {
                                this.totalAns[i].subQuestions[j].given_answer[k].isSelected = this.totalAns[i].subQuestions[j].given_answer[k].isSelected1;
                            } else {
                                this.totalAns[i].subQuestions[j].given_answer[k].isSelected = '';
                            }
                        }
                    }
                }
            }
        }
        this.clickEvent();
        // this.save
        // this.saveAnswer('2', 'noExit');
    }

    cfsGetChooseTable(item, index, row, column) {
        if (item.question_type_id == '5') {
            for (let i = 0; i < item.given_answer.length; i++) {
                if (i === row) {
                    item.given_answer[i].isSelected = column.toString();
                }
            }
        } else if (item.question_type_id == '7') {
            for (let i = 0; i < item.given_answer.length; i++) {
                let val = '';
                if (item.given_answer[i].isSelected !== '') {
                    const split = item.given_answer[i].isSelected.split(',');
                    let repeat = false;
                    for (let y = 0; y < split.length; y++) {
                        if (split[y] == column) {
                            split.splice(y, 1);
                            repeat = true;
                        }
                    }
                    if (repeat == true) {
                        val = split.join(',');
                    } else {
                        val = item.given_answer[i].isSelected + ',' + column;
                    }
                } else {
                    val = column.toString();
                }
                if (i === row) {
                    item.given_answer[i].isSelected = val;
                }
            }
        }
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    dropdownId(index, id) {
        if (this.page != 1) {
            index = ((this.page - 1) * 10) + index;
        }
        return index + 'dropdown' + id;
    }

    cfsGetDropdown(event, index, id, ans, val) {
        if (this.page != 1) {
            index = ((this.page - 1) * 10) + index;
        }
        this.totalAns[index].given_answer[id].isSelected = ans.toString();
        document.getElementById(index + 'dropdown' + id).innerHTML = val;
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
        this.clickEvent();
    }

    cfsPatchDropdown() {
        setTimeout(() => {
            for (let i = 0; i < this.totalAns[this.showQuestion].answer.length; i++) {
                for (let j = 0; j < this.totalAns[this.showQuestion].answer[i].options.length; j++) {
                    if (this.totalAns[this.showQuestion].answer[i].options[j].selected == 'true') {
                        document.getElementById('dropdown' + i).innerHTML = this.totalAns[this.showQuestion].answer[i].options[j].listOption;
                    }
                }
            }
        }, 500);
    }

    cfsGetInput(event, index, id, item) {
        if (item.editor_type == 1) {
            item.given_answer[id].isSelected1 = event.target.value;
        } else {
            item.given_answer[id].isSelected1 = event.content;
        }
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    cfsGetPara(event, index) {
        if (this.page != 1) {
            index = ((this.page - 1) * 10) + index;
        }
        this.totalAns[index].given_answer[0].isSelected1 = event.content;
        if ((this.getData.student_content_status == '1' || this.getData.student_content_status == '2') && event.content != '') {
            this.guard = true;
        }
    }

    cfsGetHighlight(event, index) {
        if (this.page != 1) {
            index = ((this.page - 1) * 10) + index;
        }
        this.totalAns[index].given_answer[0].isSelected = event.content;
        if ((this.getData.student_content_status == '1' || this.getData.student_content_status == '2') && event.content != '') {
            this.guard = true;
        }
    }

    cfsgetGraphValue(event, index) {
        this.totalAns[index].given_answer[0].isSelected = event;
        this.totalAns[index].answer_valueEmitted = true;
        this.graphEdited = true;
        console.log(this.totalAns[index].given_answer[0].isSelected, 'isSelected');
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    cfsGetGraghEditor(event, index) {
        if (this.page != 1) {
            index = ((this.page - 1) * 10) + index;
        }
        this.totalAns[index].editor_key = event.content;
        if ((this.getData.student_content_status == '1' || this.getData.student_content_status == '2') && event.content != '') {
            this.guard = true;
        }
    }

    cfsPassageMultiChoice(index, id, it, item) {
        // item.given_answer[it].isSelected = it;
        if (item.question_type_id == '2') {
            if (item.given_answer[it].isSelected == '') {
                item.given_answer[it].isSelected = it.toString();
            } else {
                item.given_answer[it].isSelected = '';
            }
        } else if (item.question_type_id == '1') {

            for (let i = 0; i < item.given_answer.length; i++) {

                if (i == it) {
                    if (item.given_answer[it].isSelected == '') {
                        item.given_answer[it].isSelected = it.toString();
                    } else {
                        item.given_answer[it].isSelected = '';
                    }
                } else {
                    item.given_answer[i].isSelected = '';
                }
            }
        }
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            this.guard = true;
        }
    }

    cfsGetPassageEssay(event, index, list) {
        if (list.given_answer.length != 0) {
            list.given_answer[0].isSelected = event.content;
        }
    }

    splitMultiChoose(val, index) {
        const value = val.split(',');
        for (let i = 0; i < value.length; i++) {
            if (parseInt(value[i]) === parseInt(index)) {
                return true;
            }
        }
    }

    patchCorrectMultiChoiceAnswer(data, index, secondIndex) {
        let patchValue = false;
        data.forEach((items) => {
            if (items.correctActive == secondIndex) {
                if (items.correctAnswer == index) {
                    patchValue = true;
                }
            }
        });
        return patchValue;
    }

    droppedCorrect(event: CdkDragDrop<string[]>, index) {
        const control = this.totalAns[index].given_answer as any
        this.totalAns[index].answer_shuffled = true;
        moveItemInArray(control, event.previousIndex, event.currentIndex);
    }

    openGraph(event, i, j, item) {
        this.workAnnotate = [...item.workarea];
        this.graphAnswerVal = '';
        this.graphFeedback = item.student_feedback;
        this.graphId = i;
        this.graphIndex = j;
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.getData.content_id,
            content_format: this.getData.content_format,
            class_id: this.getData.class_id,
            student_id: this.auth.getSessionData('rista-userid'),
            question_id: this.totalAns[i].section[j].answer_id,
            type: '2'
        };
        this.creator.graphAnswer(data).subscribe((successData) => {
                this.getGraphSuccess(successData);
            },
            (error) => {
                this.getGraphFailure(error);
            });
        this.modalRef1 = this.modalService.open(this.answerGraph, {size: 'lg'});
    }

    getGraphSuccess(successData) {
        if (successData.IsSuccess) {
            this.graphAnswerVal = successData.ResponseObject[0].student_answer[0]?.correctAnswer;
            this.graphEditorAns = successData.ResponseObject[0].editor_answer;
            this.graphEditorAnsDup = successData.ResponseObject[0].editor_answer != '';
            this.getGraph = this.parseVal(this.graphAnswerVal);
        }
    }

    getGraphFailure(error) {
        console.log(error);
    }

    getDropdownAns(event, i, j) {
        this.totalAns[i].section[j].given_answer = this.totalAns[i].section[j].mob_options[event];
        this.totalAns[i].section[j].answer_attended = '1';
    }

    getTrueAns(event, i, j) {
        this.totalAns[i].section[j].given_answer = event;
        this.totalAns[i].section[j].answer_attended = '1';
    }

    storeGraph(event) {
        this.getGraph = event;
    }

    deletePdf(id) {
        this.answerPdf.splice(id, 1);
    }

    uploadAnswerPdf(event) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),

        };
    }

    saveGraph(event, val, id) {
        this.graphBoardValue = event;
        let list;
        const objects = {};
        for (const el in this.graphBoardValue.objects) {
            const inherit = [];
            this.graphBoardValue.objects[el].inherits.forEach((item) => {
                inherit.push({name: item.name});
            });
            objects[el] = {
                elType: this.graphBoardValue.objects[el].elType,
                coords: this.graphBoardValue.objects[el].coords,
                name: this.graphBoardValue.objects[el].name,
                inherits: inherit,
                parents: this.graphBoardValue.objects[el].parents,
                splinePoints: this.graphBoardValue.objects[el].splinePoints,
                quadraticform: this.graphBoardValue.objects[el].quadraticform,
            };
        }
        const graph = {
            attr: this.graphBoardValue.attr,
            objects
        };
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.getData.content_id,
            content_format: this.getData.content_format,
            class_id: this.getData.class_id,
            student_id: this.auth.getSessionData('rista-userid'),
            question_id: id.question_id,
            answer: [{correctAnswer: stringify(graph), correctActive: ''}],
            editor_answer: val,
            type: '1',
            student_content_id: this.getData?.student_content_id
        };
        this.creator.graphAnswer(data).subscribe((successData) => {
                this.saveGraphSuccess(successData, '2', id, data);
            },
            (error) => {
                this.saveGraphFailure(error);
            });
    }

    getGraphAnswerValue(event, i, j) {
        this.graphBoardValue = event;
        let list;
        let graph: any;
        let graphAnswerData: any;
        if (this.graphBoardValue != undefined && this.graphBoardValue != '') {
            const objects = {};
            for (const el in this.graphBoardValue.objects) {
                const inherit = [];
                this.graphBoardValue.objects[el].inherits.forEach((item) => {
                    inherit.push({name: item.name});
                });
                objects[el] = {
                    elType: this.graphBoardValue.objects[el].elType,
                    coords: this.graphBoardValue.objects[el].coords,
                    name: this.graphBoardValue.objects[el].name,
                    inherits: inherit,
                    parents: this.graphBoardValue.objects[el].parents,
                    splinePoints: this.graphBoardValue.objects[el].splinePoints,
                    quadraticform: this.graphBoardValue.objects[el].quadraticform,
                };
            }
            graph = {
                attr: this.graphBoardValue.attr,
                objects
            };
            graphAnswerData = [{correctAnswer: stringify(graph), correctActive: ''}];
        } else {
            graphAnswerData = [{correctAnswer: '', correctActive: ''}];
        }

        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.getData.content_id,
            content_format: this.getData.content_format,
            class_id: this.getData.class_id,
            student_id: this.auth.getSessionData('rista-userid'),
            question_id: this.totalAns[i].section[j].answer_id,
            answer: graphAnswerData,
            student_answer: graphAnswerData,
            editor_answer: this.graphEditorAns,
            type: '1'
        };
        this.creator.graphAnswer(data).subscribe((successData) => {
                this.saveGraphSuccess(successData, '1');
            },
            (error) => {
                this.saveGraphFailure(error);
            });
    }

    saveGraphSuccess(successData, id, data?, JSONObject?) {
        if (id == '1') {
            this.closeGraph(this.graphId, this.graphIndex);
            this.graphEditorAns = '';
        }
        if (data) {
            data.given_answer = JSONObject.answer;
            this.graphEdited = false;
        }
    }

    saveGraphFailure(error) {
        console.log(error);
    }

    getQueries(event, i, j, type) {
        if (type == 'pdf') {
            this.queriesIndex = j + 'id' + i;
        } else if (type == 'scratch') {
            this.queriesIndex = 'id' + i;
        } else {
            this.queriesIndex = j + 'id' + i;
        }
        this.queries = event.target.value;
    }

    submitQueries(i, j, type) {
        let studentAnswer: any;
        if (type == 'pdf') {
            studentAnswer = this.totalAns[i].section[j].answer_id;
        } else if (type == 'scratch') {
            if (this.page != 1) {
                i = ((this.page - 1) * 10) + i;
            }
            studentAnswer = this.totalAns[i].question_id;
        } else {
            if (this.page != 1) {
                i = ((this.page - 1) * 10) + i;
            }
            studentAnswer = this.totalAns[i].subQuestions[j].question_id;
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.getData.content_id,
            content_format: this.getData.content_format,
            class_id: this.getData.class_id,
            student_id: this.auth.getSessionData('rista-userid'),
            answer_id: studentAnswer,
            suggestion_query: this.queries
        };
        this.student.submitQuery(data).subscribe((successData) => {
            this.submitQuerySuccess(successData, i, j);
        }, (error) => {
            this.submitQueryFailure(error);
        });
    }

    submitQuerySuccess(successData, id, index) {
        if (successData.IsSuccess) {
            console.log(this.totalAns[id], 'dsadas');
            if (this.showpdf) {
                this.totalAns[id].section[index].student_feedback = this.queries;
            } else {
                this.totalAns[id].student_feedback = this.queries;
            }
            this.queriesIndex = '';
            this.queries = '';
            this.toastr.success(successData.ResponseObject);
        }
    }

    submitQueryFailure(error) {
        console.log(error);
    }

    getAnnotation(pdfPath) {
        const decodedStringBtoA = this.auth.getAccessToken() + '|' + this.auth.getSessionData('rista-userid') + '|' + this.getData.content_id + '|' + this.getData.class_id;
        const encodedStringBtoA = btoa(decodedStringBtoA);
        const encodedStringBtoA1 = btoa(encodedStringBtoA);
        const data = {
            platform: 'web',
            student_content_id: this.getData.student_content_id,
            authorization_key: encodedStringBtoA1
        };
        this.creator.getStudDetail(data).subscribe((successData) => {
                this.getAnnotationSuccess(successData, pdfPath);
            },
            (error) => {
                this.getAnnotationFailure(error);
            });
    }

    getAnnotationSuccess(successData, pdfPath) {
        if (successData.IsSuccess) {
            console.log(this.common.convertBase64(successData.ResponseObject.pdfpath), 'successData.ResponseObject.pdfpath');

            successData.ResponseObject.teacher_annotation.forEach((item) => {
                item.isTeacherCorrection = false;
            });
            this.areaInfo = [...this.areaInfo, ...successData.ResponseObject.student_annotation, ...successData.ResponseObject.teacher_annotation];
            if(pdfPath[0]?.original_image_url != undefined) {
                this.common.downloadfilewithbytes(this.webhost + '/' + pdfPath[0]?.original_image_url)
                .subscribe((filebytes: ArrayBuffer) => {
                    this.pdfTemplate = filebytes;
                    this.functionCalled = true;
                    this.isPdfAvailable = true;
                    this.overallFullData = successData;
                });
            } else {
                this.isPdfAvailable = false;
                this.functionCalled = true;
            }
            // this.functionCalled = true;
            // while(document.getElementById('scrollinnnersection').offsetHeight < 500){

            // console.log(document.getElementById('scrollinnnersection').offsetHeight ,'2')
            //     this.pageScroll += 1;
            //     this.totalAns.push(this.totalAnsSample[this.pageScroll]);
            // this.totalAns.push(this.totalAnsSample[0]);
            // this.pushAnsArr();

        }
    }

    getAnnotationFailure(error) {
        console.log(error);
    }

    pushAnsArr() {
        console.log('1');
        console.log(document.getElementById('scrollinnnersection').offsetHeight, 'document.getElementById(\'scrollinnnersection\').offsetHeight');

        if (document.getElementById('scrollinnnersection').offsetHeight < 400) {
            this.pageScroll += 1;
            this.totalAns.push(this.totalAnsSample[this.pageScroll]);
            setTimeout(() => {
                this.pushAnsArr();
            }, 900);

        } else {
            return false;
        }
    }

    tryAgainButton() {
        document.getElementById("yourTarget").scrollIntoView({
            behavior: "smooth",
            block: 'start',
            inline: 'start'
        });
        this.tryAgainButtonEnabled = true;
        this.startTimer();
    }

    studentsAnswerList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.getData.content_id,
            content_format: this.getData.content_format,
            class_id: this.getData.class_id,
            student_id: this.auth.getSessionData('rista-userid'),

        };
        const start = new Date().getTime();

        this.student.questionList(data).subscribe((successData) => {
                const end = new Date().getTime();
                const total_time = end - start;
                this.questionListSuccess(successData);
            },
            (error) => {
                this.questionListFailure(error);
            });
    }

    async questionList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getRoleId(),
            user_id: this.auth.getUserId(),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.getData.content_id,
            content_format: this.getData.content_format,
            class_id: this.getData.class_id,
            student_content_id: this.getData.student_content_id,
            class_content_id: this.getData.class_content_id,
            student_id: this.auth.getUserId(),
        };
        console.log(data, 'cotent');
        this.student.questionList(data).subscribe((successData) => {
            this.questionListSuccess(successData);
        }, (error) => {
            this.questionListFailure(error);
        });
    }

    questionListSuccess(successData) {
        if (successData.IsSuccess) {

            this.questionData = successData.ResponseObject;
            // this.questionData1 = successData.ResponseObject;
            this.questionData1 = JSON.parse(JSON.stringify(successData.ResponseObject));
            console.log(this.questionData, 'questionData');
            this.setting();
            this.answerPdf = this.common.convertBase64(this.questionData.upload_answer);
            this.contentName = this.questionData.name;
            this.contentType = this.questionData.content_type == '2' ? 'Assignment' : 'Assessment';
            this.pdfPath = this.common.convertBase64(this.questionData.file_path);
            console.log(this.pdfPath, 'this.pdfPath');
            if (this.pdfPath.length != 0) {
                this.showpdf = true;
                this.pdf = true;
                this.totalAns = [];
                this.questionData.annotation.forEach((item) => {
                    item.isTeacherCorrection = false;
                });
                this.areaInfo = [...this.questionData.annotation];
                this.dragQuestion = [...this.questionData.questionAnnotation];
                this.totalFeedBack = this.questionData.overall_student_feedback;
                this.downloadTemplate = this.webhost + '/' + this.pdfPath[0]?.original_image_url;
                this.linkdata = this.pdfPath[0]?.links;
                this.downloadTemplateName = this.questionData.name + '.pdf';
                this.getAnnotation(this.pdfPath);
                if (this.questionData.answers.length != 0) {
                    for (let i = 0; i < this.questionData.answers.length; i++) {
                        this.questionData.answers[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                    }
                    for (let i = 0; i < this.questionData.answers.length; i++) {
                        this.totalAns[i] = {heading: this.questionData.answers[i].heading, section: []};
                        this.workSpaceEditor[i] = {section: []};
                        this.hideRuleAnswer[i] = {section: []};
                        this.hideRuleContent[i] = {section: []};
                        this.answerEditor[i] = {section: []};
                        this.blankAns[i] = {section: []};
                        for (let x = 0; x < this.questionData.answers[i].section.length; x++) {
                            for (let j = 0; j < this.questionData.answers[i].section[x].sub_questions.length; j++) {
                                if (this.questionData.answers[i].section[x].sub_questions[j].page_no != 0) {
                                    this.showAutoScroll = true;
                                }
                                this.questionData.answers[i].section[x].sub_questions[j].answer_attended = '0';
                                this.totalAns[i].section.push(this.questionData.answers[i].section[x].sub_questions[j]);
                                this.hideRuleAnswer[i].section.push(false);
                                this.hideRuleContent[i].section.push(false);
                            }
                        }
                    }
                    this.workspacedata = this.totalAns;
                    this.totalAnsSample = this.totalAns;
                    this.totalAns = [];
                    if (this.totalAnsSample.length > 3) {
                        this.totalAnsSample.forEach((item, index) => {
                            if (index <= 3) {
                                this.pageScroll = index;
                                this.totalAns.push(this.totalAnsSample[index]);
                            }
                        });
                    } else {
                        this.totalAns = this.totalAnsSample;
                    }
                    // if (this.totalAnsSample.length > 1 && this.totalAnsSample[this.pageScroll].section.length < 3) {
                    //     this.pageScroll += 1;
                    //     this.totalAns.push(this.totalAnsSample[this.pageScroll]);
                    // }
                    this.workspacedata.forEach((val) => {
                        val.section.forEach((items) => {
                            if (items.question_type_id == '40') {
                                items.PatchData = items.student_roughdata != '';
                                console.log(items.PatchData, 'items.PatchData');
                            }
                        });
                    });
                    this.patchSomeIdVal();
                }
                console.log(this.showAutoScroll, 'this.showAutoScroll')
            } else {
                this.showpdf = false;
                this.linkdata = this.questionData.links;
                this.totalFeedBack = this.questionData.overall_student_feedback;
                this.totalAns = this.questionData.questions;
                this.timeTaken = this.totalAns.length != 0 ? this.totalAns[0]?.question_type_id != '24' ? this.totalAns[0]?.time_taken : this.totalAns[0]?.subQuestions[0]?.time_taken: 0;
                this.percentage = this.questionData?.percentage;
                this.checkAutoGradeQns = this.questionData.all_autograde == '1' ? this.questionData?.auto_review : '0';
                console.log(this.checkAutoGradeQns, 'autogade');
                this.workspacedata = this.questionData.questions;
                this.workspacedata.forEach((items) => {
                    if (items.question_type_id != '24') {
                        items.PatchData = items.student_roughdata != '';
                    } else {
                        items.subQuestions.forEach((sub) => {
                            sub.patchData = sub.student_roughdata != '';
                        });
                    }
                });
                for (let i = 0; i < this.totalAns.length; i++) {
                    if (this.totalAns[i].question_type_id == '40' || this.totalAns[i].question_type_id == '41') {
                        console.log(this.totalAns[i].given_answer, 'givenAnswer');
                        this.totalAns[i].answer_valueEmitted = false;
                        this.totalAns[i].given_answer[0].isSelected = this.parseVal(this.totalAns[i].given_answer[0].correctAnswer);
                    } else if (this.totalAns[i].question_type_id == '16') {
                        this.totalAns[i].answer_shuffled = false;
                    }
                    // else if (this.totalAns[i].question_type_id == '9') {
                    //     setTimeout(() => {
                    //         for (let j = 0; j < this.totalAns[i].given_answer.length; j++) {
                    //             if (this.totalAns[i].given_answer[j].isSelected === '') {
                    //                 if (document.getElementById(i + 'dropdown' + j)) {
                    //                     document.getElementById(i + 'dropdown' + j).innerHTML = 'Select Answer';
                    //                 }
                    //             } else {
                    //                 let val = this.totalAns[i].given_answer[j].isSelected;
                    //                 if (document.getElementById(i + 'dropdown' + j)) {
                    //                     document.getElementById(i + 'dropdown' + j).innerHTML = this.totalAns[i].given_answer[j].options[val].listOption;
                    //                 }
                    //             }
                    //         }
                    //     }, 1000);
                    // }
                }
                if (this.totalAns.length != 0) {
                    if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
                        let particularIndex = 0;
                        if (this.questionData.laq_id != 0) {
                            for (let i = 0 ; i < this.totalAns.length; i++) {
                                const particularObject = this.totalAns[i].question_type_id != '24' ? this.totalAns[i] : this.totalAns[i].subQuestions[0];
                                if (this.questionData.laq_id == particularObject.question_id) {
                                    particularIndex = i;
                                    if (this.serviceNeededOrNotFinalSubmit(this.totalAns[i])) {
                                        this.selectedQuestionList(this.totalAns[i], i, 'questionList');
                                        break;
                                    } else {
                                        const checkIndexValue = particularIndex;
                                        this.runLoop(checkIndexValue + 1, checkIndexValue)
                                    }
                                }
                            }
                        } else {
                            this.previouslySelectedIndex = 0;
                            this.selectedQuestionList(this.totalAns[0], 0, 'questionList');
                        }
                    } else {
                        this.selectedQuestionList(this.totalAns[0], 0, 'questionList');
                    }
                }

            }
        } else {
            this.toastr.info(successData.ResponseObject.message);
            if (successData.ResponseObject.content_type == '2') {
                this.route.navigate(['/studentlogin/assignment']);
            } else {
                this.route.navigate(['/studentlogin/assessment']);
            }
        }
        this.clickEvent();

    }

    questionListFailure(error) {
        console.log(error, 'error');
    }

    runLoop(startIndex, endIndex, secondTime?) {
        for (let i = startIndex; i <= this.totalAns.length; i++) {
            const loopIndex = i;
            if (loopIndex == this.totalAns.length) {
                if (this.serviceNeededOrNotFinalSubmit(this.totalAns[loopIndex - 1])) {
                    this.selectedQuestionList(this.totalAns[loopIndex - 1], loopIndex, 'questionList');
                    break;
                } else {
                   this.runLoop(0, endIndex, 'second');
                }
            } else {
                if (secondTime == 'second' && endIndex == i) {
                    this.selectedQuestionList(this.totalAns[i], i, 'questionList');
                    break;
                } else {
                    if (this.serviceNeededOrNotFinalSubmit(this.totalAns[i])) {
                        this.selectedQuestionList(this.totalAns[i], i, 'questionList');
                        break;
                    }
                }
            }
        }        
    }

    sectionFilter(event) {
        const scroll = document.getElementById('scrollinnnersection');
        scroll.scrollTo(0, 0);
        if (event.target.value == 'all') {
            this.pageScroll = 0;
            this.totalAns = [];
            if (this.totalAnsSample.length > 2) {
                for (let i = 0; i < 3; i++) {
                    this.pageScroll = i;
                    this.totalAns.push(this.totalAnsSample[this.pageScroll]);
                }
            } else {
                this.totalAns = [...this.totalAnsSample];
            }
        } else {
            this.totalAns = [this.totalAnsSample[parseInt(event.target.value)]];
        }
        console.log(this.totalAns, 'toatalans');
        console.log(this.totalAnsSample, 'totalAnsSample');
        this.patchSomeIdVal();
    }

    submitPopup() {
        this.modalRef = this.modalService.open(this.submitAlert);
    }

    scrollDownPads() {
        // this.jsPDF.addPage();
        // this.jsPDF.insertPage(1);
        // this.samplePdf = this.jsPDF.output('datauristring');
        // this.signaturePad.scrollDownPad();

        // this.writtingPadHeight += 300;
        // // let elem = document.getElementById('signaturepad');
        // // this.signaturePad = elem;
        // console.log(this.signaturePad, 'signaturePad');
        // //
        // // elem.children[0].setAttribute('height' , this.writtingPadHeight);
        // this.signaturePadOptions = {
        //     minWidth: 1,
        //     maxWidth: 1,
        //     penColor: '#ce2222',
        //     canvasWidth: 460,
        //     canvasHeight: this.writtingPadHeight
        // };
        // this.resizeSignaturePad();
        // this.cdr.detectChanges();
    }

    loaded(event) {
        console.log(event, 'event');
        this.signaturePad = event;
    }

    drawComplete() {
        console.log('complete');
        // this.sigPadData = this.signaturePad.toDataURL();
    }

    onScrollDown() {
        if (this.totalAns.length < this.totalAnsSample.length && this.sectionFilterVal == 'all') {
            this.pageScroll += 1;
            console.log('enter scroll');
            this.totalAns.push(this.totalAnsSample[this.pageScroll]);
            this.patchSomeIdVal();
        }
    }

    scrollQues(event) {
        const data = event.path;
        // console.log(data, 'data');
        console.log(this.allowAutoScroll, 'allowAutoScroll');
        if (this.allowAutoScroll && this.showAutoScroll && data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id != '' && data[i].id != undefined) {
                    const split = data[i].id.split('-');
                    if (split.length == 3 && split[0] != '0') {
                        this.scrolledPageNumber = parseInt(split[0]);
                        // this.anno.pageVariable = parseInt(this.scrolledPageNumber);
                        break;
                    }
                }
                console.log(this.scrolledPageNumber, 'this.scrolledPageNumber');
            }
        }
    }

    patchSomeIdVal() {
        setTimeout(() => {
            for (let i = 0; i < this.totalAns.length; i++) {
                for (let j = 0; j < this.totalAns[i].section.length; j++) {
                    if (this.totalAns[i].section[j].student_roughdata != '') {
                        // this.workSpaceEditor[i].section[j]?.editor.setContent(this.totalAns[i].section[j].student_roughdata);
                        this.workSpaceEditor[i].section[j]?.editor.setContent(this.totalAns[i].section[j].student_roughdata);
                    }
                    if (this.totalAns[i].section[j].question_type_id == '30') {
                        if (this.totalAns[i].section[j].given_answer != '') {
                            this.answerEditor[i].section[j]?.editor.setContent(this.totalAns[i].section[j].given_answer);
                        }
                    } else if (this.totalAns[i].section[j].question_type_id == '54') {
                        this.blankAns[i].section[j] = {input: []};
                        for (let k = 0; k < this.totalAns[i].section[j].given_answer.length; k++) {
                            this.blankAns[i].section[j].input.push(this.totalAns[i].section[j].given_answer[k]);
                        }
                    }
                }
            }
            this.clickEvent();
        }, 2000);
    }

    validateAnswer() {
        this.totalAns.forEach((val, id) => {
            val.section.forEach((item, index) => {
                if (item.question_type_id == '54' && item.answer_attended != '3') {
                    let validate = false;
                    item.given_answer.forEach((arr) => {
                        if (arr != '') {
                            validate = true;
                        }
                    });
                    if (validate) {
                        item.answer_attended = '2';
                    }
                } else if (item.answer_attended != '3') {
                    if (item.given_answer != '') {
                        item.answer_attended = '2';
                    } else {
                        item.answer_attended = '0';
                    }
                }
            });
        });
    }

    getElapsedTime(): TimeSpan {
        let totalSeconds = this.timeTaken;
        let hours: any = 0;
        let minutes: any = 0;
        let seconds: any = 0;
        if (totalSeconds >= 3600) {
            hours = Math.floor(totalSeconds / 3600);
            totalSeconds -= 3600 * hours;
        }

        if (totalSeconds >= 60) {
            minutes = Math.floor(totalSeconds / 60);
            totalSeconds -= 60 * minutes;
        }

        seconds = totalSeconds;
        seconds = seconds <= 9 ? '0' + seconds : seconds;
        hours = hours <= 9 ? '0' + hours : hours;
        minutes = minutes <= 9 ? '0' + minutes : minutes;

        return {
            hours,
            minutes,
            seconds
        };
    }

    updateAnswer() {
        this.questionData.answers.forEach((value) => {
            value.section.forEach((sec) => {
                sec.sub_questions.forEach((item) => {
                    if (item.answer_attended == '1') {
                        item.answer_attended = '2';
                    }
                });
            });
        });
    }

    checkQuestionId(item) {
        return item.question_type_id != '24' ? item : item.subQuestions[0];
    }

    checkDisableConditionForQns(item) {
        const particularObjectValue = item.question_type_id != '24' ? item : item.subQuestions[0];
        return (this.getData.student_content_status != '1' && this.getData.student_content_status != '2')
            || particularObjectValue.is_correct == 'false' || particularObjectValue.is_correct == 'true' || (particularObjectValue.is_correct == 'partially-completed' && !this.tryAgainButtonEnabled);
    }

    async saveAnswer(id, route, loader, questionMove = '') {
        let allow = true;
        let finalArr = [];

        if (this.questionData.answers) {
            this.autoScoreRelease = true;
            this.updateAnswer();
            this.patchFreeTextVal();

            // if (this.totalAns.length < this.totalAnsSample.length && this.sectionFilterVal == 'all') {
            //     for (let i = 0; i < this.totalAns.length; i++) {
            //         this.totalAnsSample[i] = this.totalAns[i];
            //     }
            // } else if (this.totalAns.length < this.totalAnsSample.length && this.sectionFilterVal != 'all') {
            //     this.totalAnsSample[i] = this.totalAns[i];
            // }

            for (let i = 0; i < this.questionData.answers.length; i++) {
                for (let x = 0; x < this.questionData.answers[i].section.length; x++) {
                    for (let j = 0; j < this.questionData.answers[i].section[x].sub_questions.length; j++) {
                        if (this.questionData.answers[i].section[x].sub_questions[j].auto_grade == '0') {
                            this.autoScoreRelease = false;
                        }
                        const ans = this.questionData.answers[i].section[x].sub_questions[j];
                        for (let k = 0; k < this.totalAnsSample[i].section.length; k++) {
                            if (this.totalAnsSample[i].section[k].sub_question_no == ans.sub_question_no) {
                                if (this.totalAnsSample[i].section[k].question_type_id == 54) {
                                    if (this.totalAnsSample[i].section[k].given_answer.length != this.totalAnsSample[i].section[k].answer.length) {
                                        this.totalAnsSample[i].section[k].given_answer = [];
                                        for (let z = 0; z < this.totalAnsSample[i].section[k].answer.length; z++) {
                                            this.totalAnsSample[i].section[k].given_answer.push('');
                                        }
                                    }
                                }
                                if (this.totalAnsSample[i].section[k].question_type_id == 30) {
                                    if (this.totalAnsSample[i].section[k].given_answer1) {
                                        ans.given_answer = this.totalAnsSample[i].section[k]?.given_answer1;
                                    }
                                } else {
                                    ans.given_answer = this.totalAnsSample[i].section[k].given_answer;
                                }
                                ans.student_feedback = this.totalAnsSample[i].section[k].student_feedback;
                                ans.student_roughdata = this.totalAnsSample[i].section[k].student_roughdata1;
                            }
                        }
                    }
                }
            }
            finalArr = JSON.parse(JSON.stringify(this.questionData.answers));

            finalArr = finalArr.filter((value) => {
                value.section = value.section.filter((sec) => {
                    sec.sub_questions = sec.sub_questions.filter((item) => {
                        return item.answer_attended == '2';
                    });
                    return sec.sub_questions.length != '0';
                });
                return value.section.length != '0';
            });
            finalArr.forEach((value) => {
                value.section.forEach((sec) => {
                    sec.sub_questions.forEach((item) => {
                        item.answer_attended = '3';
                    });
                });
            });

            if ((finalArr.length == 0 && this.questionData.answers.length != 0) && !loader) {
                allow = false;
                // this.answerSaving = false;
                this.commondata.showLoader(false);
                // this.commondata.showLoader(false);
                return false;
            }
        } else {
            for (let i = 0; i < this.totalAns.length; i++) {
                if (this.totalAns[i].question_type_id == '40' || this.totalAns[i].question_type_id == '41') {
                    this.saveAnswerForFewType(i, 'save');
                } else if (questionMove == 'same' || id == '4') {
                    this.saveAnswerForFewType(i, 'save');
                }

                    if (this.checkAutoGradeQns != '0') {
                        const questionNumber = this.showQuestion;
                        if (id == '4') {
                            const particularObjectValue = this.totalAns[i].question_type_id != '24' ? this.totalAns[i] : this.totalAns[i].subQuestions[0];
    
                            if (particularObjectValue.is_correct == '' || particularObjectValue.is_correct == 'partially-completed' || particularObjectValue.is_correct == 'manual') {
                                this.pauseTimer();
                                particularObjectValue.no_of_attempt = parseInt(particularObjectValue.no_of_attempt) + 1;
                                particularObjectValue.is_correct = this.checkCorrectAnswerOrNot(particularObjectValue, 'allQuestion');
                                particularObjectValue.time_taken = questionNumber == i ? this.timeTaken : particularObjectValue.time_taken;
                            }
                        }
                    }
                // }
            }
        }

        let checkAllQuestionCorrectedOrNot = false;
        this.totalAns.every((items) => {
            const particularObjectValue = items.question_type_id != '24' ? items : items.subQuestions[0];
            if (particularObjectValue.is_correct == '' || particularObjectValue.is_correct == 'partially-completed') {
                checkAllQuestionCorrectedOrNot = true;
                return false;
            }
            return true;
        });
        this.totalAns.forEach((items) => {
            const particularObjectValue = items.question_type_id != '24' ? items : items.subQuestions[0];
            particularObjectValue.earned_points = particularObjectValue.is_correct == 'true' ? parseInt(particularObjectValue.points) : 0;
        });
        if (this.totalFeedBack) {
        } else {
            this.totalFeedBack = '';
        }
        let data = {};
        if (this.questionData.answers) {
            data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                student_id: this.auth.getSessionData('rista-userid'),
                content_id: this.questionData.content_id,
                content_format: this.questionData.content_format,
                student_content_id: this.getData.student_content_id,
                upload_answer: this.answerPdf,
                class_id: this.getData.class_id,
                answers: finalArr,
                overall_student_feedback: this.totalFeedBack,
                status: id,
            };
        } else {
            data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                student_id: this.auth.getSessionData('rista-userid'),
                content_id: this.questionData.content_id,
                content_format: this.questionData.content_format,
                student_content_id: this.getData.student_content_id,
                class_id: this.getData.class_id,
                overall_student_feedback: this.totalFeedBack,
                questions: this.totalAns,
                all_autograde: this.questionData.all_autograde,
                laq_id: this.totalAns[this.showQuestion]?.question_type_id != '24' ?
                        this.totalAns[this.showQuestion]?.question_id : this.totalAns[this.showQuestion]?.subQuestions[0]?.question_id,
                status: id == '4' ? '4' : !checkAllQuestionCorrectedOrNot ? '4' : id,
            };
        }
        console.log(allow, data , 'allow');
        if (allow || loader) {
            if (loader == true) {
                this.commondata.showLoader(true);
            }
            await this.student.submitAnswer(data).subscribe((successData) => {
                    this.submitAnswerSuccess(successData, data, route, loader, questionMove);
                },
                (error) => {
                    this.commondata.showLoader(false);

                    this.submitAnswerFailure(error);
                });
        }

    }

    submitAnswerSuccess(successData, data, route, loader, questionMove) {
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            if (this.questionData.answers) {
                this.questionData.answers.forEach((value) => {
                    value.section.forEach((sec) => {
                        sec.sub_questions.forEach((item) => {
                            if (item.answer_attended == '2') {
                                item.answer_attended = '3';
                            }
                        });
                    });
                });
            } else {
                if (data.status != '4') {
                    this.studentAnswerDetails(questionMove);
                }
            }
            this.guard = false;
            this.answerSaving = false;

            if (data.status == '4') {
                this.close();
                this.toastr.success(this.contentType + ' ' + 'Submitted');
            } else if (loader == true) {
                this.toastr.success(this.contentType + ' ' + 'Saved');
            }
            if (route == 'exit') {
                this.guard = false;
                this.route.navigate(['/studentlogin/' + this.contentType.toLowerCase()]);
            }
        }
    }

    submitAnswerFailure(error) {
        this.answerSaving = false;
        console.log(error);
    }

    serviceNeededOrNot(data) {
        const particularObjectValue = data.question_type_id != '24' ? data : data.subQuestions[0];
        if (this.checkAutoGradeQns == '2') {
            return (particularObjectValue.is_correct == '' ||
                (particularObjectValue.is_correct == 'partially-completed' && (particularObjectValue.no_of_attempt < this.maximumAttempt) && this.tryAgainButtonEnabled));
        } else {
            return false;
        }
    }

    serviceNeededOrNotFinalSubmit(data) {
        const particularObjectValue = data.question_type_id != '24' ? data : data.subQuestions[0];
        return (particularObjectValue.is_correct == '' || particularObjectValue.is_correct == 'partially-completed');
    }

    checkCorrectAnswerOrNot(data, questionNeedToCheck) {

        console.log(data, 'data');
        let correctAnswer: any;

        if (data.question_type_id == '1') {
            correctAnswer = data.answer.every((items, index) => {
                return !(items.correctActive == '1' && data.given_answer[index].isSelected == '');
            });
            console.log(correctAnswer, 'correctAnswer');
        } else if (data.question_type_id == '2') {
            correctAnswer = data.answer.every((items, index) => {
                return !((items.correctActive == '1' && data.given_answer[index].isSelected == '') || (items.correctActive == '' && data.given_answer[index].isSelected != ''));
            });
            console.log(correctAnswer, 'correctAnswer');
        } else if (data.question_type_id == '5') {
            correctAnswer = data.given_answer.every((items, index) => {
                return items.isSelected == data.heading_option[index].correctActive.toString();
            });
        } else if (data.question_type_id == '7') {
            let pushArrayValue = [];
            data.given_answer.forEach((item) => {
                const splitedValue = item.isSelected != '' ? item.isSelected.split(',') : [];
                splitedValue.forEach((splitForEach) => {
                    pushArrayValue.push({
                        question : item.options,
                        isSelected: splitForEach
                    });
                });
            });
            const result = pushArrayValue.filter((o1) => {
                return !data.heading_option.some((o2) => {
                    return o1.question == o2.correctOption && o1.isSelected == o2.correctAnswer;
                });
            });
            correctAnswer = pushArrayValue.length == data.heading_option.length && result.length == 0;
        } else if (data.question_type_id == '9') {
            correctAnswer = data.given_answer.every((item) => {
                return !(item.isSelected == '' || item.options[item.isSelected].selected != 'true');
            });
        } else if (data.question_type_id == '10') {
            correctAnswer = data.given_answer.every((items) => {
                const enteredValue = items.options[0]?.value.trim().toLowerCase().split(' ').join('');
                return !(items.isSelected == '' || enteredValue != items.isSelected.trim().toLowerCase().split(' ').join(''));
            });
        } else if (data.question_type_id == '16') {
            correctAnswer = data.answer.every((items, index) => {
                return items.correctAnswer == data.given_answer[index].options;
            });
        }

        console.log(correctAnswer, 'correctAnswer');

        if (questionNeedToCheck != 'allQuestion') {
            const particularObjectValue = data.question_type_id != '24' ? data : data.subQuestions[0];
            if ((!correctAnswer && parseInt(particularObjectValue.no_of_attempt) != this.maximumAttempt)) {
                this.correctAnswer = false;
                this.tryAgainButtonEnabled = false;
                correctAnswer = 'partially-completed';
            } else if (correctAnswer) {
                this.correctAnswer = true;
            }
        }

        console.log(correctAnswer, 'correctAnswer');

        return correctAnswer.toString();
    }

    studentAnswerDetails(questionMove) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            student_content_id: this.getData?.student_content_id,
            question_id: this.totalAns[this.showQuestion]?.question_type_id != '24' ?
                this.totalAns[this.showQuestion]?.question_id : this.totalAns[this.showQuestion]?.subQuestions[0]?.question_id
        };

        this.student.studentAnswer(data).subscribe((successData) => {
                this.studentAnswerDetailsSuccess(successData, questionMove);
            },
            (error) => {
                console.log(error, 'studentAnswerDetails');
            });
    }

    studentAnswerDetailsSuccess(successData, questionMove) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            if (successData.ResponseObject.length != 0) {
                this.percentage = successData.ResponseObject[0]?.percentage;
                if (this.totalAns[this.showQuestion]?.question_type_id == '9' && (successData.ResponseObject[0].is_correct == 'true' ||
                        successData.ResponseObject[0].is_correct == 'false')) {
                    this.cfsPatchDropdown();
                }
                const questionNumber = this.showQuestion;
                if (questionMove == 'next' && successData.ResponseObject[0].is_correct == 'true'){
                    console.log(this.showQuestion, 'first');

                    setTimeout(() => {
                        this.afterSaveFunction(questionNumber);
                    }, 3000);
                } else if (questionMove == 'nextWithNonAutoGraded') {
                    this.afterSaveFunction(questionNumber);
                }
            }
        }
    }

    afterSaveFunction(questionNumber) {
        if (this.totalAns[questionNumber + 1]) {
            this.selectedQuestionList(this.totalAns[questionNumber + 1], questionNumber + 1);
        } else {
            let checkWhetherOtherQuestionCorrectedOrNot = false;
            let indexValue = 0;
            this.totalAns.every((items, index) => {
                const particularObjectValue = items.question_type_id != '24' ? items : items.subQuestions[0];
                if (particularObjectValue.is_correct == '' || particularObjectValue.is_correct == 'partially-completed') {
                    checkWhetherOtherQuestionCorrectedOrNot = true;
                    indexValue = index;
                    return false;
                }
                return true;
            });

            if (checkWhetherOtherQuestionCorrectedOrNot) {
                // const scroll = document.getElementById('questionNo' + indexValue);
                // console.log(scroll, 'scroll');
                // scroll.scroll(0, 0);
                // // document.getElementById("questionNo" + indexValue).scrollIntoView({
                // //     behavior: "smooth",
                // //     block: 'start',
                // //     inline: 'start'
                // // });
                // // this.scrollContent.nativeElement.scrollTo(
                // //     {
                // //         left: 0,
                // //         behavior: 'smooth'
                // //     });
                this.selectedQuestionList(this.totalAns[indexValue], indexValue);
            } else {
                this.guard = false;
                this.route.navigate(['/studentlogin/' + this.contentType.toLowerCase()]);
            }
        }
    }

    async checkLastQuestion(currentIndex, lastQuestion) {
            const particularObjectValue = this.totalAns[this.showQuestion].question_type_id != '24' ? this.totalAns[this.showQuestion] : this.totalAns[this.showQuestion].subQuestions[0];
            if (this.serviceNeededOrNot(particularObjectValue)) {
                const answerValidation = this.checkCorrectAnswerOrNot(particularObjectValue, 'singleQuestion');
                if (answerValidation == 'true' || answerValidation == 'false') {
                    let checkAllQnsCorrectedOrNot = true;
                    this.totalAns.every((items, index) => {
                        const particularObjectLoopValue = items.question_type_id != '24' ? items : items.subQuestions[0];
                        console.log(currentIndex != index, 'checkIndexValue');
                        if ((particularObjectLoopValue.is_correct == '' || particularObjectLoopValue.is_correct == 'partially-completed') && (currentIndex != index)) {
                            checkAllQnsCorrectedOrNot = false;
                            return false;
                        }
                        return true;
                    });

                    await setTimeout(() => {
                        console.log(checkAllQnsCorrectedOrNot, 'checkAllQnsCorrectedOrNot')
                        checkAllQnsCorrectedOrNot ? this.submitPopup() : this.saveAnswerForFewType(this.showQuestion, 'nextWithAutoGrade');
                    }, 0);
                } else {
                    this.saveAnswerForFewType(this.showQuestion, 'nextWithAutoGrade');
                }
            } else if (this.checkAutoGradeQns == '0' || this.checkAutoGradeQns == '1') {
                this.updateForNonAutoGradedQns(particularObjectValue);
            } else {
                if (lastQuestion) {
                    this.totalAns.every((items, index) => {
                        // tslint:disable-next-line:no-shadowed-variable
                        const particularObjectValue = items.question_type_id != '24' ? items : items.subQuestions[0];
                        if (particularObjectValue.is_correct == '' || particularObjectValue.is_correct == 'partially-completed') {
                            this.selectedQuestionList(this.totalAns[index], index);
                            return false;
                        }
                        return true;
                    });
                } else {
                    this.selectedQuestionList(this.totalAns[currentIndex + 1], currentIndex + 1);
                }
            }
    }

    checkWhetherSaveIsNeeded(data, index, calledFrom) {
        if (this.needSaveForThisQns) {
            this.saveAnswerForFewType(this.selectedIndexForSameQns, 'qnsNumber', index);
        } else {
            this.needSaveForThisQns = this.totalAns[this.showQuestion]?.question_type_id == 10 || this.totalAns[this.showQuestion].question_type_id == '20' ||
                this.totalAns[this.showQuestion].question_type_id == '40' || this.totalAns[this.showQuestion].question_type_id == '41' ||
                (this.totalAns[this.showQuestion].question_type_id == '24' && this.totalAns[this.showQuestion].subQuestions[0]?.question_type_id == '10');
            this.selectedIndexForSameQns = this.needSaveForThisQns ? this.showQuestion : 0;
            this.selectedQuestionList(data, index, calledFrom);
        }
    }

    saveAnswerForFewType(questionNumber, calledFrom = '', index = 0) {
        if (this.totalAns[questionNumber].question_type_id == '40' || this.totalAns[questionNumber].question_type_id == '41') {
            console.log(this.totalAns[questionNumber].given_answer, 'given_anser');
            console.log(this.totalAns[questionNumber].given_answer[0].isSelected, 'isSelected');
            if (this.totalAns[questionNumber].given_answer[0].isSelected != '' && this.totalAns[questionNumber].given_answer[0].isSelected && (this.graphEdited || calledFrom == 'save')) {
                this.saveGraph(this.totalAns[questionNumber].given_answer[0].isSelected, this.totalAns[questionNumber].editor_key, this.totalAns[questionNumber]);
            }
            this.totalAns[questionNumber].given_answer[0].isSelected = '';
        } else if (this.totalAns[questionNumber].question_type_id == '20') {
            if (this.totalAns[questionNumber].given_answer[0].isSelected1) {
                this.totalAns[questionNumber].given_answer[0].isSelected = this.totalAns[questionNumber].given_answer[0].isSelected1;
            }
        } else if (this.totalAns[questionNumber].question_type_id == '10') {
            for (let j = 0; j < this.totalAns[questionNumber].given_answer.length; j++) {
                if (this.totalAns[questionNumber].given_answer[j].isSelected1) {
                    this.totalAns[questionNumber].given_answer[j].isSelected = this.totalAns[questionNumber].given_answer[j].isSelected1;
                } else {
                    this.totalAns[questionNumber].given_answer[j].isSelected = '';
                }
            }
        } else if (this.totalAns[questionNumber].question_type_id == '24') {
            for (let j = 0; j < this.totalAns[questionNumber].subQuestions.length; j++) {
                if (this.totalAns[questionNumber].subQuestions[j].question_type_id == '10') {
                    for (let k = 0; k < this.totalAns[questionNumber].subQuestions[j].given_answer.length; k++) {
                        if (this.totalAns[questionNumber].subQuestions[j].given_answer[k].isSelected1) {
                            this.totalAns[questionNumber].subQuestions[j].given_answer[k].isSelected = this.totalAns[questionNumber].subQuestions[j].given_answer[k].isSelected1;
                        } else {
                            this.totalAns[questionNumber].subQuestions[j].given_answer[k].isSelected = '';
                        }
                    }
                }
            }
        }
        if (calledFrom == 'qnsNumber') {
            this.needSaveForThisQns = this.totalAns[index]?.question_type_id == 10 || this.totalAns[index].question_type_id == '20' ||
                this.totalAns[index].question_type_id == '40' || this.totalAns[index].question_type_id == '41' ||
                (this.totalAns[index].question_type_id == '24' && this.totalAns[index].subQuestions[0]?.question_type_id == '10');
            this.selectedIndexForSameQns = this.needSaveForThisQns ? index : 0;
            this.selectedQuestionList(this.totalAns[index], index);
        } else if (calledFrom == 'nextWithAutoGrade') {
            const particularObjectValue = this.totalAns[this.showQuestion].question_type_id != '24' ? this.totalAns[this.showQuestion] : this.totalAns[this.showQuestion].subQuestions[0];
            this.pauseTimer();
            particularObjectValue.no_of_attempt = parseInt(particularObjectValue.no_of_attempt) + 1;
            particularObjectValue.is_correct = this.checkCorrectAnswerOrNot(particularObjectValue, 'singleQuestion');
            particularObjectValue.time_taken = this.timeTaken;
            this.saveAnswer('2', 'noExit', true, 'next');
            // this.selectedQuestionList(this.totalAns[questionNumber + 1], questionNumber + 1);
        } else if (calledFrom == 'nextWithNonAutoGraded') {
            const particularObjectValue = this.totalAns[this.showQuestion].question_type_id != '24' ? this.totalAns[this.showQuestion] : this.totalAns[this.showQuestion].subQuestions[0];
            this.pauseTimer();
            particularObjectValue.time_taken = this.timeTaken;
            this.saveAnswer('2', 'noExit', true, 'nextWithNonAutoGraded');
        }
    }

    nextQuestion() {

        if (this.checkAutoGradeQns == '2' && this.serviceNeededOrNot(this.totalAns[this.showQuestion])) {
            document.getElementById("yourTarget").scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start'
            });
            this.saveAnswer('2', 'noExit', true, 'next');
        } else {
            const questionNumber = this.showQuestion;
            if (this.totalAns[questionNumber + 1]) {
                if (this.totalAns[questionNumber]?.question_type_id == '10' || this.totalAns[questionNumber].question_type_id == '20' ||
                    this.totalAns[questionNumber].question_type_id == '40' || this.totalAns[questionNumber].question_type_id == '41' ||
                     (this.totalAns[questionNumber].question_type_id == '24' && this.totalAns[questionNumber].subQuestions[0]?.question_type_id == '10') ) {
                    this.saveAnswerForFewType(questionNumber);
                } else {
                    if (this.checkAutoGradeQns == '0' || this.checkAutoGradeQns == '1') {
                        document.getElementById("yourTarget").scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'start'
                        });
                        this.saveAnswer('2', 'noExit', false, 'next');
                    } else {
                        this.selectedQuestionList(this.totalAns[questionNumber + 1], questionNumber + 1);
                    }
                }
            } else {
                let checkWhetherOtherQuestionCorrectedOrNot = true;
                let particularIndex = 0;
                this.totalAns.every((items, index) => {
                    particularIndex = index;
                    const particularObjectValue = items.question_type_id != '24' ? items : items.subQuestions[0];
                    if (particularObjectValue.is_correct == '' || particularObjectValue.is_correct == 'partially-completed') {
                        checkWhetherOtherQuestionCorrectedOrNot = false;
                        console.log(particularIndex, 'insideEvery');
                        return false;
                    }
                    return true;
                });

                console.log(particularIndex, 'outSideEvey');
                if (!checkWhetherOtherQuestionCorrectedOrNot) {
                    this.selectedQuestionList(this.totalAns[particularIndex], particularIndex);
                } else {
                    this.guard = false;
                    this.route.navigate(['/studentlogin/' + this.contentType.toLowerCase()]);
                }
            }
        }
    }

    async updateForNonAutoGradedQns(data) {
        let answerEntered = false;
        console.log(data, 'data');
        if (data.is_correct == '') {
            if (data.question_type_id == '1' || data.question_type_id == '2' || data.question_type_id == '5' || data.question_type_id == '7'
                || data.question_type_id == '9') {
                answerEntered = !data.given_answer.every((items) => {
                    return items.isSelected == '';
                });
            } else if (data.question_type_id == '10') {
                data.given_answer.every((items) => {
                    if (items.isSelected1) {
                        if (items.isSelected1.trim() != ''){
                            answerEntered = true;
                            return false;
                        }
                    }
                    return true;
                });
            } else if (data.question_type_id == '16') {
                answerEntered = data.answer_shuffled;
            } else if (data.question_type_id == '20') {
                answerEntered = !data.given_answer.every((items) => {
                    return items.isSelected1 == '';
                });
            } else if (data.question_type_id == '40' || data.question_type_id == '41') {
                answerEntered = data.answer_valueEmitted;
            }
            console.log(answerEntered, 'answerEntered');
            data.is_correct = answerEntered ? 'manual' : '';
        }
        let checkAllQnsCorrectedOrNot = true;
        this.totalAns.every((items) => {
            const particularObjectLoopValue = items.question_type_id != '24' ? items : items.subQuestions[0];
            if (particularObjectLoopValue.is_correct == '') {
                checkAllQnsCorrectedOrNot = false;
                return false;
            }
            return true;
        });

        await setTimeout(() => {
            console.log(checkAllQnsCorrectedOrNot, 'checkAllQnsCorrectedOrNot');
            checkAllQnsCorrectedOrNot ? this.submitPopup() : this.saveAnswerForFewType(this.showQuestion, 'nextWithNonAutoGraded');
        }, 500);

    }

    countClicked(event){
        event.stopPropagation();
    }

    scoreRelease() {
        console.log(this.questionData, 'questionData');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            student_id: [this.auth.getSessionData('rista-userid')],
            content_id: this.questionData.content_id,
            class_id: this.getData.class_id,
            release_score: '1'
        };
        this.teacher.releaseScore(data).subscribe((successData) => {
                this.releaseScoreSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    releaseScoreSuccess(successData) {
        if (successData.IsSuccess) {
            console.log(successData, 'release success');
        }
    }

    saveAnnotation() {
        const data = {
            platform: 'web',
            student_id: this.auth.getSessionData('rista-userid'),
            annotation: this.areaInfo,
            content_id: this.getData.content_id,
            class_id: this.getData.class_id,
        };
        this.creator.saveAnnotation(data).subscribe((successData) => {
                this.saveAnnotationSuccess(successData);
            },
            (error) => {
                this.saveAnnotationFailure(error);
            });
    }

    saveAnnotationSuccess(successData) {
    }

    saveAnnotationFailure(error) {
        console.log(error);
    }

    setting() {
        const data = {
            platform: 'web',
            type: 'list',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.common.settingsDetails(data).subscribe((successData) => {
                this.listSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    listSuccess(successData) {
        if (successData.IsSuccess) {
            this.settingList = successData.ResponseObject;
            this.settingList.forEach((val) => {
                if (val.name == 'answer_key_upload' && val.value == '1') {
                    this.showUploadFile = true;
                } else if (val.name == 'answer_key_upload' && val.value == '0') {
                    this.showUploadFile = false;
                }
                if (val.name == 'file_size_restriction') {
                    this.uploadFileSize = val.value;
                }
            });
        }
    }

    encodePdfFileAsURL(event: any) {
        console.log('service called 2');
        const images = [];
        console.log(event.target.files, 'event.target.files');
        const imageLength = event.target.files.length;
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const pdfDetails = event.target.files[i];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const uploadTypeList = event.target.result.split(',');
                images.push({
                    image: uploadTypeList[1],
                    size: pdfDetails.size,
                    type: pdfDetails.type,
                    name: pdfDetails.name
                });
                const pic = pdfDetails.type.split('/');
                if (pic[1] == 'pdf') {
                    if (imageLength == images.length) {
                        if (this.uploadFileSize != 0) {
                            const bytes = images[0].size;
                            const mb = bytes / (1024 * 1024);
                            if (mb <= this.uploadFileSize) {
                                this.onUploadKYCFinishedpdf(images);
                            } else {
                                const limit = 'Upload PDF exceeds limit' + ' (' + this.uploadFileSize.toString() + 'MB' + ')';
                                this.toastr.info(limit);
                            }
                        } else {
                            this.onUploadKYCFinishedpdf(images);
                        }
                    }
                } else {
                    this.toastr.error('PDF are the required file format');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }

    }

    onUploadKYCFinishedpdf(getUrlEdu) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: getUrlEdu,
            uploadtype: 'offlineanswer'
        };

        this.creator.fileUpload(data).subscribe(
            (successData) => {
                this.pdfuploadSuccess(successData);
            },
            (error) => {
                this.pdfuploadFailure(error);
            }
        );
    }

    pdfuploadSuccess(successData) {
        if (successData.IsSuccess) {
            this.answerPdf = [...this.answerPdf, ...successData.ResponseObject.imagepath];
        }
    }

    pdfuploadFailure(error) {
        console.log(error);
    }

    close() {
        this.modalRef?.close();
    }

    closeGraph(id, index) {
        this.totalAns[id].section[index].student_roughdata = this.totalAns[id].section[index].student_roughdata1;
        this.modalRef1.close();
    }

    backbutton() {
        if (this.contentType == 'Assessment') {
            this.route.navigate(['/studentlogin/assessment']);
        } else {
            this.route.navigate(['/studentlogin/assignment']);
        }
    }

    onSave() {
        this.modalRef.close();
    }

    otherlink() {
        this.modalRef = this.modalService.open(this.link);
    }

    openWorkArea(item, i, j) {
        if (item != '') {
            this.workAnnotate = [...item.workarea];
        }
        this.workAreaId = i;
        this.workAreaIndex = j;
        document.body.style.overflow = 'hidden !important';
        this.cdr.detectChanges();
        console.log(document.body.style.overflow, 'overflow');
        this.modalRef = this.modalService.open(this.workArea, {size: 'xl', backdrop: 'static'});
    }

    getWorkAreaAnnotation(event) {
        console.log(event, 'workAnnotateVlaue');
        this.workAnnotate = event;
        console.log(this.workAnnotate, 'work annotate');
    }

    closeWorkArea() {
        let i = this.workAreaId;
        let j = this.workAreaIndex;
        if (this.totalAns[i].section[j].workarea !== this.workAnnotate) {
            this.totalAns[i].section[j].workarea = [...this.workAnnotate];
            this.totalAns[i].section[j].answer_attended = '1';
        }
        this.close();
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

    selectedQuestionList(data, index, calledFrom?) {
        console.log(data, 'datas');
        this.pauseTimer();
        this.timeTaken = 0;
        this.correctAnswer = true;
        this.tryAgainButtonEnabled = false;
        this.showQuestion = index;
        const particularObjectValue = data.question_type_id != '24' ? data : data.subQuestions[0];
        if (this.getData.student_content_status == '1' || this.getData.student_content_status == '2') {
            if (particularObjectValue.time_taken == '0') {
                this.timeTaken = 0;
                this.startTimer();
            } else {
                this.timeTaken = particularObjectValue.time_taken;
                this.checkAutoGradeQns != '2' ? this.startTimer() : '';
                if (particularObjectValue.question_type_id == '9' && particularObjectValue.is_correct != 'partially-completed') {
                    this.cfsPatchDropdown();
                }
            }
        } else {
            this.timeTaken = particularObjectValue.time_taken != '0' && particularObjectValue.time_taken != '' && particularObjectValue.time_taken
                ? particularObjectValue.time_taken : 0;
        }
        this.cdr.detectChanges();
        if (calledFrom != 'questionList') {
            document.getElementById("yourTarget").scrollIntoView({
                behavior: "smooth",
                block: 'start',
                inline: 'start'
            });
        }
        console.log(this.showQuestion, 'showQuestion');
    }

    public onScroll(): void {
        var left = this.scrollContent.nativeElement.scrollLeft;
        var sWidth = this.scrollContent.nativeElement.scrollWidth;
        var oWidth = this.scrollContent.nativeElement.offsetWidth;
        // Left arrow
        if (left === 0) {
            this.hideArrow(this.leftArrow);
        } else {
            this.showArrow(this.leftArrow);
        }
        // Right arrow
        const total = oWidth + left;
        if (total >= sWidth) {
            this.hideArrow(this.rightArrow);
        } else {
            this.showArrow(this.rightArrow);
        }
    }

    public onClickScrollRight(): void {
        this.scrollTo('+', this.distance);
    }

    public onClickScrollLeft(): void {
        this.scrollTo('-', this.distance);
    }

    // Helpers

    private showArrow(arrow: ElementRef): void {
        arrow.nativeElement.classList.remove('hide');
    }

    private hideArrow(arrow: ElementRef): void {
        arrow.nativeElement.className += ' hide';
    }

    private scrollTo(operator: string, distance: number): void {
        let operators = {
            '+': (a, b) => {
                return a + b;
            },
            '-': (a, b) => {
                return a - b;
            },
        };
        let op = operators[operator];
        console.log(op, 'op');
        console.log(distance, 'sitant');
        console.log(this.scrollContent, 'content')
        // this.scrollContent = document.getElementById('scrollContent');
        console.log(this.scrollContent.nativeElement.scrollLeft, 'this.scrollContent.nativeElement.scrollLeft');
        console.log(op(this.scrollContent.nativeElement.scrollLeft, distance), 'opDistantce');
        this.scrollContent.nativeElement.scrollTo(
            {
                left: op(this.scrollContent.nativeElement.scrollLeft, distance),
                behavior: 'smooth'
            });
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
