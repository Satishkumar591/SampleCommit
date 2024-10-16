import {
    Component,
    ElementRef,
    OnInit,
    TemplateRef,
    ViewChild,
    HostListener,
    OnDestroy, ChangeDetectorRef, OnChanges, SimpleChanges, Input, SecurityContext
} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ClassService} from '../../../shared/service/class.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import * as $ from 'jquery';
import {CreatorService} from '../../../shared/service/creator.service';
import {ValidationService} from '../../../shared/service/validation.service';
import * as inlineEditor from '../../../../assets/ckeditor5/build/ckeditor.js';
import {NavService} from '../../../shared/service/nav.service';
import {parse, stringify} from 'flatted';
import {GraphComponentComponent} from '../../auth/graph-component/graph-component.component';
import {ViewEncapsulation} from '@angular/core';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {TreeviewContentfolderComponent} from '../../auth/treeview-contentfolder/treeview-contentfolder.component';

@Component({
    selector: 'app-create-assessment',
    templateUrl: './create-assessment.component.html',
    styleUrls: ['./create-assessment.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateAssessmentComponent implements OnInit, OnDestroy {

    // public Editor = ClassicEditor;


    public Editor = inlineEditor;
    public ckData: any;
    public inlineEditor = inlineEditor;


    public model = {
        editorData: ''
    };
    editorConfig: any = {
        toolbar: {
            items: [
                "MathType", "ChemType", "alignment:left", "alignment:right", "alignment:center", "alignment:justify", "alignment", "undo", "redo", "blockQuote", "bold", "imageTextAlternative", "link", "ckfinder", "code", "codeBlock", "selectAll", "fontBackgroundColor", "fontColor", "fontFamily", "fontSize", "heading", "highlight:yellowMarker", "highlight:greenMarker", "highlight:pinkMarker", "highlight:blueMarker", "highlight:redPen", "highlight:greenPen", "removeHighlight", "highlight", "horizontalLine", "htmlEmbed", "uploadImage", "imageUpload", "insertImage", "imageInsert", "resizeImage:original", "resizeImage:25", "resizeImage:50", "resizeImage:75", "resizeImage", "imageResize", "imageStyle:full", "imageStyle:side", "indent", "outdent", "italic", "linkImage", "numberedList", "bulletedList", "mediaEmbed", "pageBreak", "removeFormat", "specialCharacters", "restrictedEditingException", "strikethrough", "subscript", "superscript", "insertTable", "tableColumn", "tableRow", "mergeTableCells", "tableCellProperties", "tableProperties", "textPartLanguage", "todoList", "underline"
            ]
        },
        image: {
            toolbar: [
                'imageStyle:full',
                'imageStyle:side',
                '|',
                'imageTextAlternative'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
        // This value must be kept in sync with the language defined in webpack.config.js.
        language: 'en'
    };
    editorConfigAlt = {
        image: {
            toolbar: [
                'imageStyle:full',
                'imageStyle:side',
                '|',
                'imageTextAlternative'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
        // This value must be kept in sync with the language defined in webpack.config.js.
        language: 'en'
    };


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
    public scale: any;
    public globalPdfViewerPath: any;
    public showAnswerKey = false;
    public textPathData: any;
    public graphEditorAnswerValue: any;
    public ExplanationPopupValue: any;
    public queNum: any;
    public sliceNo: any;
    public showInput: any;
    public offsetter: any;
    public mathVal: any;
    public mathInputEvent: any;
    public ransom: any;
    public textValue: any;
    public inputElement: any;
    public selectedElement: any;
    public InitialArrayLength: any;
    public questionId: any;
    public validated: any;
    public graphShow: any;
    public editingTextValue: any;
    public pageVariable: any = 1;
    public deleteAnnatation: boolean;
    public mathDelayer: boolean = false;
    public eraserActive = false;
    public mathEditor: boolean;
    public headingSame = false;
    public headingEmpty = false;
    public functionCalled = false;
    public pdfChanged = false;
    // public allowChanged = false;
    public graphDialog = false;
    public multiDialog = false;
    public trueDialog = false;
    public choiceDialog = false;
    public entryDialog = false;
    public essayDialog = false;
    public numericDialog = false;
    public blankDialog = false;
    public quesNoInvalid = false;
    public editTextInput = false;
    public editMathInput = false;
    public editMathValue: any;
    public valueChanged: boolean;
    cnv;
    pdfBody;
    ctx;
    element = null;
    dataPageNumber: number;

    areaInfo: AreaInfo[] = [];
    indexOfPage: number = 1;
    showPopup: boolean = false;
    listRectangleId: string = '';

  public multiform: FormGroup;
  public bulkQuestionForm: FormGroup;
  public graphform: FormGroup;
  public repeatlink: FormArray;
  public allowSelect: boolean;
  public icons: any;
  public subtype: any;
  public pdfTemplate: any;
  public count = 0;
  public selectderArray = [];
  public webhost: any;
  public closeResult: string;
  public options: any;
  public selectedDragSection: any;
  public choices: any = [];
  public hide: boolean;
  public changeInput: boolean = false;
  public quesNoChanged: boolean = false;
  public isBulkUpload: boolean = false;
  public isPdfAvailable: boolean = false;
  public sliced: boolean = false;
  public schoolId: any;
  public gradeData: any;
  public subjectData: any;
  public rectElem: any;
  public svgColor: any;
  public svgId: any;
  public zoom = 1.0;
  public totalPdfPage = 1;
  private modalRef: NgbModalRef;
  // private dialogRef: D;
    private cx: CanvasRenderingContext2D;
    public repeatplus: FormArray;
    public repeatchoose: FormArray;
    public repeatentry: FormArray;
    public repeatessay: FormArray;
    public repeatnumeric: FormArray;
    public repeattotalplus: FormArray;
    public repeatblanks: FormArray;
    // public repeatgraph: FormArray;
    public alphabets: any;
    public optradio: boolean;
    public editData: any;
    public getTag: any = [];
    public getNewlinks: any = [];
    public detailData: any = [];
    public secHeadingArray: any = [];
    public gradeSplit: any = [];
    public subjectSplit: any = [];
    public uploadType: any;
    public countList: any;
    public slicedQuesNo: any = 0;
    public sectionNo: any;
    public reloadQues: any;
    public sectionCount: any = 0;
    public spanQuesVal: any;
    public tagArray: any;
    public subQuestion: any = [];
    public subQuestionMulti: any = [];
    public subQuestionChoice: any = [];
    public subQuestionChoose: any = [];
    public subQuestionEntry: any = [];
    public subQuestionEssay: any = [];
    public subQuestionNumeric: any = [];
    public subQuestionGraph: any = [];
    public subQuestionBlanks: any = [];
    public itemsList: any = [];
    public totalsub: any = [];
    public fillInArray: any = [];
    public randomValue: any = [];
    random: any = '0';
    public teachername: any;
    public delSection: any;
    public imagepath: any;
    public imagepaththumb: any;
    public getpdf: any;
    public showpdf: any;
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
    public openmenu: boolean;
    public dragQuestionsList: any = [];
    public textFontSize: any;
    public originalSize = false;
    public dragButton: any;
    public assessmentType: any;
    public draftAdd = 'update';
    public submitType: any;
    public markType: any;
    public editQuesNo: any;
    public editIndexValue: any;
    public filterListChoices: any;
    public selectedPageAnnatation: any;
    public deleteID: any;
    public disable: boolean;
    public currentPage: number = 1;
    public selectedQueNum: number;
    public itemSelect: any = [];
    public redoListArray: any = [];
    public numericQuestion: any = [];
    public numericAnswer: any = [];
    public numericExplain: any = [];
    public graphQuestion: any = [];
    public teacherVersion: any = [];
    public graphBoardValue: any;
    public resourceArray = [];
    public roleid: any;
    public blankValid = true;
    public pdfName: any = '';
    public deleteFillBlanks: boolean = false;
    public customPdfLoader: boolean = true;
    public isEditLink: boolean = false;
    public linksType = ['video', 'audio', 'document', 'ppt', 'Others'];
    public resourceLinks = [];
    public editSourceLink: boolean = false;
    public editLinkVal = '';
    public pdfpath: any;
    public pdfpaththumb: any;
    public response: any;
    public answerpdfTemplate: any;
    public answerpdfpath: any = [];
    public contentName: any;
    public searchTime: any;
    public viewContent: boolean = false;
    public allowEdit: boolean = false;
    public classDetails: any = [];
    public contentCreatedForm = '';
    public assignData: any;
    bulkFormData: any;
    bulkAddingCount = 0;
    showGraph = true;
    public showPage = false;
    public pdfWidth = 0;
    public pdfHeight = 0;

    @ViewChild('pdfPage') pdfPage: ElementRef<HTMLElement>;
    @ViewChild('canvas', {static: false}) canvas: ElementRef;
    @ViewChild('pencilCanvas', {static: false}) pencilCanvas: ElementRef;
    @ViewChild('multiChoice') multiChoice: TemplateRef<any>;
    @ViewChild('fillIn') fillIn: TemplateRef<any>;
    @ViewChild('dropdown') dropdown: TemplateRef<any>;
    @ViewChild('trueFalse') trueFalse: TemplateRef<any>;
    @ViewChild('essay') essay: TemplateRef<any>;
    @ViewChild('delete') deleted: TemplateRef<any>;
    @ViewChild('numeric') numericData: TemplateRef<any>;
    @ViewChild('graph') graph: TemplateRef<any>;
    @ViewChild('viewGraph') viewGraph: TemplateRef<any>;
    @ViewChild('deleteAlert') deleteAlert: TemplateRef<any>;
    @ViewChild('deleteSectionPopup') deleteSectionPopup: TemplateRef<any>;
    @ViewChild('deleteSvgDraw') deleteSvgDraw: TemplateRef<any>;
    @ViewChild('class') deleteClass: TemplateRef<any>;
    @ViewChild('viewExplain') viewExplain: TemplateRef<any>;
    @ViewChild(GraphComponentComponent) childGraph: GraphComponentComponent;
    @ViewChild('viewPdf') viewPdf: TemplateRef<any>;
    @ViewChild('uploadPdf') uploadPdf: TemplateRef<any>;
    @ViewChild('mathShow') mathShow: TemplateRef<any>;
    @ViewChild('addBulk') addBulk: TemplateRef<any>;
    @ViewChild('attachmentsnew') attachmentsnew: any;
    @ViewChild('attachments1') attachment1: any;
    @ViewChild('attachments2') attachment2: any;
    @ViewChild('assignContentToClass') assignContentToClass: TemplateRef<any>;
    @ViewChild('assignTemplate') assignTemplate: TemplateRef<any>;
    @ViewChild(TreeviewContentfolderComponent, {static: false}) treeviewCompoent: TreeviewContentfolderComponent;


    ///
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        let svg = document.getElementsByTagName('rect');
    }

    constructor(public auth: AuthService, public creator: CreatorService,
                public activateRoute: ActivatedRoute, private formBuilder: FormBuilder, public newSubject: NewsubjectService,
                public sanitized: DomSanitizer, public confi: ConfigurationService,
                private modalService: NgbModal, public classService: ClassService,
                public toastr: ToastrService, public common: CommonService,
                private cdr: ChangeDetectorRef,
                public validationService: ValidationService, public router: Router, public navServices: NavService) {
        this.getIcons();
        this.mathEditor = false;
        this.roleid = this.auth.getSessionData('rista-roleid');
        this.activateRoute.params.forEach((params) => {
            this.assessmentType = params.type;
        });
        this.classList(1);
        this.teachername = this.auth.getSessionData('rista-firstname') + ' ' + this.auth.getSessionData('rista-lastname');
        if (this.assessmentType == 'add') {
            this.showdropdown = false;
            this.dragCount = [];
            this.getpdf = JSON.parse(this.auth.getSessionData('pdf'))[0];
            this.resourceLinks = this.getpdf.links;
            console.log(this.getpdf, 'getpdf')
            this.areaInfo = [];
            this.showPage = true;
        } else if (this.assessmentType == 'edit') {
            const getAnnotation = JSON.parse(this.auth.getSessionData('rista-editor'));
            this.listDetails(getAnnotation);
            // this.allowChanged = true;
        }
        this.uploadType = this.auth.getSessionData('rista-upload-type');
        this.getlinks = JSON.parse(this.auth.getSessionData('links'));
        this.hide = true;
        this.valueChanged = false;
        this.svgColor = '#ff0000';
        this.disable = true;
        this.showInput = true;
        this.savaText = false;
        this.queDrag = false;
        this.deleteAnnatation = false;
        this.textFontSize = '16';
        this.queNum = [];
        this.schoolId = JSON.parse(this.auth.getSessionData('rista_data1'));
        this.webhost = this.confi.getimgUrl();
        this.strPath = '';
        this.multiform = this.formBuilder.group({
            classname: ['', Validators.required],
            tname: this.teachername,
            head: '',
            index: '',
            option: ['1', Validators.required],
            description: '',
            resourcesLink: '',
            tag: '',
            grade: ['', Validators.required],
            subject: ['', Validators.required],
            downloadContent: '',
            repeatlink: this.formBuilder.array([this.createlink()]),
            repeatplus: this.formBuilder.array([this.truelink()]),
            repeatblanks: this.formBuilder.array([this.createblanks()]),
            totalrepeatplus: this.formBuilder.array([this.addlink()]),
            repeatchoose: this.formBuilder.array([this.createchoose()]),
            repeatentry: this.formBuilder.array([this.createentry()]),
            repeatessay: this.formBuilder.array([this.createessay()]),
            repeatnumeric: this.formBuilder.array([this.createnumeric()]),
        });
        this.graphform = this.formBuilder.group({
            head: '',
            index: '',
            answer: '',
            question: '',
            explain: '',
            answerId: '0',
            page: '0',
            autograde: false,
            points: ['1', Validators.required],
            editorAnswer: ''
        });
        this.bulkQuestionForm = this.formBuilder.group({
            noOfQuestions:  ['', Validators.required],
            section: this.sectionCount,
            sectionName: '',
            questionType: [null, Validators.required]
        });
        this.alphabets = [];
        this.buffer = [];

        for (var i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
            this.alphabets.push(String.fromCharCode(i));
        }
        this.itemsList = [{value: 'true'},
            {value: 'false'},
        ];
    }

    ngOnInit(): void {
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);
        if (this.assessmentType == 'edit') {
        } else {
            this.multiform.controls.classname.patchValue('');
            this.multiform.controls.description.patchValue('');
            this.multiform.controls.resourcesLink.patchValue('');
            this.multiform.controls.tag.patchValue('');
            this.multiform.controls.grade.patchValue('');
            this.multiform.controls.subject.patchValue('');
            if (this.auth.getRoleId() == '6') {
                this.multiform.controls.option.patchValue('4');
            } else {
                this.multiform.controls.option.patchValue('1');
            }
        }
        this.openmenu = true;
        // this.creator.changeViewList(this.openmenu);
        // this.navServices.collapseSidebar = true;
        this.gradeList();
        this.subjectList();
        this.classList(1);
        this.preventScroll();
        this.contentCreatedForm = this.auth.getSessionData('rista-assignedForm');
    }


    ngOnDestroy(): void {
        this.allowScroll();
    }

    onEditorReady(event: any): void {
        console.log(Array.from(event.ui.componentFactory.names()));

        const toolbarItems = Array.from(event.ui.componentFactory.names());
        console.log(toolbarItems, 'toolbarss');
        // // this.editorConfig.toolbar.items = [];
        // console.log(this.editorConfig.toolbar.items ,'item')
        // toolbarItems.forEach((item) => {
        //     console.log(item ,'item')
        //     this.editorConfig.toolbar.items.push(item);
        // });
        // console.log(this.editorConfig);
    }

    subCkedi() {

        const a = document.getElementById('ckEditorVal')
        const b = document.getElementById('ckEditorVal').innerHTML;
        console.log(a, 'a');
        console.log(b, 'a');
        console.log(this.model.editorData, 'dataa');
    }

    ////Annatation  Start///

    onDrop(event) {
        console.log(event);
    }


    incrementZoom(amount: number) {
        this.zoom += amount;
    }

    incrementPage() {
        if (this.pageVariable != this.totalPdfPage) {
            this.pageVariable += 1;
        }
    }

    decrementPage() {
        if (this.pageVariable > 1) {
            this.pageVariable -= 1;
        }
    }

    tools(type, pointerType) {
        this.elem.style.cursor = pointerType;
        if (this.shapesType === type) {
            this.shapesType = '';
            this.allowScroll();
            if (document.getElementById("customArea") && this.shapesType != 'text') {
                document.getElementById("customArea").remove();
            }
            this.showInput = true;
            this.editTextInput = false;
        } else {
            this.shapesType = type;
            if (document.getElementById("customArea") && this.shapesType != 'text') {
                document.getElementById("customArea").remove();
            }
            this.showInput = true;
            this.editTextInput = false;
            // this.elem.style.cursor = pointerType;
            this.preventScroll();

        }
        // this.shapesType = type;
        this.elem.style.cursor = pointerType;
        // document.getElementById("customText").remove();
    }

    callBackFn(pdf: any) {
        this.totalPdfPage = pdf._pdfInfo.numPages;
        this.customPdfLoader = false;
        this.allowScroll();
        // do anything with "pdf"
    }

    onerror(error) {
        this.customPdfLoader = false;
        this.toastr.error(error.message);
    }

    mouseOut(event) {
        this.mouseDownFlag = false;
        this.buffer = [];
        this.rect.d = this.strPath;
        this.rect.text = this.textValue;
        if (this.shapesType == 'rect') {
            if (this.rect.x1 !== 0 && this.rect.x2 !== this.rect.x1) {
                this.save();
            }
        } else {
            // if(this.rect.x1 !== 0 && this.rect.x1 != this.rect.x2){
            if (this.rect.x1 !== 0 && this.rect.x2 !== 0) {
                this.save();
            }
        }
    }

    mouseOver(event) {
        const split = event.target.id.split('-');
        if (split[0] == 'text' && this.shapesType != 'eraser') {
            event.target.style.cursor = 'move';
        } else if (this.shapesType == 'eraser') {
            event.target.style.cursor = 'default';
        }
    }

    mouseEnter() {
        if (document.getElementById("customText") && this.shapesType == 'text') {
            document.getElementById("customText").focus();
        }
    }

    getMousePosition(evt) {
        if (evt.target.tagName != 'DIV') {
            let CTM;
            console.log(evt, 'target files');
            if (evt.target.tagName == 'svg') {
                CTM = evt.target.getScreenCTM();
            } else {
                // const element = this.getParentRecurrsive(evt.target, 'svg');
                const svgElem = this.getParentRecurrsive(evt.target, 'svg');
                CTM = svgElem.getScreenCTM();
            }
            // for (let i = 0; i < evt.path.length; i++) {
            //
            // }
            if (CTM != undefined) {
                return {
                    x: (evt.clientX - CTM.e) / CTM.a,
                    y: (evt.clientY - CTM.f) / CTM.d
                };
            }
        } else {
            this.mouseDownFlag = false;
            this.offsetter = null;
            this.areaInfo.forEach((val) => {
                if (this.selectedElement.id == val.rectangleId) {
                    val.rect.x1 = this.selectedElement.x.baseVal.value;
                    val.rect.y1 = this.selectedElement.y.baseVal.value;
                }
            });
            this.selectedElement = null;
        }
    }

    mathValue(event) {
        this.mathVal = event.content;
    }

    mathAnnotation() {
        this.close();
        if (this.mathVal != '') {
            let rectId;
            this.element = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            if (this.editMathInput) {
                this.element.id = this.editMathValue.rectangleId;
                this.element.setAttribute('x', this.editMathValue.rect.x1);
                this.element.setAttribute('y', this.editMathValue.rect.y1);
            } else {
                rectId = Math.random().toFixed(6);
                this.element.id = 'math-' + rectId;
                this.element.setAttribute('x', this.textPosition.x);
                this.element.setAttribute('y', this.textPosition.y);
            }
            this.element.setAttribute('fill', this.svgColor);
            this.element.setAttribute('stroke-width', 'none');
            this.element.setAttribute('stroke', 'none');
            this.element.style.fontSize = this.textFontSize + 'px';
            this.element.style.width = 'auto';
            this.element.style.height = '20px';
            this.element.style.overflow = 'visible';
            this.element.style.cursor = 'move';
            const userInput: any = this.sanitized.sanitize(SecurityContext.HTML, this.sanitized.bypassSecurityTrustHtml(this.mathVal));
            const mathBody = document.createElement('DIV');
            if (this.editMathInput) {
                mathBody.id = this.editMathValue.rectangleId;
            } else {
                mathBody.id = 'math-' + rectId;
            }
            mathBody.innerHTML = userInput;
            this.element.appendChild(mathBody);
            if (this.editMathInput) {
                document.getElementById(this.editMathValue.rectangleId).remove();
                this.element.children[0].children.forEach((value) => value.id = this.editMathValue.rectangleId);
                document.getElementById(this.editMathValue.pageNumber).appendChild(this.element);
                this.areaInfo.forEach((value) => {
                    if (value.rectangleId == this.editMathValue.rectangleId) {
                        value.rect.text = this.mathVal;
                    }
                });
                console.log(this.areaInfo, 'final get');
            } else {
                this.rect.x1 = this.textPosition.x;
                this.rect.y1 = this.textPosition.y;
                this.rect.text = this.mathVal;
                this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                const path = this.composedPath(this.mathInputEvent);
                this.element.children[0].children.forEach((value) => value.id = 'math-' + rectId);
                path.find(p => p.className == 'page').children[1].appendChild(this.element);
                this.save();
            }
            this.mathVal = '';
            this.element = null;
            this.editMathInput = false;
            this.editMathValue = '';
            this.clickEvent();
        }
        this.eraserActive = false;
    }

    mouseEvent(event) {
        // eraser code open//
        if (event.type === 'mousemove' && this.shapesType == 'eraser') {
            if (this.eraserActive) {
                event.preventDefault();
                let math = null;
                if (event.target.tagName == 'span' || event.target.tagName.toLowerCase() == 'p') {
                    math = this.getParentRecurrsive(event.target, 'foreignObject');
                }
                // if (event.path != undefined) {
                //     for (let i = 0; i < event.path.length; i++) {
                //         if (event.path[i].tagName == 'foreignObject') {
                //             math = document.getElementById(event.path[i].id);
                //         }
                //     }
                // }
                console.log(math, 'math val');
                if ((document.getElementById(event.target.id) || math != null) && event.target.tagName != 'DIV') {
                    let id;
                    if (math != null) {
                        id = math;
                    } else {
                        id = event.target.id;
                    }
                    for (let i = 0; i < this.areaInfo.length; i++) {
                        if (this.areaInfo[i].rectangleId == id && this.areaInfo[i].isTeacherCorrection) {
                            this.areaInfo.splice(i, 1);
                            document.getElementById(id).remove();
                        }
                    }
                }
            }
        }
        // eraser code close//

        ////drag and drop text opens////

        if (event.type == 'mousedown' && this.shapesType != 'eraser' && !this.editTextInput) {
            this.textPathData = null;
            console.log(event, 'press event');
            // if (event.target.parentElement.tagName == 'foreignObject') {
            //     this.textPathData = document.getElementById(event.target.parentElement.id);
            // }
            let id;
            if (event.target.tagName != 'svg') {
                id = this.getParentRecurrsive(event.target, 'foreignObject');
                this.textPathData = document.getElementById(id);
            }
            // if (event.path != undefined) {
            //     for (let i = 0; i < event.path.length; i++) {
            //         if (event.path[i].tagName == 'foreignObject') {
            //             // let data = event.path[i];
            //             this.textPathData = document.getElementById(event.path[i].id);
            //             console.log(this.textPathData, 'event.target.id');
            //         }
            //     }
            // }
            console.log(id, 'id')
            this.areaInfo.forEach((value) => {
                if (value.rectangleId == this.textPathData?.id) {
                    if (value.isTeacherCorrection) {
                        this.selectedElement = this.textPathData;
                        this.selectedElement.style.cursor = 'move';
                        this.offsetter = this.getMousePosition(event);
                        this.offsetter.x -= parseFloat(this.selectedElement.getAttributeNS(null, "x"));
                        this.offsetter.y -= parseFloat(this.selectedElement.getAttributeNS(null, "y"));
                        this.mouseDownFlag = true;
                    }
                }
            });
        }

        //////drag and drop closes///

        if (event.type === 'click' && this.shapesType != 'eraser') {
            this.dragpaths = this.composedPath(event.target);
            const drageventPath = this.dragpaths?.find(p => p.className == 'page');
        }


        if (this.queDrag) {
            // console.log($('#drag' + this.selectedQueNum).length, 'length')

            if ($('#' + this.selectedDragSection + 'drag' + this.selectedQueNum).length == 0) {
                // Exists.
                this.dragpaths = this.composedPath(event.target);
                let drageventPath = this.dragpaths.find(p => p.className == 'page');

                if (drageventPath) {
                    console.log(drageventPath.getAttribute('data-page-number'), 'dragenvrfrf');
                    let num = drageventPath.getAttribute('data-page-number');
                    this.dragPageNumber = parseInt(num);
                    // get id of page
                    let dragtoDrawRectangle = document.getElementById('pdf-page').getElementsByTagName('svg');
                    for (let i = 0; i < dragtoDrawRectangle.length; i++) {
                        if (dragtoDrawRectangle[i].id == num) {
                            this.svgId = i;
                        }
                    }
                    let dragpageOffset = dragtoDrawRectangle[this.svgId].getBoundingClientRect();
                    this.pagePosition = {
                        x: dragpageOffset.left,
                        y: dragpageOffset.top
                    };

                    this.lastMousePosition = {
                        x: event.clientX - this.pagePosition.x,
                        y: event.clientY - this.pagePosition.y
                    }
                    if (event.type === 'mousemove') {

                        // document.getElementById(this.selectedQueNum + 'dropId').style.position = 'fixed';
                    }
                    if (event.type == 'mouseup') {
                        document.getElementById(this.selectedQueNum + 'dropId' + this.selectedDragSection).style.position = 'absolute';
                        this.queNum.push(event.target.innerText);
                        document.getElementById(this.selectedQueNum + 'dropId' + this.selectedDragSection).style.transform = 'none';
                        this.dragButton = document.createElement('span');
                        this.dragButton.id = this.selectedDragSection + 'drag' + this.selectedQueNum;
                        this.dragButton.style.position = 'absolute';
                        this.dragButton.style.left = this.lastMousePosition.x + 'px';
                        this.dragButton.style.top = this.lastMousePosition.y + 'px';
                        this.dragButton.style.fontSize = '14px';
                        this.dragButton.style.minWidth = '27px';
                        this.dragButton.style.background = "#e6baea";
                        this.dragButton.style.padding = "6px";
                        this.dragButton.style.borderRadius = "4px";
                        this.dragButton.style.textAlign = "center";
                        this.dragButton.innerHTML = this.selectedQueNum;
                        this.dragQuestionsList.push({
                            id: this.selectedQueNum + 'dropId' + this.selectedDragSection,
                            text: this.selectedQueNum,
                            pageNumber: this.dragPageNumber,
                            dragButton: {
                                id: this.selectedDragSection + 'drag' + this.selectedQueNum,
                                x: this.lastMousePosition.x,
                                y: this.lastMousePosition.y
                            }
                        });
                        this.dragpaths.find(p => p.className == 'page').appendChild(this.dragButton);
                        this.queDrag = false;
                    }
                }
            } else if ($('#' + this.selectedDragSection + 'drag' + this.selectedQueNum).length > 0) {
                const dragList = [];
                this.dragQuestionsList.forEach((item) => {
                    if (item.id !== this.selectedQueNum + 'dropId' + this.selectedDragSection) {
                        dragList.push(item);
                    }
                });
                this.dragQuestionsList = dragList;
                let elem = document.getElementById(this.selectedDragSection + 'drag' + this.selectedQueNum);
                elem.remove();
            }
        }

        if (event.type == 'mousedown' && this.shapesType != 'text' && this.shapesType != 'eraser' && this.editTextInput) {
            let path = this.composedPath(event.target);
            this.appendTextAreaInput(event, path);
        }

        if (!this.showPopup && this.shapesType != undefined && this.shapesType != '' && this.shapesType != 'select' && this.selectedElement == null && !this.queDrag) {

            if (event.type === 'mousemove' && this.shapesType != 'eraser' && this.shapesType != 'text') {
                event.preventDefault();
                this.mousePosition = {
                    x: event.clientX - this.pagePosition.x,
                    y: event.clientY - this.pagePosition.y,
                };
                if (this.mouseDownFlag) {
                    let width = (this.mousePosition.x / this.scale) - (this.lastMousePosition.x / this.scale);
                    let height = (this.mousePosition.y / this.scale) - (this.lastMousePosition.y / this.scale);
                    this.rect = {
                        x1: (this.lastMousePosition.x / this.scale),
                        y1: (this.lastMousePosition.y / this.scale),
                        x2: (this.mousePosition.x / this.scale),
                        y2: (this.mousePosition.y / this.scale),
                        d: '',
                        text: '',
                        width: width,
                        height: height
                    };

                    if (this.element != null) {
                        this.element.style.width = width + 'px';
                        this.element.style.height = height + 'px';
                        if (this.shapesType != 'path') {
                            if (this.rect.width < 0 || this.rect.height < 0) {
                                if (document.getElementById(this.element.id)) {
                                    document.getElementById(this.element.id).remove();
                                }
                            } else {
                                document.getElementById('pdf-page').getElementsByTagName('svg')[this.svgId].appendChild(this.element);
                            }
                        } else if (this.shapesType == 'path') {
                            document.getElementById('pdf-page').getElementsByTagName('svg')[this.svgId].appendChild(this.element);
                        }
                    }
                    if (this.shapesType == 'path') {
                        this.mousePosition = {
                            x: (event.clientX - this.pagePosition.x) / this.scale,
                            y: (event.clientY - this.pagePosition.y) / this.scale,
                        };
                        this.appendToBuffer(this.mousePosition);
                        this.updateSvgPath();
                    }
                }
            }

            if (event.type === 'mousedown' && event.target.tagName != 'DIV') {
                this.eraserActive = true;
                this.mouseDownFlag = true;
                let path = this.composedPath(event.target);
                let eventPath = path.find(p => p.className == 'page');
                let toDrawRectangle = document.getElementById('pdf-page').getElementsByTagName('svg');

                if (typeof eventPath !== 'undefined') {
                    this.dataPageNumber = parseInt(eventPath.getAttribute('data-page-number')); // get id of page
                    let toDrawRectangle = document.getElementById('pdf-page').getElementsByTagName('svg');
                    for (let i = 0; i < toDrawRectangle.length; i++) {
                        if (toDrawRectangle[i].id == this.dataPageNumber?.toString()) {
                            this.svgId = i;
                        }
                    }
                    const pageOffset = toDrawRectangle[this.svgId].getBoundingClientRect();
                    console.log(pageOffset, 'pageofff');
                    this.pagePosition = {
                        x: pageOffset.left,
                        y: pageOffset.top
                    };

                    this.lastMousePosition = {
                        x: event.clientX - this.pagePosition.x,
                        y: event.clientY - this.pagePosition.y
                    }


                    // let rectId = document.getElementById('pdf-page').getElementsByTagName(this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType).length + 1;
                    // let rectId = document.getElementById('pdf-page').getElementsByTagName(this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType).length + 1;

                    if (this.shapesType != 'text' && this.shapesType != 'math') {
                        this.element = document.createElementNS("http://www.w3.org/2000/svg", this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType);
                        this.element.setAttribute("stroke-width", "2");
                        this.element.setAttribute("stroke", this.svgColor);
                        this.element.setAttribute("fill", "none");
                    }


                    if (this.shapesType == 'rect') {
                        // let rectId = document.getElementById('pdf-page').getElementsByTagName(this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType).length + 1;
                        const rectId = Math.random().toFixed(6);

                        this.element.id = 'rect-' + rectId;
                        this.element.setAttribute("x", this.lastMousePosition.x / this.scale);
                        this.element.setAttribute("y", this.lastMousePosition.y / this.scale);

                    }

                    if (this.shapesType == 'circle') {
                        // let rectId = document.getElementById('pdf-page').getElementsByTagName(this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType).length + 1;
                        const rectId = Math.random().toFixed(6);

                        this.element.id = 'circle-' + rectId;
                        this.element.setAttribute("cx", (this.lastMousePosition.x / this.scale));
                        this.element.setAttribute("cy", (this.lastMousePosition.y / this.scale));
                        this.element.setAttribute("r", (this.lastMousePosition.x / this.scale) - (this.lastMousePosition.y / this.scale));
                    }

                    if (this.shapesType == 'path') {
                        // let rectId = document.getElementById('pdf-page').getElementsByTagName(this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType).length + 1;
                        const rectId = Math.random().toFixed(6);

                        this.element.id = 'path-' + rectId;
                        this.strPath = "M" + (this.lastMousePosition.x / this.scale) + " " + (this.lastMousePosition.y / this.scale);
                        this.element.setAttribute("d", this.strPath);
                    }

                    if (this.shapesType == 'rectMask') {
                        // let rectId = document.getElementById('pdf-page').getElementsByTagName(this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType).length + 1;
                        const rectId = Math.random().toFixed(6);

                        this.element.id = 'rectMask-' + rectId;
                        this.element.setAttribute("stroke-width", "0");
                        this.element.setAttribute("fill", "#fff");
                        this.element.setAttribute("x", (this.lastMousePosition.x / this.scale));
                        this.element.setAttribute("y", (this.lastMousePosition.y / this.scale));

                    }

                    if (this.shapesType == 'highlight') {
                        // let rectId = document.getElementById('pdf-page').getElementsByTagName(this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType).length + 1;
                        const rectId = Math.random().toFixed(6);

                        this.element.id = 'highlight-' + rectId;
                        this.element.setAttribute("stroke-width", "0");
                        // this.element.setAttribute("fill", "yellow");
                        this.element.setAttribute("fill", this.svgColor);
                        this.element.setAttribute("fill-opacity", "0.2");
                        this.element.setAttribute("x", (this.lastMousePosition.x / this.scale));
                        this.element.setAttribute("y", (this.lastMousePosition.y / this.scale));

                    }

                    if (this.shapesType == 'line') {
                        // let rectId = document.getElementById('pdf-page').getElementsByTagName(this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType).length + 1;
                        const rectId = Math.random().toFixed(6);

                        this.element.id = 'line-' + rectId;
                        this.element.setAttribute("x2", (this.lastMousePosition.x / this.scale));
                        this.element.setAttribute("y2", (this.lastMousePosition.y / this.scale));

                    }
                    if (this.shapesType == 'math' && !this.editTextInput && !this.editMathInput) {
                        this.editMathValue = '';
                        this.modalRef = this.modalService.open(this.mathShow, {size: 'lg', backdrop: 'static'});
                        this.mathInputEvent = event.target;
                        this.lastMousePosition = {
                            x: event.clientX - this.pagePosition.x,
                            y: event.clientY - this.pagePosition.y
                        };

                        this.textPosition = {
                            x: this.lastMousePosition.x / this.scale,
                            y: this.lastMousePosition.y / this.scale,
                        };
                    }

                    if (this.shapesType == 'text') {
                        this.appendTextAreaInput(event, path);
                    }
                }
                if (this.element) {
                    this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                }

            }

            if (event.type === 'mouseup') {
                this.eraserActive = false;
                this.mouseDownFlag = false;
                this.buffer = [];
                this.rect.d = this.strPath;
                this.rect.text = this.textValue;


                if (this.shapesType == 'text') {
                    if (document.getElementById('customText')) {
                        document.getElementById('customText').focus();
                    }
                } else if (this.shapesType == 'rect') {
                    if (this.rect.x1 !== 0 && this.rect.x2 !== this.rect.x1) {
                        this.save();
                    }
                } else if (this.shapesType != 'math') {
                    if (this.rect.x1 !== 0 && this.rect.x2 !== 0) {
                        this.save();
                    }
                }
            }

        } else if (this.selectedElement && !this.editTextInput) {
            if (event.type == 'mousemove' && this.mouseDownFlag) {
                event.preventDefault();
                const dragX = event.clientX;
                const dragY = event.clientY;
                const coord = this.getMousePosition(event);
                this.selectedElement.setAttributeNS(null, "x", coord.x - this.offsetter.x);
                this.selectedElement.setAttributeNS(null, "y", coord.y - this.offsetter.y);
            }
            if (event.type == 'mouseup') {
                this.mouseDownFlag = false;
                this.areaInfo.forEach((val) => {
                    if (this.selectedElement.id == val.rectangleId) {
                        val.rect.x1 = this.selectedElement.x.baseVal.value;
                        val.rect.y1 = this.selectedElement.y.baseVal.value;
                        console.log(this.selectedElement);
                        console.log(val);
                        // this.areaInfo[index] = this.selectedElement;
                    }
                });
                this.offsetter = null;
                this.selectedElement = null;
            }
        }

    }


    createWrappingText(text, x, y, height, width, id) {
        // const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        svgText.setAttributeNS(null, 'x', x);
        svgText.setAttributeNS(null, 'y', y);
        let post = document.createElement('pre');
        post.setAttribute('id', id);
        post.className = 'textInput';
        post.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        post.textContent = text;
        post.innerHTML = post.innerHTML.replace(/\n/g, '<br>\n');
        post.style.width = width;
        this.rect.width = width;
        this.rect.height = height;
        post.style.fontFamily = 'sans-serif', 'Arial', 'Verdana', "Trebuchet MS", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        post.style.whiteSpace = 'normal';
        post.style.color = this.svgColor;
        post.style.fontSize = this.textFontSize;
        post.style.overflowWrap = 'break-word';
        svgText.style.width = width;
        svgText.style.height = height;
        svgText.style.overflow = 'visible';
        svgText.appendChild(post);
        return svgText;
    }

    getParentRecurrsive(val, tagName) {
        if (val.parentElement.tagName === tagName) {
            console.log(val.parentElement.id, 'val.parentElement.id');
            if (tagName == 'svg') {
                return val.parentElement;
            } else {
                return val.parentElement.id;
            }
        } else {
            if (val.parentElement.localName == 'html') {
                return null;
            } else {
                console.log(val.parentElement.localName, 'recurrence tag');
                return this.getParentRecurrsive(val.parentElement, tagName);
            }
        }
    }

    editText(event) {
        let id = null;
        // event.path.forEach((value, index) => {
        //     if (value.tagName == 'foreignObject') {
        //         id = index;
        //     }
        // });
        id = this.getParentRecurrsive(event.target, 'foreignObject');
        if (id != null) {
            let split = id.split('-');
            if (split[0] == 'text') {
                this.areaInfo.forEach((value) => {
                    if (value.rectangleId == id && value.isTeacherCorrection) {
                        this.editingTextValue = value;
                        this.appendTextArea(event, event.path, value.rect.width, value.rect.height);
                        this.inputElement.children[0].innerHTML = event.target.innerText;
                        this.inputElement.style.left = value.rect.x1 > 520 ? (value.rect.x1 - 200).toString() + 'px' : (value.rect.x1).toString() + 'px';
                        this.inputElement.style.top = (value.rect.y1).toString() + 'px';
                        this.inputElement.style.width = 'auto';
                        this.inputElement.style.position = 'absolute';
                        this.textPosition = {
                            x: value.rect.x1 / this.scale,
                            y: value.rect.y1 / this.scale,
                        };

                        const paths = this.composedPath(event.target);
                        paths?.find(p => p.className == 'page').appendChild(this.inputElement);
                        this.editTextInput = true;
                    }
                });
            } else if (split[0] == 'math') {
                this.mathInputEvent = document.getElementById(id);
                this.areaInfo.forEach((value) => {
                    if (value.rectangleId == id && value.isTeacherCorrection) {
                        this.editMathValue = value;
                        this.editMathInput = true;
                        this.modalRef = this.modalService.open(this.mathShow, {size: 'md', backdrop: 'static'});
                    }
                });
            }
        }
    }

    keyPressfunction(event) {
        const textValue = [];
        event.target.value.split(/^/gm).forEach((items) => {
            textValue.push(items.length);
        });
        const textAreaValue = document.getElementById('customText');
        const textAreaHeight = textAreaValue.style.height.split('px');
        if (['insertText'].indexOf(event.inputType) > -1 && event.data == null) {
            textAreaValue.style.height = (Number(textAreaHeight[0]) + 20).toString() + 'px';
        } else {
            console.log(textValue, 'textValue');
            if (textValue.length != 0) {
                const maxCharacterLength = textValue.reduce((a, b) => Math.max(a, b));
                console.log(maxCharacterLength, 'character')
                const calculatedWidth = ((maxCharacterLength - 1) * 6) + 60;
                const leftPosition = this.inputElement.style.left.toString().split('px')[0];
                const allowedPdfWidth = this.pdfWidth - 10 - Math.round(leftPosition);
                if (allowedPdfWidth > calculatedWidth) {
                    textAreaValue.style.width = calculatedWidth.toString() + 'px';
                }
                if (['deleteContentBackward'].indexOf(event.inputType) > -1 && event.data == null) {
                    textAreaValue.style.height = (((textValue.length - 1) * 20) + 50).toString() + 'px';
                }
            }
        }
    }

    appendTextArea(event, path, width, height) {

        this.inputElement = null;
        if (document.getElementById('customArea')) {
            document.getElementById('customArea').remove();
            this.editTextInput = false;
            this.inputElement = null;
            this.showInput = true;
            this.element = null;
        }
        this.inputElement = document.createElement('DIV');
        const text = document.createElement('TEXTAREA');
        text.className = 'form-control';
        text.setAttribute('type', 'text');
        text.setAttribute('name', 'customText');
        text.setAttribute('Placeholder', 'Text');
        text.style.resize = 'both';
        text.style.height = height == '' || height == '0' ? '50px' : height;
        text.style.width = width == '' || width == '0' ? '60px' : width;
        text.id = 'customText';
        this.inputElement.id = 'customArea';
        this.inputElement.appendChild(text);
    }

    appendTextAreaInput(event, path) {
        this.pdfWidth = parseInt((document.getElementById('pdf-page').getElementsByTagName('svg')[0].style.width).split('px')[0]);
        this.pdfHeight = parseInt((document.getElementById('pdf-page').getElementsByTagName('svg')[0].style.height).split('px')[0]);
        console.log(this.pdfWidth, 'pdfWidth');
        // if (event.target.tagName != "TEXTAREA" && event.target.tagName != 'I') {
        if (event.target.tagName != 'TEXTAREA') {
            if (document.getElementById('customArea') != null) {
                if ($('textarea[name="customText"]').val() == '') {
                    document.getElementById('customArea')?.remove();
                    this.showInput = true;
                } else {
                    this.showInput = false;
                }
            }
        }

        if (event.target.tagName != 'TEXTAREA' && event.target.tagName != 'I') {
            if (this.showInput) {
                this.appendTextArea(event, path, '60px', '50px');
                this.lastMousePosition = {
                    x: event.clientX - this.pagePosition.x,
                    y: event.clientY - this.pagePosition.y
                };
                console.log(this.lastMousePosition.x, 'this.lastMousePosition.x');

                this.inputElement.style.left = (this.lastMousePosition.x / this.scale) > 560 ? ((this.lastMousePosition.x) - 60).toString() + 'px' : (this.lastMousePosition.x).toString() + 'px';
                this.inputElement.style.top = (this.lastMousePosition.y / this.scale) > 920 ? ((this.lastMousePosition.y) - 50).toString() + 'px' : (this.lastMousePosition.y).toString() + 'px';
                this.inputElement.style.width = 'auto';
                this.inputElement.style.position = 'absolute';
                // this.inputElement.style.display = 'block';

                this.textPosition = {
                    x: this.lastMousePosition.x / this.scale,
                    y: this.lastMousePosition.y / this.scale,
                };

                const paths = this.composedPath(event.target);
                if (event.target.name != 'customArea') {
                    // this.inputElement.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                    paths?.find(p => p.className == 'page').appendChild(this.inputElement);
                }
            }
            if (!this.showInput) {
                let rectId;
                let idd;
                if (!this.editTextInput) {
                    rectId = Math.random().toFixed(6);
                    idd = 'text-' + rectId;
                    this.textValue = $('textarea[name="customText"]').val();
                    if (this.textValue != '') {
                        // this.element = this.createSVGtext(this.textValue, this.textPosition.x, this.textPosition.y);
                        let height = document.getElementById('customText').style.height;
                        let width = document.getElementById('customText').style.width;

                        this.element = this.createWrappingText(this.textValue, this.textPosition.x, this.textPosition.y, height, width, idd);
                        this.element.id = 'text-' + rectId;
                        this.element.setAttribute('fill', this.svgColor);
                        this.element.style.fontSize = this.textFontSize + 'px';
                        this.element.style.flexWrap = 'wrap';
                        this.element.style.cursor = 'move';
                        this.rect.x1 = this.textPosition.x;
                        this.rect.y1 = this.textPosition.y;
                        this.rect.text = this.textValue;
                        this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                        let push = path.find(p => p.className == 'page').children;
                        for (let i = 0; i < push.length; i++) {
                            if (push[i].tagName == 'svg') {
                                push[i].appendChild(this.element);
                            }
                        }
                        document.getElementById('customArea').remove();
                        this.save();
                    }
                } else {
                    this.textValue = $('textarea[name="customText"]').val();
                    if (this.textValue != '') {
                        const height = document.getElementById('customText').style.height;
                        const width = document.getElementById('customText').style.width;
                        this.element = this.createWrappingText(this.textValue, this.editingTextValue.rect.x1, this.editingTextValue.rect.y1, height, width, this.editingTextValue.rectangleId);
                        this.element.id = this.editingTextValue.rectangleId;
                        this.element.setAttribute('fill', this.editingTextValue.color);
                        this.element.style.fontSize = this.textFontSize + 'px';
                        this.element.style.flexWrap = 'wrap';
                        this.element.style.cursor = 'move';
                        // this.editingTextValue.rect.x1 = this.textPosition.x;
                        // this.editingTextValue.rect.y1 = this.textPosition.y;
                        this.editingTextValue.rect.text = this.textValue;
                        this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                        for (let i = 0; i < this.areaInfo.length; i++) {
                            if (this.areaInfo[i].rectangleId == this.editingTextValue.rectangleId) {
                                this.areaInfo[i].rect.text = this.editingTextValue.rect.text;
                                this.areaInfo[i].rect.width = this.rect.width;
                                this.areaInfo[i].rect.height = this.rect.height;
                                console.log(this.areaInfo[i], 'this.areaInfo[i]');
                            }
                        }
                        document.getElementById(this.editingTextValue.rectangleId).remove();
                        let push = path.find(p => p.className == 'page').children;
                        for (let i = 0; i < push.length; i++) {
                            if (push[i].tagName == 'svg') {
                                push[i].appendChild(this.element);
                            }
                        }
                        document.getElementById('customArea').remove();
                    }
                }
                this.textValue = '';
                this.showInput = true;
                this.element = null;
                this.editTextInput = false;
                // this.inputElement.children[1].innerText = this.textValue;
                // this.lastMousePosition = {
                //   x: event.clientX - this.pagePosition.x,
                //   y: event.clientY - this.pagePosition.y
                // };
                //
                // this.inputElement.style.left = (this.lastMousePosition.x).toString() + 'px';
                // this.inputElement.style.top = (this.lastMousePosition.y).toString() + 'px';
                // this.inputElement.style.width = '200px';
                // this.inputElement.style.height = '20px';
                // this.inputElement.style.overflow = 'visible';
                // this.inputElement.style.position = 'absolute';
                // this.textPosition = {
                //   x: this.lastMousePosition.x / this.scale,
                //   y: this.lastMousePosition.y / this.scale,
                // };
            }
        }
    }

    backToQuestion() {
        console.log(this.dragQuestionsList, 'dragQuestionsList')
        this.selectedDeleteIcon = false;
        this.deleteAnnatation = false;
    }

    deleteSvg() {
        // this.selectedPageAnnatation =  this.areaInfo.filter((value, id, array) => {
        //    return value.pageNumber == this.currentPage;
        //  });
        // this.itemSelect = this.selectedPageAnnatation;
        // this.deleteAnnatation = true;

        this.modalRef = this.modalService.open(this.deleteClass, {size: 'md', backdrop: 'static'});
    }


    deleteAllAnnotation() {

        for (let i = 0; i < this.areaInfo.length; i++) {
            if (document.getElementById(this.areaInfo[i].rectangleId)) {
                // if (this.currentPage == this.areaInfo[i].pageNumber) {
                this.areaInfo[i].isDelete = true;
                // this.areaInfo.splice(i, 1);
                this.redoListArray.push(this.areaInfo[i]);
                document.getElementById(this.areaInfo[i].rectangleId).remove();
                // }
            }

        }

        // this.areaInfo = [];
        this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
            return value.pageNumber == this.currentPage;
        });

        this.itemSelect = this.selectedPageAnnatation;
        this.close();
    }

    deleteCurrentPageAnnotation() {
        console.log(this.currentPage, 'pageeee')

        for (let i = 0; i < this.areaInfo.length; i++) {
            if (this.currentPage == this.areaInfo[i].pageNumber) {
                if (document.getElementById(this.areaInfo[i].rectangleId)) {
                    this.areaInfo[i].isDelete = true;
                    this.redoListArray.push(this.areaInfo[i]);
                    document.getElementById(this.areaInfo[i].rectangleId).remove();
                }

            }
        }
        // this.selectedPageAnnatation =  this.areaInfo.filter((value, id, array) => {
        //     return value.pageNumber !== this.currentPage;
        // });
        //
        // this.itemSelect = this.selectedPageAnnatation;

        this.close();
    }


    saveAnnatation() {
        ////write code for save

        this.backToQuestion();
    }

    getAveragePoint(offset) {
        const len = this.buffer.length;
        if (len % 2 === 1 || len >= 8) {
            let totalX = 0;
            let totalY = 0;
            let pt;
            let i;
            let count = 0;
            for (i = offset; i < len; i++) {
                count++;
                pt = this.buffer[i];
                totalX += pt.x;
                totalY += pt.y;
            }
            return {
                x: totalX / count,
                y: totalY / count
            };
        }
        return null;
    }

    updateSvgPath() {

        let pt = this.getAveragePoint(0);
        if (pt) {
            // Get the smoothed part of the path that will not change
            this.strPath += ' L' + pt.x + ' ' + pt.y;

            // Get the last part of the path (close to the current mouse position)
            // This part will change if the mouse moves again
            let tmpPath = '';
            for (let offset = 10; offset < this.buffer.length; offset += 5) {
                pt = this.getAveragePoint(offset);
                tmpPath += ' L' + pt.x + ' ' + pt.y;
            }

            // Set the complete current path coordinates
            this.element.setAttribute('d', this.strPath + tmpPath);
        }
    }

    // added new div with rects when pages rendered

    appendToBuffer(pt) {
        this.buffer.push(pt);
        while (this.buffer.length > 8) {
            this.buffer.shift();
        }
    }

    textRender(event) {
        let path = this.composedPath(event.source.textLayerDiv);
        path.find(p => p.className == 'page').appendChild(event.source.textLayerDiv);
    }

    pagechanging(event) {
        console.log(event);
        this.currentPage = event.pageNumber;
        if (this.deleteAnnatation) {
            this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
                return value.pageNumber == this.currentPage;
            });
            this.itemSelect = this.selectedPageAnnatation;
        }

    }

    removeAnnatation(event) {

        for (let i = 0; i < this.areaInfo.length; i++) {
            if (event.rectangleId == this.areaInfo[i].rectangleId) {
                this.areaInfo[i].isDelete = true;
                // this.areaInfo.splice(i, 1);
                this.redoListArray.push(this.areaInfo[i]);
            }
        }
        console.log(event, 'eventeventevent');
        const joinString = event.rectangleId;
        // setTimeout(() => {
        document.getElementById(joinString).remove();
        // }, 100);

        this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
            return value.pageNumber == this.currentPage;
        });

        console.log(this.selectedPageAnnatation, 'selected paginaion')
        this.itemSelect = this.selectedPageAnnatation;

    }

    undoDeleteAnnatation(event) {
        console.log(event, 'eventeventevent in rec');

        for (let i = 0; i < this.redoListArray.length; i++) {
            if (event.rectangleId == this.redoListArray[i].rectangleId) {
                // this.areaInfo.splice(i, 1);

                this.redoPageRendered(this.redoListArray[i]);
                this.redoListArray.splice(i, 1);

            }
        }

        for (let i = 0; i < this.areaInfo.length; i++) {
            if (event.rectangleId == this.areaInfo[i].rectangleId) {
                this.areaInfo[i].isDelete = false;
                // this.areaInfo.splice(i, 1);
                // this.redoListArray.slice(i , 1);
            }
        }

        this.selectedPageAnnatation = this.areaInfo.filter((value) => {
            return value.pageNumber == this.currentPage;
        });

        this.itemSelect = this.selectedPageAnnatation;

    }


    addQuestionButtonInPdf(value) {
        // Exists.
        // this.dragpaths = this.composedPath(event.target);
        // let drageventPath = this.dragpaths.find(p => p.className == 'page');

        // if (drageventPath) {
        if (this.dragQuestionsList) {
            console.log(this.dragQuestionsList, 'this.dragQuestionsList');
            this.dragQuestionsList.forEach((item) => {
                console.log(item, 'item');
                console.log(document.getElementById(item.id), 'document.getElementById(item.id)');
                console.log(item.dragButton.id, 'button id');
                console.log(this.scale, 'scale');
                if (document.getElementById(item.id)) {
                    if ($('#' + item.dragButton.id).length == 0) {
                        document.getElementById(item.id).style.position = 'absolute';
                        document.getElementById(item.id).style.transform = 'none';
                        this.dragButton = document.createElement('span');
                        this.dragButton.id = item.dragButton.id;
                        this.dragButton.style.transform = 'scale(' + this.zoom.toString() + ') rotate(0) translate(0, 0)';
                        // this.dragButton.style.left = item.dragButton.x + 'px';
                        // this.dragButton.style.top = item.dragButton.y + 'px';
                        // this.dragButton.style.fontSize = '14px';
                        // this.dragButton.style.width = '27px';
                        // this.dragButton.style.background = "#e6baea";
                        // this.dragButton.style.padding = "6px";
                        // this.dragButton.style.borderRadius = "4px";
                        // this.dragButton.style.textAlign = "center";
                        ///
                        console.log(item.dragButton.x * this.scale, 'item.dragButton.x * this.scale');
                        this.dragButton.style.left = (item.dragButton.x * this.scale) + 'px';
                        this.dragButton.style.top = (item.dragButton.y * this.scale) + 'px';
                        this.dragButton.style.fontSize = (14 * this.scale).toString() + 'px';
                        this.dragButton.style.minWidth = (27 * this.scale).toString() + 'px';
                        this.dragButton.style.background = '#e6baea';
                        this.dragButton.style.padding = (6 * this.scale).toString() + 'px';
                        this.dragButton.style.borderRadius = (4 * this.scale).toString() + 'px';
                        this.dragButton.style.textAlign = 'center';
                        this.dragButton.style.position = 'absolute';
                        this.dragButton.innerHTML = item.text;
                        let path = document.getElementsByClassName('page')[item.pageNumber - 1];
                        // path.children[2].appendChild(this.dragButton);
                        console.log(path);
                        path.appendChild(this.dragButton);
                        // this.dragpaths.find(p => p.className == 'page').appendChild(this.dragButton);
                    }
                }
                // else if ($('#' + item.dragButton.id).length > 0) {
                //     console.log(item.dragButton.id, 'button id repeat');
                //     // document.getElementById(this.selectedQueNum + 'dropId').style.position = 'fixed';
                //
                //     const dragList = [];
                //     this.dragQuestionsList.forEach((item1: any) => {
                //         if (item1.id !== item.id) {
                //             dragList.push(item1);
                //         }
                //     });
                //     let elem = document.getElementById(item.dragButton.id);
                //     elem.remove();
                //     this.dragQuestionsList = dragList;
                //
                // }
            });
        }
    }

    redoPageRendered(value) {
        let path = document.getElementsByClassName('page')[value.pageNumber - 1];
        let path1 = document.getElementsByClassName('page')[value.pageNumber - 1].getAttribute('data-page-number');

        $('.textLayer').addClass('disable-textLayer');

        // let rectId = document.getElementById('pdf-page').getElementsByTagName(value.shape == 'rectMask' ? 'rect' : value.shape == 'highlight' ? 'rect' : value.shape).length + 1;
        let rectId = value.rectangleId;
        let rect = document.createElementNS("http://www.w3.org/2000/svg", value.shape == 'rectMask' ? 'rect' : value.shape == 'highlight' ? 'rect' : value.shape);

        rect.setAttribute("stroke-width", "2");
        rect.setAttribute("stroke", "red");
        // rect.setAttribute("fill", "none");
        rect.setAttribute("fill", "none");
        rect.style.width = value.rect.width + 'px';
        rect.style.height = value.rect.height + 'px';

        if (value.shape == 'rect') {
            // rect.id = 'rect-' + rectId;
            rect.id = rectId;
            rect.setAttribute("x", value.rect.x1.toString());
            rect.setAttribute("y", value.rect.y1.toString());
        }
        if (value.shape == 'circle') {
            // rect.id = 'circle-' + rectId;
            rect.id = rectId;
            rect.setAttribute("cx", value.rect.x1.toString());
            rect.setAttribute("cy", value.rect.y1.toString());
            rect.setAttribute("r", '50');
        }

        if (value.shape == 'path') {
            // rect.id = 'path-' + rectId;
            rect.id = rectId;
            rect.setAttribute("d", value.rect.d);
        }
        if (value.shape == 'text') {
            // rect.id = 'text-' + rectId;
            rect.id = rectId;
            rect.setAttribute("fill", "red");
            rect.setAttribute("stroke-width", "none");
            rect.setAttribute("stroke", "none");
            rect.setAttribute("x", value.rect.x1.toString());
            rect.setAttribute("y", value.rect.y1.toString());
            rect.appendChild(document.createTextNode(value.rect.text.toString()));
            rect.style.fontSize = value.fontSize + 'px';
        }

        if (value.shape == 'rectMask') {
            // rect.id = 'rectMask-' + rectId;
            rect.id = rectId;

            rect.setAttribute("fill", "#fff");
            rect.setAttribute("stroke-width", "0");
            rect.setAttribute("x", value.rect.x1.toString());
            rect.setAttribute("y", value.rect.y1.toString());

        }

        if (value.shape == 'highlight') {
            // rect.id = 'highlight-' + rectId;
            rect.id = rectId;
            rect.setAttribute("stroke-width", "0");
            // rect.setAttribute("fill", "yellow");
            rect.setAttribute("fill", value.color);
            rect.setAttribute("fill-opacity", "0.2");
            rect.setAttribute("x", value.rect.x1.toString());
            rect.setAttribute("y", value.rect.y1.toString());

        }
        rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';

        // path.children[1].appendChild(rect);
        // let pagePath = path.find(p => p.className == 'page');
        let lengthofChilds = path.children.length;
        for (let i = 0; i < lengthofChilds; i++) {
            if (path.children[i].tagName == 'svg') {
                rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                path.children[i].appendChild(rect);
            }
        }
    }


    hoverRemoveItemEnter(event) {
        console.log(event, 'evetn in hoverrr');
        // this.elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // this.elem.style.position = 'absolute';
        // this.elem.style.left = 0 + 'px';
        // this.elem.style.top = 0 + 'px';
        // this.elem.style.right = 0 + 'px';
        // this.elem.style.bottom = 0 + 'px';
        // this.elem.style.cursor = 'auto';
        // this.elem.style.width = 100 + '%';
        // this.elem.style.height = 100 + '%';
        // let path = this.composedPath(event.source.div);
        // this.globalPdfViewerPath = path;
        this.globalPdfViewerPath.find(p => p.className == 'page').appendChild(this.elem);


        $('.textLayer').addClass('disable-textLayer');

        console.log(this.areaInfo, 'infro in hover')

        this.rectElem = this.areaInfo.forEach((value) => {

            console.log(value, 'value in hoverrrr loop')
            let eventsvgPath = document.getElementById(event.rectangleId);
            let valuesvgPath = document.getElementById(value.rectangleId);
            // console.log(eventsvgPath , 'eventsvgPath')
            // console.log(valuesvgPath, 'valuesvgPath')
            if (value.pageNumber == event.pageNumber) {

                if (eventsvgPath == valuesvgPath) {
                    let rect = valuesvgPath;

                    console.log(rect, 'rect in hover')


                    if (rect) {
                        console.log(value, 'value in ove')
                        if (value.shape == 'rect') {
                            rect.style.animation = 'blinkStroke 0.8s infinite'

                            rect.setAttribute("stroke-width", "2");
                            rect.setAttribute("stroke", value.color);
                            rect.setAttribute("fill", "none");
                        }
                        if (value.shape == 'circle') {
                            rect.style.animation = 'blinkStroke 0.8s infinite'

                            rect.setAttribute("stroke-width", "2");
                            rect.setAttribute("stroke", value.color);
                            rect.setAttribute("fill", "none");
                        }

                        if (value.shape == 'path') {
                            rect.style.animation = 'blinkStroke 0.8s infinite'

                            rect.setAttribute("stroke-width", "2");
                            rect.setAttribute("stroke", value.color);
                            rect.setAttribute("fill", "none");
                        }
                        if (value.shape == 'text') {
                            rect.style.animation = 'blinkFill 0.8s infinite'

                            rect.setAttribute("fill", value.color);
                            rect.setAttribute("stroke-width", "none");
                            rect.setAttribute("stroke", "none");
                            // rect.setAttribute("x", value.rect.x1.toString());
                            // rect.setAttribute("y", value.rect.y1.toString());
                            // rect.appendChild(document.createTextNode(value.rect.text.toString()));
                            // rect.style.fontSize = value.fontSize + 'px';
                        }

                        if (value.shape == 'rectMask') {
                            rect.style.animation = 'blinkFill 0.8s infinite'

                            // rect.setAttribute("fill", "#fff");
                            rect.setAttribute("fill", value.color);
                            rect.setAttribute("stroke-width", "0");


                        }

                        if (value.shape == 'highlight') {
                            rect.style.animation = 'blinkFill 0.8s infinite'

                            rect.setAttribute("stroke-width", "0");
                            // rect.setAttribute("fill", "yellow");
                            rect.setAttribute('fill', value.color);
                            rect.setAttribute("fill-opacity", "0.2");

                        }
                    }

                }

            }
        });

    }

    hoverLeaveRemoveItemEnter(event) {

        console.log(event, 'evetn in leave mouse');
        // this.elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // this.elem.style.position = 'absolute';
        // this.elem.style.left = 0 + 'px';
        // this.elem.style.top = 0 + 'px';
        // this.elem.style.right = 0 + 'px';
        // this.elem.style.bottom = 0 + 'px';
        // this.elem.style.cursor = 'auto';
        // this.elem.style.width = 100 + '%';
        // this.elem.style.height = 100 + '%';

        this.globalPdfViewerPath.find(p => p.className == 'page').appendChild(this.elem);

        $('.textLayer').addClass('disable-textLayer');

        this.rectElem = this.areaInfo.forEach((value, index, arr) => {
            let eventsvgPath = document.getElementById(event.rectangleId);
            let valuesvgPath = document.getElementById(value.rectangleId);

            if (value.pageNumber == event.pageNumber) {

                if (eventsvgPath == valuesvgPath) {
                    let rect = valuesvgPath;


                    console.log(rect, 'rect in leave')
                    if (rect) {
                        rect.style.animation = '';

                        if (value.shape == 'rect') {
                            rect.setAttribute("stroke-width", "2");
                            // rect.setAttribute("stroke", "red");
                            rect.setAttribute("stroke", value.color);
                            rect.setAttribute("fill", "none");
                        }
                        if (value.shape == 'circle') {
                            rect.setAttribute("stroke-width", "2");
                            rect.setAttribute("stroke", value.color);
                            rect.setAttribute("fill", "none");
                        }

                        if (value.shape == 'path') {
                            rect.setAttribute("stroke-width", "2");
                            rect.setAttribute("stroke", value.color);
                            rect.setAttribute("fill", "none");
                        }
                        if (value.shape == 'text') {
                            rect.setAttribute("fill", value.color);
                            // rect.setAttribute("stroke-width", );
                            rect.setAttribute("stroke-width", 'none');
                            rect.setAttribute("stroke", "none");
                            // rect.setAttribute("x", value.rect.x1.toString());
                            // rect.setAttribute("y", value.rect.y1.toString());
                            // rect.appendChild(document.createTextNode(value.rect.text.toString()));
                            // rect.style.fontSize = value.fontSize + 'px';
                        }

                        if (value.shape == 'rectMask') {
                            rect.setAttribute("fill", "#fff");
                            // rect.setAttribute("fill", "#fff");
                            rect.setAttribute("stroke-width", "0");


                        }

                        if (value.shape == 'highlight') {
                            rect.setAttribute("stroke-width", "0");
                            // rect.setAttribute("fill", "yellow");
                            rect.setAttribute("fill", value.color);
                            rect.setAttribute("fill-opacity", "0.2");

                        }
                    }

                }

            }
        });

    }

    pageRendered(event) {
        this.scale = event.source.scale;
        this.elem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.elem.style.position = 'absolute';
        this.elem.setAttribute('id', event.pageNumber);
        this.elem.style.left = 0 + 'px';
        this.elem.style.top = 0 + 'px';
        this.elem.style.right = 0 + 'px';
        this.elem.style.bottom = 0 + 'px';
        this.elem.style.cursor = 'auto';
        this.elem.style.width = event.source.width + 'px';
        this.elem.style.height = event.source.height + 'px';
        // this.elem.draggable({ minX: -4000, minY: -4000, maxX: 4000, maxY: 4000 });
        const path = this.composedPath(event.source.div);
        this.globalPdfViewerPath = path;
        path.find(p => p.className == 'page').appendChild(this.elem);
        this.rectElem = this.areaInfo.forEach((value, index, arr) => {
            if (value.pageNumber == event.pageNumber && !value.isDelete) {
                const rectId = value.rectangleId;
                let rect;
                if (value.shape != 'text') {
                    rect = document.createElementNS('http://www.w3.org/2000/svg', value.shape == 'rectMask' ? 'rect' : value.shape == 'highlight' ? 'rect' : value.shape);
                    rect.setAttribute('stroke-width', '2');
                    rect.setAttribute('stroke', value.color);
                    rect.setAttribute('fill', 'none');
                    rect.style.width = value.rect.width + 'px';
                    rect.style.height = value.rect.height + 'px';
                } else {
                    // rect = this.createSVGtext(value.rect.text, value.rect.x1, value.rect.y1);
                    rect = this.createWrappingText(value.rect.text, value.rect.x1, value.rect.y1, 'auto', value.rect.width, value.rectangleId);
                }

                if (value.shape == 'rect') {
                    rect.id = rectId;
                    rect.setAttribute('x', value.rect.x1.toString());
                    rect.setAttribute('y', value.rect.y1.toString());
                }
                if (value.shape == 'circle') {
                    rect.id = rectId;
                    rect.setAttribute('cx', value.rect.x1.toString());
                    rect.setAttribute('cy', value.rect.y1.toString());
                    rect.setAttribute('r', '50');
                }

                if (value.shape == 'path') {
                    rect.id = rectId;
                    rect.setAttribute('d', value.rect.d);
                }

                if (value.shape == 'foreignObject') {
                    rect.id = rectId;
                    rect.setAttribute('fill', value.color);
                    rect.setAttribute('stroke-width', 'none');
                    rect.setAttribute('stroke', 'none');
                    rect.setAttribute('x', value.rect.x1.toString());
                    rect.setAttribute('y', value.rect.y1.toString());
                    rect.style.width = 'auto';
                    rect.style.height = '20px';
                    rect.style.overflow = 'visible';
                    rect.style.flexWrap = 'wrap';
                    rect.style.cursor = 'move';
                    const userInput: any = this.sanitized.sanitize(SecurityContext.HTML, this.sanitized.bypassSecurityTrustHtml(value.rect.text));
                    const mathBody = document.createElement('DIV');
                    mathBody.innerHTML = userInput;
                    rect.appendChild(mathBody);
                }
                if (value.shape == 'text') {
                    rect.id = rectId;
                    rect.setAttribute('fill', value.color);
                    rect.setAttribute('stroke-width', 'none');
                    rect.setAttribute('stroke', 'none');
                    rect.setAttribute('x', value.rect.x1.toString());
                    rect.setAttribute('y', value.rect.y1.toString());
                    //
                    // if (typeof value.rect.text == "string") {
                    //   rect.appendChild(document.createTextNode(value.rect.text));
                    // }
                    // else {
                    //   rect.appendChild(document.createTextNode(value.rect.text?.toString()));
                    // }
                    rect.style.fontSize = value.fontSize + 'px';
                }

                if (value.shape == 'rectMask') {
                    rect.id = rectId;

                    rect.setAttribute('fill', '#fff');
                    rect.setAttribute('stroke-width', '0');
                    rect.setAttribute('x', value.rect.x1.toString());
                    rect.setAttribute('y', value.rect.y1.toString());

                }


                if (value.shape == 'highlight') {
                    rect.id = rectId;
                    // rect.id = 'highlight-' + rectId;
                    rect.setAttribute('stroke-width', '0');
                    // rect.setAttribute("fill", "yellow");
                    rect.setAttribute('fill', value.color);
                    rect.setAttribute('fill-opacity', '0.2');
                    rect.setAttribute('x', value.rect.x1.toString());
                    rect.setAttribute('y', value.rect.y1.toString());

                }


                // get to-draw-rectangle div and add rectangle
                rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';

                const pagePath = path.find(p => p.className == 'page');
                const lengthofChilds = path.find(p => p.className == 'page').children.length;
                for (let i = 0; i < lengthofChilds; i++) {
                    if (pagePath.children[i].tagName == 'svg') {
                        rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                        pagePath.children[i].appendChild(rect);
                    }
                }
                // path.find(p => p.className == 'page').appendChild(rect);
            }
        });
        this.clickEvent();
        this.addQuestionButtonInPdf(event);
    }

    composedPath(el) {

        // el.style.position = 'relative';
        // el.style.zIndex = '1';
        let path = [];
        while (el) {
            path.push(el);
            if (el.tagName === 'HTML') {
                path.push(document);
                path.push(window);
                return path;
            }
            el = el.parentElement;
        }
    }


    getStyle() {
        if (this.showPopup) {
            return "block";
        } else {
            return "none";
        }
    }

    save() {

        console.log(this.element.id, 'idd in save')
        let path = document.getElementById(this.element.id);
        console.log(path, 'path')

        if (path) {
            this.areaInfo.push({
                rectangleId: this.element.id,
                pageNumber: this.dataPageNumber,
                rect: this.rect,
                isDelete: false,
                isTeacherCorrection: true,
                shape: this.shapesType == 'math' ? 'foreignObject' : this.shapesType,
                color: this.svgColor,
                fontSize: this.textFontSize
            });
            console.log(this.rect, 'this.rect');
            console.log(this.areaInfo, 'a save');
            this.showPopup = false;
            this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};

            this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
                return value.pageNumber == this.currentPage;
            });
            this.itemSelect = this.selectedPageAnnatation;
        } else {
            console.log('no dom elemente')
        }


    }

    cancel() {
        let rectId = this.element.getAttribute('id');
        $('#' + rectId).remove();
        this.showPopup = false;
        this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
    }

    delete(list: AreaInfo) {
        document.getElementById(list.rectangleId).remove();
        this.areaInfo.find(f => f.rectangleId === list.rectangleId).isDelete = true;
        this.areaInfo = this.areaInfo.filter(f => f.isDelete === false);
    }


    moveTo(list: AreaInfo) {
        if (this.listRectangleId != '') {
            if (document.getElementById(this.listRectangleId)) {
                document.getElementById(this.listRectangleId).style.background = 'transparent';
                document.getElementById(this.listRectangleId).style.opacity = '1';
            }
        }
        if (this.listRectangleId !== list.rectangleId) {
            document.getElementById(list.rectangleId).scrollIntoView({block: 'start', behavior: 'smooth'});
            document.getElementById(list.rectangleId).style.background = 'red';
            document.getElementById(list.rectangleId).style.opacity = '0.4';
            this.listRectangleId = list.rectangleId;
        }
    }


    dragQueCount(event, section) {
        this.selectedQueNum = event.target.innerText;
        this.selectedDragSection = section;
        if (event.type === 'mousedown') {
            console.log('mousedown');
            // alert('down');
            this.queDrag = true;
        }
        // if(event.type === 'mouseup'){
        //     // alert('up')
        //     console.log('mouseup')
        //     this.queNum.push(event.target.innerText);
        //     document.getElementById('dropId').style.transform = 'none';
        //
        //     console.log(event , 'innertext');
        //     console.log(event.target.innerText , 'innertext');
        //     this.dragButton = document.createElement('span');
        //     this.dragButton.id = 'drag';
        //     this.dragButton.style.position = 'absolute';
        //     this.dragButton.style.right = this.lastMousePosition.x + 'px';
        //     this.dragButton.style.top = this.lastMousePosition.y + 'px';
        //     this.dragButton.style.fontSize = '14px';
        //     this.dragButton.style.width = '27px';
        //     this.dragButton.style.background = "#e6baea";
        //     this.dragButton.style.padding = "6px";
        //     this.dragButton.style.borderRadius = "4px";
        //     this.dragButton.style.textAlign = "center";
        //     this.dragButton.innerHTML = event.target.innerText;
        //
        //
        //     console.log(this.dragpaths)
        //     this.dragpaths.find(p => p.className == 'page').appendChild(this.dragButton);
        //     this.queDrag = false;
        // }

    }

    dragQuestionRevise(finalLength, changedQuesNo) {
        let id = 0;
        for (let z = 0; z < this.totalsub[this.sectionNo].section.length; z++) {
            if (changedQuesNo == this.totalsub[this.sectionNo].section[z].quesNo) {
                id += 1;
                const sub = (id + 9).toString(36).toLowerCase();
                if (this.InitialArrayLength == 1 && this.InitialArrayLength <= finalLength && id == 1) {
                    let changed = '';
                    if (finalLength == 1) {
                        changed = changedQuesNo;
                    } else {
                        changed = changedQuesNo + sub;
                    }
                    if (document.getElementById(this.sectionNo + 'drag' + this.editQuesNo)) {
                        document.getElementById(this.sectionNo + 'drag' + this.editQuesNo).innerText = changed;
                        document.getElementById(this.sectionNo + 'drag' + this.editQuesNo).id = this.sectionNo + 'drag' + changed;
                        this.dragQuestionsList.forEach((val) => {
                            if (val.id == this.editQuesNo + 'dropId' + this.sectionNo) {
                                val.id = changed + 'dropId' + this.sectionNo;
                                val.dragButton.id = this.sectionNo + 'drag' + changed;
                                val.text = changed;
                            }
                        });
                    }
                } else if (this.InitialArrayLength > finalLength) {
                    for (let j = 0; j < this.InitialArrayLength; j++) {
                        let alpha = ((j + 1) + 9).toString(36).toLowerCase();
                        if ((j + 1) > finalLength) {
                            if (document.getElementById(this.sectionNo + 'drag' + this.editQuesNo + alpha)) {
                                for (let k = 0; k < this.dragQuestionsList.length; k++) {
                                    if (this.dragQuestionsList[k].id == this.editQuesNo + alpha + 'dropId' + this.sectionNo) {
                                        this.dragQuestionsList.splice(k, 1);
                                    }
                                }
                                document.getElementById(this.sectionNo + 'drag' + this.editQuesNo + alpha).remove();
                            }
                        }
                        if (finalLength == 1) {
                            if (document.getElementById(this.sectionNo + 'drag' + this.editQuesNo + 'a')) {
                                document.getElementById(this.sectionNo + 'drag' + this.editQuesNo + 'a').innerText = changedQuesNo;
                                document.getElementById(this.sectionNo + 'drag' + this.editQuesNo + 'a').id = this.sectionNo + 'drag' + changedQuesNo;
                                this.dragQuestionsList.forEach((val) => {
                                    if (val.id == this.editQuesNo + 'a' + 'dropId' + this.sectionNo) {
                                        val.id = changedQuesNo + 'dropId' + this.sectionNo;
                                        val.dragButton.id = this.sectionNo + 'drag' + changedQuesNo;
                                        val.text = changedQuesNo;
                                    }
                                });
                            }
                        } else {
                            if (document.getElementById(this.sectionNo + 'drag' + this.editQuesNo + alpha)) {
                                document.getElementById(this.sectionNo + 'drag' + this.editQuesNo + alpha).innerText = changedQuesNo + alpha;
                                document.getElementById(this.sectionNo + 'drag' + this.editQuesNo + alpha).id = this.sectionNo + 'drag' + changedQuesNo + alpha;
                                this.dragQuestionsList.forEach((val) => {
                                    if (val.id == this.editQuesNo + alpha + 'dropId' + this.sectionNo + 'a') {
                                        val.id = changedQuesNo + alpha + 'dropId' + this.sectionNo;
                                        val.dragButton.id = this.sectionNo + 'drag' + changedQuesNo + alpha;
                                        val.text = changedQuesNo + alpha;
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    ////Annatation  End///


    createlink(): FormGroup {
        const def = ['a', 'b', 'c', 'd'];
        return this.formBuilder.group({
            points: ['1', Validators.required],
            option: ['a b c d ', Validators.required],
            array: [def],
            subQuestion: '',
            correct: ['', Validators.required],
            sub: '',
            page: ['0', Validators.required],
            active: ['', Validators.required],
            question: '',
            explain: '',
            answerId: '0',
            autograde: true,
        });
    }

    createchoose(): FormGroup {
        return this.formBuilder.group({
            optradio: ['', Validators.required],
            points1: ['1', Validators.required],
            question: '',
            explain: '',
            answerId: '0',
            autograde: true,
            page: ['0', Validators.required],
        });
    }

    createnumeric(): FormGroup {
        return this.formBuilder.group({
            answer: ['', Validators.required],
            question: '',
            explain: '',
            answerId: '0',
            autograde: false,
            page: ['0', Validators.required],
            points: ['1', Validators.required],
        });
    }

    createentry(): FormGroup {
        return this.formBuilder.group({
            correct: ['', Validators.required],
            matchCase: '',
            explain: '',
            points: ['1', Validators.required],
            question: '',
            answerId: '0',
            page: ['0', Validators.required],
            autograde: false,
        });
    }

    createessay(): FormGroup {
        return this.formBuilder.group({
            lines: '',
            points: ['1', Validators.required],
            question: '',
            explain: '',
            answerId: '0',
            page: ['0', Validators.required],
            autograde: false,
        });
    }

    truelink(): FormGroup {
        return this.formBuilder.group({
            choice: '',
            points: ['1', Validators.required],
            optionList: '',
            answer: ['', Validators.required],
            question: '',
            explain: '',
            active: '',
            answerId: '0',
            autograde: true,
            page: ['0', Validators.required],
            choiceList: this.formBuilder.array([this.addlink()])
        });
    }

    createblanks(): FormGroup {
        return this.formBuilder.group({
            choice: '',
            points: ['1', Validators.required],
            answer: '',
            explain: '',
            question: ['', Validators.required],
            autograde: false,
            blankList: '',
            page: ['0', Validators.required],
            answerId: '0',
        });
    }

    addlink(): FormGroup {
        return this.formBuilder.group({
            choice: ['', Validators.required]
        });
    }

    addFillin(): FormGroup {
        return this.formBuilder.group({
            choice: ['', Validators.required]
        });
    }

    add(): void {
        this.ransom = this.getRandrom();
        this.repeatlink = this.multiform.get('repeatlink') as FormArray;
        this.repeatlink.push(this.createlink());
        this.hide = false;
    }

    addTrue(): void {
        this.ransom = this.getRandrom();
        this.repeatchoose = this.multiform.get('repeatchoose') as FormArray;
        this.repeatchoose.push(this.createchoose());
        this.hide = false;
    }

    addBlanks(): void {
        this.ransom = this.getRandrom();
        this.repeatblanks = this.multiform.get('repeatblanks') as FormArray;
        this.repeatblanks.push(this.createblanks());
        this.hide = false;
    }

    addEntry(): void {
        this.ransom = this.getRandrom();
        this.repeatentry = this.multiform.get('repeatentry') as FormArray;
        this.repeatentry.push(this.createentry());
        this.hide = false;
    }

    addEssay(): void {
        this.ransom = this.getRandrom();
        this.repeatessay = this.multiform.get('repeatessay') as FormArray;
        this.repeatessay.push(this.createessay());
        this.hide = false;
    }

    addNumeric(): void {
        this.ransom = this.getRandrom();
        this.repeatnumeric = this.multiform.get('repeatnumeric') as FormArray;
        this.repeatnumeric.push(this.createnumeric());
        this.hide = false;
    }

    plus(): void {
        this.ransom = this.getRandrom();
        this.repeatplus = (this.multiform.get('repeatplus') as FormArray);
        this.repeatplus.push(this.truelink());
        this.hide = false;
    }

    addPlus(value): void {
        value.push(this.addlink());
    }

    addFill(value): void {
        value.push(this.addFillin());
    }

    formChanged() {
        if (this.assessmentType != 'add') {
            this.valueChanged = true;
        }
    }

    allowAnswerKey(event) {
        this.showAnswerKey = event.target.checked;
    }

    checkExplain(val) {
        if (val != '') {
            const openingTagSplit = val.split('<p>');
            const closingTagSplit = openingTagSplit[1].split('</p>');
            const spaceSplit = closingTagSplit[0].split('&nbsp');
            let check = false;
            spaceSplit.forEach((item) => {
                if (item != '' || item != '<p>/n</p>') {
                    check = true;
                }
            });
            return check;
        } else {
            return false;
        }
    }

    nextService() {
        const getAnnotation = JSON.parse(this.auth.getSessionData('editresources'));
        if (getAnnotation.details == 'Published') {
            this.assign('edit');
        } else if (getAnnotation.details == 'Draft') {
            this.draft('edit');
        }
    }

    saveAndExit() {
        const grade = this.multiform.controls.grade.value;
        const subject = this.multiform.controls.subject.value;
        const cname = this.multiform.controls.classname.value;
        if (grade != '' && subject != '' && cname != '') {
            this.pdfChanged = false;
            this.valueChanged = false;
            this.nextService();
        } else {
            this.validationService.validateAllFormFields(this.multiform);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    description() {
        const grade = this.multiform.controls.grade.value;
        const subject = this.multiform.controls.subject.value;
        const cname = this.multiform.controls.classname.value;
        if (grade != '' && subject != '' && cname != '') {
            this.disable = false;
            if (this.assessmentType == 'add') {
                if (this.functionCalled == false) {
                    this.draft('add');
                } else {
                    this.classList(2);
                }
            } else if (this.assessmentType == 'edit') {
                if (this.pdfChanged) {
                    this.areaInfo = [];
                    this.nextService();
                } else if (this.valueChanged) {
                    this.nextService();
                } else {
                    this.pdfTemplate = this.webhost + '/' + this.getpdf?.original_image_url;
                    this.classList(2);
                }
            }
        } else {
            this.validationService.validateAllFormFields(this.multiform);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    checkField(id) {
        if (document.getElementById('customArea')) {
            document.getElementById('customArea').remove();
            this.editTextInput = false;
            this.inputElement = null;
            this.showInput = true;
            this.element = null;
        }
        const grade = this.multiform.controls.grade.value;
        const subject = this.multiform.controls.subject.value;
        const cname = this.multiform.controls.classname.value;
        if (grade != '' && subject != '' && cname != '') {
            if (this.pdfChanged && this.assessmentType != 'add') {
                this.areaInfo = [];
                this.nextService();
            } else {
                if (id == 2) {
                    this.type = 'Workspace';
                } else if (id == 3) {
                    this.type = 'Preview';
                }
            }
        } else {
            this.validationService.validateAllFormFields(this.multiform);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    encodeImageFileAsURL(event: any) {
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const imgDetails = event.target.files[0];
            // console.log(imgDetails, 'IMGDETAILS');
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const url = event.target.result;
                const getUrl = url.split(',');
                // console.log(getUrl, 'geturl');
                const pic = imgDetails.type.split('/');
                // console.log(pic, 'Type');

                if (pic[1] == 'jpeg' || pic[1] == 'png' || pic[1] == 'jpg') {
                    this.onUploadKYCFinished(getUrl, imgDetails);
                } else {
                    this.toastr.error('JPEG ,PNG & JPG are the required type');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }
    }

    onUploadKYCFinished(getUrlEdu, imageList) {
        this.recordBase64Url = getUrlEdu[1];
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: [{
                image: this.recordBase64Url,
                size: imageList.size,
                type: imageList.type,
                name: imageList.name
            }],
            uploadtype: 'profile'
        };
        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.uploadSuccess(successData);
                // console.log(successData, 'successData');
            },
            (error) => {
                this.uploadFailure(error);
                console.log(error, 'wrongFormat');
            }
        );
    }

    uploadSuccess(successData) {
        // this.settings.loadingSpinner = false;
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            // console.log(this.imagepath, 'This image');
            this.imagepath = successData.ResponseObject.imagepath[0].original_image_url;
            this.imagepaththumb = successData.ResponseObject.imagepath[0].resized_url;
            // if (typing == 1) {
            // for (let i = 0; i < successData.ResponseObject.imagepath.length; i++) {
            //   this.imagepath.push(successData.ResponseObject.imagepath[i].original_image_url);
            //   this.imagepaththumb.push(successData.ResponseObject.imagepath[i].resized_url);
            //
            // }
        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    uploadFailure(error) {
        // this.toastr.error('Invalid File Format');
        console.log(error, 'error');
    }

    submitMulti(value) {
        setTimeout(() => {
            if (this.multiform['controls'].repeatlink.valid && !this.quesNoInvalid) {
                this.showdropdown = true;
                this.subQuestionMulti = [];
                let list;
                let changedQuesNo = this.countList;
                for (let i = 0; i < this.multiform['controls'].repeatlink.value.length; i++) {
                    console.log(this.multiform['controls'].repeatlink['controls'][i]['controls']['question'].value, 'question val ');
                    let list11 = ((i + 1) + 9).toString(36).toLowerCase();
                    list = {
                        options: this.multiform['controls'].repeatlink['controls'][i]['controls']['option'].value,
                        auto_grade: this.multiform['controls'].repeatlink['controls'][i]['controls']['autograde'].value == true ? '1' : '0',
                        points: this.multiform['controls'].repeatlink['controls'][i]['controls']['points'].value,
                        answer: this.multiform['controls'].repeatlink['controls'][i]['controls']['correct'].value,
                        array: this.multiform['controls'].repeatlink['controls'][i]['controls']['array'].value,
                        question: this.multiform['controls'].repeatlink['controls'][i]['controls']['question'].value,
                        answer_id: this.multiform['controls'].repeatlink['controls'][i]['controls']['answerId'].value,
                        answer_explanation: this.multiform['controls'].repeatlink['controls'][i]['controls']['explain'].value,
                        question_no: this.countList,
                        sub_question_no: this.hide == false ? this.countList + list11 : this.countList,
                        question_type_id: '1',
                        page_no: this.multiform['controls'].repeatlink['controls'][i]['controls']['page'].value,
                        // difficulty: value == 'edit' ? this.randomValue[i] : Math.random().toFixed(6),
                        difficulty: '0',
                        allow_exact_match: '0',
                        allow_any_text: '0',
                        match_case: '0',
                        minimum_line: '0'
                    };
                    console.log(list, 'updatedList');
                    this.subQuestionMulti.push(list);
                    if (value == 'add') {
                        if (this.totalsub[this.sectionCount] == null) {
                            this.totalsub[this.sectionCount] = {heading: '', section: []};
                        }
                        console.log(this.totalsub, 'this.totalsub add');
                        this.totalsub[this.sectionCount].section.push({
                            sub: list.sub_question_no,
                            answer: list.answer,
                            quesId: '0',
                            typeId: list.question_type_id,
                            quesNo: list.question_no,
                            pageNo: list.page_no,
                            explain: list.answer_explanation,
                            autoGrade: list.auto_grade,
                            matchCase: list.match_case,
                            option: list.options,
                            array: list.array,
                            question: list.question
                        });
                        // let random = Math.random().toFixed(6);
                        // document.getElementById(list.sub_question_no + 'dropId' + this.sectionCount).setAttribute('uniqueId', random);
                    }
                }
                if (value == 'add') {
                    if (this.subQuestion[this.sectionCount] == null) {
                        this.subQuestion[this.sectionCount] = {heading: '', section: []};
                    }
                    this.subQuestion[this.sectionCount].section.push({
                        has_sub_question: this.multiform['controls'].repeatlink.value.length == 1 ? 0 : 1,
                        sub_questions: this.subQuestionMulti
                    });
                    console.log(this.subQuestion, 'subQuestion');
                } else if (value == 'edit') {
                    for (let i = 0; i < this.subQuestion.length; i++) {
                        if (this.sectionNo == i) {
                            this.totalsub[i] = {heading: this.secHeadingArray[i], section: []};
                            for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                                if (this.subQuestion[i].section[x].sub_questions[0].question_no == this.editQuesNo) {
                                    this.subQuestion[i].section[x] = {
                                        has_sub_question: this.multiform['controls'].repeatlink.value.length == 1 ? 0 : 1,
                                        sub_questions: this.subQuestionMulti
                                    };
                                }
                                for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                    let list = this.subQuestion[i].section[x].sub_questions[j];
                                    this.totalsub[i].section.push({
                                        sub: list.sub_question_no,
                                        answer: list.answer,
                                        quesId: list.answer_id,
                                        typeId: list.question_type_id,
                                        autoGrade: list.auto_grade,
                                        matchCase: list.match_case,
                                        pageNo: list.page_no,
                                        explain: list.answer_explanation,
                                        editor: list?.editor_answer,
                                        quesNo: list.question_no,
                                        option: list.options,
                                        array: list.array,
                                        question: list.question
                                    });
                                }
                                this.dragQuestionRevise(this.multiform['controls'].repeatlink.value.length, changedQuesNo);
                            }
                        }
                    }
                    if (this.sectionCount != this.sectionNo) {
                        this.dragCount = [];
                        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                        }
                        for (let i = 0; i < this.reloadQues; i++) {
                            const num = i + 1;
                            this.dragCount.push(num);
                        }
                    }
                    console.log(this.subQuestion, 'this.subQuestionEdit');
                }
                for (let i = 0; i < this.totalsub.length; i++) {
                    this.totalsub[i].section.sort((a, b) => parseFloat(a.quesNo) - parseFloat(b.quesNo));
                }
                for (let i = 0; i < this.subQuestion.length; i++) {
                    this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                }
                console.log(this.totalsub[this.sectionCount].section, 'after sorted');
                const controlmulti = <FormArray>this.multiform.controls['repeatlink'];
                for (let i = controlmulti.length; i >= 1; i--) {
                    controlmulti.reset();
                    this.multiform['controls'].repeatlink['controls'][0]['controls']['points'].patchValue('1');
                    this.multiform['controls'].repeatlink['controls'][0]['controls']['page'].patchValue('0');
                    this.multiform['controls'].repeatlink['controls'][0]['controls']['option'].patchValue('a b c ');
                    this.multiform['controls'].repeatlink['controls'][0]['controls']['array'].patchValue(['a', 'b', 'c']);
                    this.multiform['controls'].repeatlink['controls'][0]['controls']['autograde'].patchValue(true);
                    controlmulti.removeAt(i);
                }
                // if (this.quesNoChanged == false) {
                //     this.dragCount = [];
                //     for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                //         const num = i + 1;
                //         this.dragCount.push(num);
                //     }
                // }
                this.hide = true;
                if (this.isBulkUpload) {
                    this.multiform.get('repeatlink').reset();
                    this.bulkAddingCount++;
                    if (this.bulkAddingCount === this.bulkFormData.noOfQuestions) {
                        this.multiDialog = false;
                        this.isBulkUpload = false;
                    } else {
                        this.question('1');
                    }
                } else {
                    this.multiDialog = false;
                }
                this.clickEvent();
            } else {
                this.toastr.error('Enter all mandatory fields');
            }
        }, 500);
    }


    gettingChoiceList(event, id, option) {
        console.log(id, 'id');
        console.log(option, 'option');
        for (let i = 0; i < this.multiform['controls'].repeatlink['controls'].length; i++) {
            if (id == i) {
                console.log(event.target.innerText, 'event.target.innerText');
                this.multiform['controls'].repeatlink['controls'][i]['controls']['correct'].patchValue(event.target.innerText);
                this.multiform['controls'].repeatlink['controls'][i]['controls']['active'].patchValue(option);
            }
        }
    }

    submitChoice(value) {
        setTimeout(() => {
            if (this.multiform['controls'].repeatplus.valid && !this.quesNoInvalid) {
                this.showdropdown = true;
                this.subQuestionChoice = [];
                let changedQuesNo = this.countList;
                let list;
                for (let i = 0; i < this.multiform['controls'].repeatplus.value.length; i++) {
                    // this.subDiv = document.getElementById('subChoice').innerText.toLowerCase();
                    let list11 = ((i + 1) + 9).toString(36).toLowerCase();
                    list = {
                        options: '',
                        points: this.multiform['controls'].repeatplus['controls'][i]['controls']['points'].value,
                        auto_grade: this.multiform['controls'].repeatplus['controls'][i]['controls']['autograde'].value == true ? '1' : '0',
                        question_no: this.countList,
                        sub_question_no: this.hide == false ? this.countList + list11 : this.countList,
                        question_type_id: '9',
                        answer: this.multiform['controls'].repeatplus['controls'][i]['controls']['answer'].value,
                        answer_id: this.multiform['controls'].repeatplus['controls'][i]['controls']['answerId'].value,
                        difficulty: '0',
                        allow_exact_match: '0',
                        allow_any_text: '0',
                        match_case: '0',
                        minimum_line: '0',
                        array: this.multiform['controls'].repeatplus['controls'][i]['controls']['optionList'].value,
                        question: this.multiform['controls'].repeatplus['controls'][i]['controls']['question'].value,
                        page_no: this.multiform['controls'].repeatplus['controls'][i]['controls']['page'].value,
                        answer_explanation: this.multiform['controls'].repeatplus['controls'][i]['controls']['explain'].value,
                    };
                    this.subQuestionChoice.push(list);
                    if (value == 'add') {
                        if (this.totalsub[this.sectionCount] == null) {
                            this.totalsub[this.sectionCount] = {heading: '', section: []};
                        }
                        this.totalsub[this.sectionCount].section.push({
                            sub: list.sub_question_no,
                            answer: list.answer,
                            typeId: list.question_type_id,
                            quesId: '0',
                            quesNo: list.question_no,
                            autoGrade: list.auto_grade,
                            matchCase: list.match_case,
                            pageNo: list.page_no,
                            explain: list.answer_explanation,
                            option: list.array,
                            array: list.array,
                            question: list.question
                        });
                        console.log(this.subQuestionChoice, 'this.subQuestionChoice');
                    }
                    console.log(this.totalsub, 'this.totalsub array value');
                }
                if (value == 'add') {
                    if (this.subQuestion[this.sectionCount] == null) {
                        this.subQuestion[this.sectionCount] = {heading: '', section: []};
                    }
                    this.subQuestion[this.sectionCount].section.push({
                        has_sub_question: this.multiform['controls'].repeatplus.value.length == 1 ? 0 : 1,
                        sub_questions: this.subQuestionChoice
                    });
                    console.log(this.subQuestion, 'subQuestion');
                } else if (value == 'edit') {
                    for (let i = 0; i < this.subQuestion.length; i++) {
                        if (this.sectionNo == i) {
                            this.totalsub[i] = {heading: this.secHeadingArray[i], section: []};
                            for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                                if (this.subQuestion[i].section[x].sub_questions[0].question_no == this.editQuesNo) {
                                    this.subQuestion[i].section[x] = {
                                        has_sub_question: this.multiform['controls'].repeatplus.value.length == 1 ? 0 : 1,
                                        sub_questions: this.subQuestionChoice
                                    };
                                }
                                for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                    let list = this.subQuestion[i].section[x].sub_questions[j];
                                    this.totalsub[i].section.push({
                                        sub: list.sub_question_no,
                                        answer: list.answer,
                                        quesId: list.answer_id,
                                        typeId: list.question_type_id,
                                        autoGrade: list.auto_grade,
                                        matchCase: list.match_case,
                                        pageNo: list.page_no,
                                        editor: list?.editor_answer,
                                        explain: list.answer_explanation,
                                        quesNo: list.question_no,
                                        option: list.options,
                                        array: list.array,
                                        question: list.question
                                    });
                                }
                                this.dragQuestionRevise(this.multiform['controls'].repeatplus.value.length, changedQuesNo);
                            }
                        }
                    }
                    if (this.sectionCount != this.sectionNo) {
                        this.dragCount = [];
                        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                        }
                        for (let i = 0; i < this.reloadQues; i++) {
                            const num = i + 1;
                            this.dragCount.push(num);
                        }
                    }
                    console.log(this.subQuestion, 'this.subQuestionEdit');
                }
                for (let i = 0; i < this.totalsub.length; i++) {
                    this.totalsub[i].section.sort((a, b) => parseFloat(a.quesNo) - parseFloat(b.quesNo));
                }
                for (let i = 0; i < this.subQuestion.length; i++) {
                    this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                }
                console.log(this.subQuestion, 'subQuestion');
                const controlPlus = <FormArray>this.multiform.controls['repeatplus'];
                for (let i = controlPlus.length; i >= 1; i--) {
                    const controls = controlPlus['controls'][0]['controls']['choiceList'];
                    for (let j = controls.length; j >= 1; j--) {
                        controls.removeAt(j);
                    }
                    controlPlus.reset();
                    this.multiform['controls'].repeatplus['controls'][0]['controls']['points'].patchValue('1');
                    this.multiform['controls'].repeatplus['controls'][0]['controls']['autograde'].patchValue(true);
                    controlPlus.removeAt(i);
                }
                this.hide = true;
                if (this.isBulkUpload) {
                    this.multiform.get('repeatplus').reset();
                    this.bulkAddingCount++;
                    if (this.bulkAddingCount === this.bulkFormData.noOfQuestions) {
                        this.choiceDialog = false;
                        this.isBulkUpload = false;
                    } else {
                        this.question('9');
                    }
                } else {
                    this.choiceDialog = false;
                }
                this.clickEvent();
            } else {
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }, 500);
    }

    gettingQuestionChoiceList(id) {
        for (let i = 0; i < this.multiform['controls'].repeatplus['controls'].length; i++) {
            if (id == i) {
                let arr = [];
                console.log(this.multiform['controls'].repeatplus['controls'][id]['controls']['choiceList']['controls'][0], 'enter as');
                for (let j = 0; j < this.multiform['controls'].repeatplus['controls'][id]['controls']['choiceList'].length; j++) {
                    arr.push(this.multiform['controls'].repeatplus['controls'][id]['controls']['choiceList']['controls'][j].value);
                }
                console.log(arr, 'choice');
                this.multiform['controls'].repeatplus['controls'][id]['controls']['optionList'].patchValue(arr);
                console.log(this.multiform['controls'].repeatplus['controls'][id]['controls']['optionList'].value, 'listData');
            }
        }
        // this.multiform['controls'].repeatplus['controls'][li]['controls']['optionList']['controls'][id]['controls'].patchValue(array.get('choiceList')['controls'][id]['controls'].value);
    }

    gettingChoiceAnswer(event, id) {
        console.log(event, 'event index');
        console.log(event.target, 'event index target');
        console.log(event.target.value);
        const val = this.multiform['controls'].repeatplus['controls'][id]['controls']['optionList'].value;
        for (let j = 0; j < val.length; j++) {
            if (event.target.value == val[j].choice) {
                this.multiform['controls'].repeatplus['controls'][id]['controls']['answer'].patchValue(val[j].choice);
                this.multiform['controls'].repeatplus['controls'][id]['controls']['active'].patchValue(j + 1);
                console.log(this.multiform['controls'].repeatplus['controls'][id]['controls']['answer'].value, 'ans value');
                console.log(this.multiform['controls'].repeatplus['controls'][id]['controls']['active'].value, 'active value');
            }
        }
        // for (let i = 0; i < this.multiform['controls'].repeatplus['controls'].length; i++) {
        //
        // }
    }

    submitchoose(value) {
        setTimeout(() => {
            if (this.multiform['controls'].repeatchoose.valid && !this.quesNoInvalid) {
                this.showdropdown = true;
                this.subQuestionChoose = [];
                let list;
                let changedQuesNo = this.countList;
                console.log(this.multiform['controls'].repeatchoose.value, 'listlist');
                for (let i = 0; i < this.multiform['controls'].repeatchoose.value.length; i++) {
                    let list11 = ((i + 1) + 9).toString(36).toLowerCase();
                    const trueVal = this.multiform['controls'].repeatchoose['controls'][i]['controls']['optradio'].value;
                    list = {
                        options: 'true, false',
                        points: this.multiform['controls'].repeatchoose['controls'][i]['controls']['points1'].value,
                        auto_grade: this.multiform['controls'].repeatchoose['controls'][i]['controls']['autograde'].value == true ? '1' : '0',
                        question: this.multiform['controls'].repeatchoose['controls'][i]['controls']['question'].value,
                        answer_explanation: this.multiform['controls'].repeatchoose['controls'][i]['controls']['explain'].value,
                        answer_id: this.multiform['controls'].repeatchoose['controls'][i]['controls']['answerId'].value,
                        page_no: this.multiform['controls'].repeatchoose['controls'][i]['controls']['page'].value,
                        question_no: this.countList,
                        sub_question_no: this.hide == false ? this.countList + list11 : this.countList,
                        question_type_id: '3',
                        difficulty: '0',
                        allow_exact_match: '0',
                        allow_any_text: '0',
                        match_case: '0',
                        array: [],
                        minimum_line: '0',
                        answer: trueVal,
                    };
                    this.subQuestionChoose.push(list);
                    if (value == 'add') {
                        if (this.totalsub[this.sectionCount] == null) {
                            this.totalsub[this.sectionCount] = {heading: '', section: []};
                        }
                        this.totalsub[this.sectionCount].section.push({
                            sub: list.sub_question_no,
                            answer: list.answer,
                            quesId: '0',
                            typeId: list.question_type_id,
                            autoGrade: list.auto_grade,
                            matchCase: list.match_case,
                            pageNo: list.page_no,
                            explain: list.answer_explanation,
                            quesNo: list.question_no,
                            option: list.options,
                            array: list.array,
                            question: list.question
                        });
                        console.log(this.totalsub, 'this.totalsub add');
                    }
                }
                console.log(this.subQuestionChoose, 'subQuestionChoose');
                console.log(this.multiform['controls'].repeatchoose.value, 'subQuestionMulti');
                if (value == 'add') {
                    if (this.subQuestion[this.sectionCount] == null) {
                        this.subQuestion[this.sectionCount] = {heading: '', section: []};
                    }
                    this.subQuestion[this.sectionCount].section.push({
                        has_sub_question: this.multiform['controls'].repeatchoose.value.length == 1 ? 0 : 1,
                        sub_questions: this.subQuestionChoose
                    });
                    console.log(this.subQuestion, 'subQuestion');
                } else if (value == 'edit') {
                    for (let i = 0; i < this.subQuestion.length; i++) {
                        if (this.sectionNo == i) {
                            this.totalsub[i] = {heading: this.secHeadingArray[i], section: []};
                            for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                                if (this.subQuestion[i].section[x].sub_questions[0].question_no == this.editQuesNo) {
                                    this.subQuestion[i].section[x] = {
                                        has_sub_question: this.multiform['controls'].repeatchoose.value.length == 1 ? 0 : 1,
                                        sub_questions: this.subQuestionChoose
                                    };
                                }
                                for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                    let list = this.subQuestion[i].section[x].sub_questions[j];
                                    this.totalsub[i].section.push({
                                        sub: list.sub_question_no,
                                        answer: list.answer,
                                        quesId: list.answer_id,
                                        typeId: list.question_type_id,
                                        quesNo: list.question_no,
                                        autoGrade: list.auto_grade,
                                        editor: list?.editor_answer,
                                        pageNo: list.page_no,
                                        explain: list.answer_explanation,
                                        matchCase: list.match_case,
                                        option: list.options,
                                        array: list.array,
                                        question: list.question
                                    });
                                }
                                this.dragQuestionRevise(this.multiform['controls'].repeatchoose.value.length, changedQuesNo);
                            }
                        }
                    }
                    if (this.sectionCount != this.sectionNo) {
                        this.dragCount = [];
                        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                        }
                        for (let i = 0; i < this.reloadQues; i++) {
                            const num = i + 1;
                            this.dragCount.push(num);
                        }
                    }
                    console.log(this.subQuestion, 'this.subQuestionEdit');
                }
                for (let i = 0; i < this.totalsub.length; i++) {
                    this.totalsub[i].section.sort((a, b) => parseFloat(a.quesNo) - parseFloat(b.quesNo));
                }
                for (let i = 0; i < this.subQuestion.length; i++) {
                    this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                }
                const controlChoose = <FormArray>this.multiform.controls['repeatchoose'];
                for (let i = controlChoose.length; i >= 1; i--) {
                    controlChoose.reset();
                    this.multiform['controls'].repeatchoose['controls'][0]['controls']['points1'].patchValue('1');
                    this.multiform['controls'].repeatchoose['controls'][0]['controls']['autograde'].patchValue(true);
                    controlChoose.removeAt(i);
                }
                this.hide = true;
                if (this.isBulkUpload) {
                    this.multiform.get('repeatchoose').reset();
                    this.bulkAddingCount++;
                    if (this.bulkAddingCount === this.bulkFormData.noOfQuestions) {
                        this.trueDialog = false;
                        this.isBulkUpload = false;
                    } else {
                        this.question('3');
                    }
                } else {
                    this.trueDialog = false;
                }
                this.clickEvent();
            } else {
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }, 500);
    }

    uncheckFalse() {
        // document.getElementById('falseOption').checked = false;
    }

    submitEntry(value) {
        setTimeout(() => {
            if (this.multiform['controls'].repeatentry.valid && !this.quesNoInvalid) {
                this.showdropdown = true;
                this.subQuestionEntry = [];
                let list;
                let changedQuesNo = this.countList;
                console.log(this.multiform['controls'].repeatentry.value, 'listlist');
                for (let i = 0; i < this.multiform['controls'].repeatentry.value.length; i++) {
                    // this.subDiv = document.getElementById('subEntry').innerText.toLowerCase();
                    let list11 = ((i + 1) + 9).toString(36).toLowerCase();

                    list = {
                        match_case: this.multiform['controls'].repeatentry['controls'][i]['controls']['matchCase'].value == true ? '1' : '0',
                        points: this.multiform['controls'].repeatentry['controls'][i]['controls']['points'].value,
                        answer: this.multiform['controls'].repeatentry['controls'][i]['controls']['correct'].value,
                        question: this.multiform['controls'].repeatentry['controls'][i]['controls']['question'].value,
                        answer_explanation: this.multiform['controls'].repeatentry['controls'][i]['controls']['explain'].value,
                        answer_id: this.multiform['controls'].repeatentry['controls'][i]['controls']['answerId'].value,
                        page_no: this.multiform['controls'].repeatentry['controls'][i]['controls']['page'].value,
                        auto_grade: this.multiform['controls'].repeatentry['controls'][i]['controls']['autograde'].value == true ? '1' : '0',
                        question_no: this.countList,
                        sub_question_no: this.hide == false ? this.countList + list11 : this.countList,
                        question_type_id: '10',
                        difficulty: '0',
                        allow_exact_match: '0',
                        allow_any_text: '0',
                        minimum_line: '0',
                        array: [],
                        options: '',
                    };
                    this.subQuestionEntry.push(list);
                    if (value == 'add') {
                        if (this.totalsub[this.sectionCount] == null) {
                            this.totalsub[this.sectionCount] = {heading: '', section: []};
                        }
                        this.totalsub[this.sectionCount].section.push({
                            sub: list.sub_question_no,
                            answer: list.answer,
                            quesId: '0',
                            typeId: list.question_type_id,
                            autoGrade: list.auto_grade,
                            matchCase: list.match_case,
                            quesNo: list.question_no,
                            explain: list.answer_explanation,
                            pageNo: list.page_no,
                            option: list.options,
                            array: list.array,
                            question: list.question
                        });
                        console.log(this.totalsub, 'this.totalsub add');
                    }
                }
                // this.subQuestionMulti = list;
                console.log(this.subQuestionEntry, 'subQuestionEntry1');
                console.log(this.multiform['controls'].repeatentry.value, 'subQuestionEntry');
                // this.showdropdown = true;
                if (value == 'add') {
                    if (this.subQuestion[this.sectionCount] == null) {
                        this.subQuestion[this.sectionCount] = {heading: '', section: []};
                    }
                    this.subQuestion[this.sectionCount].section.push({
                        has_sub_question: this.multiform['controls'].repeatentry.value.length == 1 ? 0 : 1,
                        sub_questions: this.subQuestionEntry
                    });
                    console.log(this.subQuestion, 'subQuestion');
                } else if (value == 'edit') {
                    for (let i = 0; i < this.subQuestion.length; i++) {
                        if (this.sectionNo == i) {
                            this.totalsub[i] = {heading: this.secHeadingArray[i], section: []};
                            for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                                if (this.subQuestion[i].section[x].sub_questions[0].question_no == this.editQuesNo) {
                                    this.subQuestion[i].section[x] = {
                                        has_sub_question: this.multiform['controls'].repeatentry.value.length == 1 ? 0 : 1,
                                        sub_questions: this.subQuestionEntry
                                    };
                                }
                                for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                    let list = this.subQuestion[i].section[x].sub_questions[j];
                                    this.totalsub[i].section.push({
                                        sub: list.sub_question_no,
                                        answer: list.answer,
                                        quesId: list.answer_id,
                                        autoGrade: list.auto_grade,
                                        matchCase: list.match_case,
                                        typeId: list.question_type_id,
                                        quesNo: list.question_no,
                                        pageNo: list.page_no,
                                        explain: list.answer_explanation,
                                        editor: list?.editor_answer,
                                        option: list.options,
                                        array: list.array,
                                        question: list.question
                                    });
                                }
                                this.dragQuestionRevise(this.multiform['controls'].repeatentry.value.length, changedQuesNo);
                            }
                        }
                    }
                    if (this.sectionCount != this.sectionNo) {
                        this.dragCount = [];
                        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                        }
                        for (let i = 0; i < this.reloadQues; i++) {
                            const num = i + 1;
                            this.dragCount.push(num);
                        }
                    }
                }
                for (let i = 0; i < this.totalsub.length; i++) {
                    this.totalsub[i].section.sort((a, b) => parseFloat(a.quesNo) - parseFloat(b.quesNo));
                }
                for (let i = 0; i < this.subQuestion.length; i++) {
                    this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                }
                console.log(this.subQuestion, 'subQuestion');
                const controlEntry = <FormArray>this.multiform.controls['repeatentry'];
                for (let i = controlEntry.length; i >= 1; i--) {
                    controlEntry.reset();
                    this.multiform['controls'].repeatentry['controls'][0]['controls']['points'].patchValue('1');
                    this.multiform['controls'].repeatentry['controls'][0]['controls']['autograde'].patchValue(false);
                    controlEntry.removeAt(i);
                }
                this.hide = true;
                if (this.isBulkUpload) {
                    this.multiform.get('repeatentry').reset();
                    this.bulkAddingCount++;
                    if (this.bulkAddingCount === this.bulkFormData.noOfQuestions) {
                        this.entryDialog = false;
                        this.isBulkUpload = false;
                    } else {
                        this.question('10');
                    }
                } else {
                    this.entryDialog = false;
                }
                this.clickEvent();
            } else {
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }, 500);
    }

    submitBlanks(value) {
        this.blankValid = true;
        console.log(this.fillInArray, 'this.fillInArray');
        for (let i = 0; i < this.fillInArray.length; i++) {
            if (this.fillInArray[i].input.length != 0) {
                this.fillInArray[i].input.forEach((val) => {
                    if (val.value == '') {
                        this.blankValid = false;
                    } else {
                        val.value = val.value.trim();
                    }
                });
            } else {
                this.blankValid = false;
            }
        }
        setTimeout(() => {
            if (this.multiform['controls'].repeatblanks.valid && this.blankValid && !this.quesNoInvalid) {
                this.showdropdown = true;
                this.subQuestionBlanks = [];
                let list;
                let changedQuesNo = this.countList;
                console.log(this.multiform['controls'].repeatblanks.value.length, 'blank array length');
                for (let i = 0; i < this.multiform['controls'].repeatblanks.value.length; i++) {
                    let list11 = ((i + 1) + 9).toString(36).toLowerCase();

                    list = {
                        match_case: '0',
                        points: this.multiform['controls'].repeatblanks['controls'][i]['controls']['points'].value,
                        answer: this.fillInArray[i].input,
                        question: this.multiform['controls'].repeatblanks['controls'][i]['controls']['question'].value,
                        answer_explanation: this.multiform['controls'].repeatblanks['controls'][i]['controls']['explain'].value,
                        answer_id: this.multiform['controls'].repeatblanks['controls'][i]['controls']['answerId'].value,
                        page_no: this.multiform['controls'].repeatblanks['controls'][i]['controls']['page'].value,
                        auto_grade: this.multiform['controls'].repeatblanks['controls'][i]['controls']['autograde'].value == true ? '1' : '0',
                        question_no: this.countList,
                        sub_question_no: this.hide == false ? this.countList + list11 : this.countList,
                        question_type_id: '54',
                        difficulty: '0',
                        allow_exact_match: '0',
                        allow_any_text: '0',
                        minimum_line: '0',
                        array: [],
                        options: '',
                    };
                    this.subQuestionBlanks.push(list);
                    if (value == 'add') {
                        if (this.totalsub[this.sectionCount] == null) {
                            this.totalsub[this.sectionCount] = {heading: '', section: []};
                        }
                        this.totalsub[this.sectionCount].section.push({
                            sub: list.sub_question_no,
                            answer: list.answer,
                            quesId: '0',
                            typeId: list.question_type_id,
                            autoGrade: list.auto_grade,
                            explain: list.answer_explanation,
                            matchCase: list.match_case,
                            quesNo: list.question_no,
                            pageNo: list.page_no,
                            option: list.options,
                            array: list.array,
                            question: list.question
                        });
                        console.log(this.totalsub, 'this.totalsub add');
                    }
                }
                if (value == 'add') {
                    if (this.subQuestion[this.sectionCount] == null) {
                        this.subQuestion[this.sectionCount] = {heading: '', section: []};
                    }
                    this.subQuestion[this.sectionCount].section.push({
                        has_sub_question: this.multiform['controls'].repeatblanks.value.length == 1 ? 0 : 1,
                        sub_questions: this.subQuestionBlanks
                    });
                } else if (value == 'edit') {
                    for (let i = 0; i < this.subQuestion.length; i++) {
                        if (this.sectionNo == i) {
                            this.totalsub[i] = {heading: this.secHeadingArray[i], section: []};
                            for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                                if (this.subQuestion[i].section[x].sub_questions[0].question_no == this.editQuesNo) {
                                    this.subQuestion[i].section[x] = {
                                        has_sub_question: this.multiform['controls'].repeatblanks.value.length == 1 ? 0 : 1,
                                        sub_questions: this.subQuestionBlanks
                                    };
                                }
                                for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                    let list = this.subQuestion[i].section[x].sub_questions[j];
                                    this.totalsub[i].section.push({
                                        sub: list.sub_question_no,
                                        answer: list.answer,
                                        quesId: list.answer_id,
                                        autoGrade: list.auto_grade,
                                        matchCase: list.match_case,
                                        pageNo: list.page_no,
                                        typeId: list.question_type_id,
                                        explain: list.answer_explanation,
                                        quesNo: list.question_no,
                                        editor: list?.editor_answer,
                                        option: list.options,
                                        array: list.array,
                                        question: list.question
                                    });
                                }
                                this.dragQuestionRevise(this.multiform['controls'].repeatblanks.value.length, changedQuesNo);
                            }
                        }
                    }
                    if (this.sectionCount != this.sectionNo) {
                        this.dragCount = [];
                        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                        }
                        for (let i = 0; i < this.reloadQues; i++) {
                            const num = i + 1;
                            this.dragCount.push(num);
                        }
                    }
                }
                for (let i = 0; i < this.totalsub.length; i++) {
                    this.totalsub[i].section.sort((a, b) => parseFloat(a.quesNo) - parseFloat(b.quesNo));
                }
                for (let i = 0; i < this.subQuestion.length; i++) {
                    this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                }
                console.log(this.subQuestion, 'subQuestion');
                const controlBlanks = <FormArray>this.multiform.controls['repeatblanks'];
                for (let i = controlBlanks.length; i >= 1; i--) {
                    controlBlanks.reset();
                    this.multiform['controls'].repeatblanks['controls'][0]['controls']['points'].patchValue('1');
                    this.multiform['controls'].repeatblanks['controls'][0]['controls']['autograde'].patchValue(false);
                    controlBlanks.removeAt(i);
                }
                this.hide = true;
                if (this.isBulkUpload) {
                    this.multiform.get('repeatblanks').reset();
                    this.bulkAddingCount++;
                    if (this.bulkAddingCount === this.bulkFormData.noOfQuestions) {
                        this.blankDialog = false;
                        this.isBulkUpload = false;
                    } else {
                        this.question('54');
                    }
                } else {
                    this.blankDialog = false;
                }
                this.fillInArray = [];
                this.clickEvent();
            } else if (!this.blankValid) {
                this.toastr.error('Question and Answers are Mandatory Fields');
            } else {
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }, 500);
    }

    getSub(event) {
        this.subtype = event.target.textContent;
        console.log(this.subtype, 'ssub');
    }

    deleteImg() {
        this.imagepath = '';
    }

    submitEssay(value) {
        setTimeout(() => {
            if (this.multiform['controls'].repeatessay.valid && !this.quesNoInvalid) {
                this.showdropdown = true;
                this.subQuestionEssay = [];
                let list;
                let changedQuesNo = this.countList;
                console.log(this.multiform['controls'].repeatessay.value, 'listlist');
                for (let i = 0; i < this.multiform['controls'].repeatessay.value.length; i++) {
                    let list11 = ((i + 1) + 9).toString(36).toLowerCase();
                    list = {
                        options: this.multiform['controls'].repeatessay['controls'][i]['controls']['lines'].value,
                        points: this.multiform['controls'].repeatessay['controls'][i]['controls']['points'].value,
                        question_no: this.countList,
                        sub_question_no: this.hide == false ? this.countList + list11 : this.countList,
                        question_type_id: '20',
                        answer: this.multiform['controls'].repeatessay['controls'][i]['controls']['lines'].value,
                        page_no: this.multiform['controls'].repeatessay['controls'][i]['controls']['page'].value,
                        difficulty: '0',
                        allow_exact_match: '0',
                        allow_any_text: '0',
                        match_case: '0',
                        minimum_line: this.multiform['controls'].repeatessay['controls'][i]['controls']['lines'].value,
                        question: this.multiform['controls'].repeatessay['controls'][i]['controls']['question'].value,
                        answer_explanation: this.multiform['controls'].repeatessay['controls'][i]['controls']['explain'].value,
                        answer_id: this.multiform['controls'].repeatessay['controls'][i]['controls']['answerId'].value,
                        auto_grade: this.multiform['controls'].repeatessay['controls'][i]['controls']['autograde'].value == true ? '1' : '0',
                        array: []
                    };
                    this.subQuestionEssay.push(list);
                    if (value == 'add') {
                        if (this.totalsub[this.sectionCount] == null) {
                            this.totalsub[this.sectionCount] = {heading: '', section: []};
                        }
                        this.totalsub[this.sectionCount].section.push({
                            sub: list.sub_question_no,
                            answer: list.answer,
                            typeId: list.question_type_id,
                            quesNo: list.question_no,
                            quesId: '0',
                            autoGrade: list.auto_grade,
                            explain: list.answer_explanation,
                            matchCase: list.match_case,
                            pageNo: list.page_no,
                            option: list.options,
                            array: list.array,
                            question: list.question
                        });
                        console.log(this.totalsub, 'this.totalsub add');
                    }
                }
                if (value == 'add') {
                    if (this.subQuestion[this.sectionCount] == null) {
                        this.subQuestion[this.sectionCount] = {heading: '', section: []};
                    }
                    this.subQuestion[this.sectionCount].section.push({
                        has_sub_question: this.multiform['controls'].repeatessay.value.length == 1 ? 0 : 1,
                        sub_questions: this.subQuestionEssay
                    });
                    console.log(this.subQuestion, 'subQuestion');
                } else if (value == 'edit') {
                    for (let i = 0; i < this.subQuestion.length; i++) {
                        if (this.sectionNo == i) {
                            this.totalsub[i] = {heading: this.secHeadingArray[i], section: []};
                            for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                                if (this.subQuestion[i].section[x].sub_questions[0].question_no == this.editQuesNo) {
                                    this.subQuestion[i].section[x] = {
                                        has_sub_question: this.multiform['controls'].repeatessay.value.length == 1 ? 0 : 1,
                                        sub_questions: this.subQuestionEssay
                                    };
                                }
                                for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                    let list = this.subQuestion[i].section[x].sub_questions[j];
                                    this.totalsub[i].section.push({
                                        sub: list.sub_question_no,
                                        answer: list.answer,
                                        quesId: list.answer_id,
                                        typeId: list.question_type_id,
                                        quesNo: list.question_no,
                                        autoGrade: list.auto_grade,
                                        pageNo: list.page_no,
                                        explain: list.answer_explanation,
                                        matchCase: list.match_case,
                                        editor: list?.editor_answer,
                                        option: list.options,
                                        array: list.array,
                                        question: list.question
                                    });
                                }
                                this.dragQuestionRevise(this.multiform['controls'].repeatessay.value.length, changedQuesNo);
                            }
                        }
                    }
                    if (this.sectionCount != this.sectionNo) {
                        this.dragCount = [];
                        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                        }
                        for (let i = 0; i < this.reloadQues; i++) {
                            const num = i + 1;
                            this.dragCount.push(num);
                        }
                    }
                }
                for (let i = 0; i < this.totalsub.length; i++) {
                    this.totalsub[i].section.sort((a, b) => parseFloat(a.quesNo) - parseFloat(b.quesNo));
                }
                for (let i = 0; i < this.subQuestion.length; i++) {
                    this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                }
                console.log(this.subQuestion, 'subQuestion');
                const controlEssay = <FormArray>this.multiform.controls['repeatessay'];
                for (let i = controlEssay.length; i >= 1; i--) {
                    controlEssay.reset();
                    this.multiform['controls'].repeatessay['controls'][0]['controls']['points'].patchValue('1');
                    this.multiform['controls'].repeatessay['controls'][0]['controls']['autograde'].patchValue(false);
                    controlEssay.removeAt(i);
                }
                this.hide = true;
                if (this.isBulkUpload) {
                    this.multiform.get('repeatessay').reset();
                    this.bulkAddingCount++;
                    if (this.bulkAddingCount === this.bulkFormData.noOfQuestions) {
                        this.essayDialog = false;
                        this.isBulkUpload = false;
                    } else {
                        this.question('20');
                    }
                } else {
                    this.essayDialog = false;
                }
                this.clickEvent();
            } else {
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }, 500);

    }

    submitNumeric(value) {
        setTimeout(() => {
            if (this.multiform['controls'].repeatnumeric.valid && !this.quesNoInvalid) {
                this.showdropdown = true;
                this.subQuestionNumeric = [];
                let list;
                let changedQuesNo = this.countList;
                for (let i = 0; i < this.multiform['controls'].repeatnumeric.value.length; i++) {
                    let list11 = ((i + 1) + 9).toString(36).toLowerCase();
                    list = {
                        options: '',
                        points: this.multiform['controls'].repeatnumeric['controls'][i]['controls']['points'].value,
                        question_no: this.countList,
                        sub_question_no: this.hide == false ? this.countList + list11 : this.countList,
                        question_type_id: '30',
                        answer: this.multiform['controls'].repeatnumeric['controls'][i]['controls']['answer'].value,
                        page_no: this.multiform['controls'].repeatnumeric['controls'][i]['controls']['page'].value,
                        difficulty: '0',
                        allow_exact_match: '0',
                        allow_any_text: '0',
                        match_case: '0',
                        minimum_line: '0',
                        question: this.multiform['controls'].repeatnumeric['controls'][i]['controls']['question'].value,
                        answer_explanation: this.multiform['controls'].repeatnumeric['controls'][i]['controls']['explain'].value,
                        answer_id: this.multiform['controls'].repeatnumeric['controls'][i]['controls']['answerId'].value,
                        auto_grade: this.multiform['controls'].repeatnumeric['controls'][i]['controls']['autograde'].value == true ? '1' : '0',
                        array: []
                    };
                    this.subQuestionNumeric.push(list);
                    if (value == 'add') {
                        if (this.totalsub[this.sectionCount] == null) {
                            this.totalsub[this.sectionCount] = {heading: '', section: []};
                        }
                        this.totalsub[this.sectionCount].section.push({
                            sub: list.sub_question_no,
                            answer: list.answer,
                            quesId: '0',
                            typeId: list.question_type_id,
                            autoGrade: list.auto_grade,
                            matchCase: list.match_case,
                            quesNo: list.question_no,
                            pageNo: list.page_no,
                            explain: list.answer_explanation,
                            option: list.options,
                            array: list.array,
                            question: list.question
                        });
                    }
                }
                if (value == 'add') {
                    if (this.subQuestion[this.sectionCount] == null) {
                        this.subQuestion[this.sectionCount] = {heading: '', section: []};
                    }
                    this.subQuestion[this.sectionCount].section.push({
                        has_sub_question: this.multiform['controls'].repeatnumeric.value.length == 1 ? 0 : 1,
                        sub_questions: this.subQuestionNumeric
                    });
                } else if (value == 'edit') {
                    for (let i = 0; i < this.subQuestion.length; i++) {
                        if (this.sectionNo == i) {
                            this.totalsub[i] = {heading: this.secHeadingArray[i], section: []};
                            for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                                if (this.subQuestion[i].section[x].sub_questions[0].question_no == this.editQuesNo) {
                                    this.subQuestion[i].section[x] = {
                                        has_sub_question: this.multiform['controls'].repeatnumeric.value.length == 1 ? 0 : 1,
                                        sub_questions: this.subQuestionNumeric
                                    };
                                }
                                for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                    let list = this.subQuestion[i].section[x].sub_questions[j];
                                    this.totalsub[i].section.push({
                                        sub: list.sub_question_no,
                                        answer: list.answer,
                                        quesId: list.answer_id,
                                        typeId: list.question_type_id,
                                        autoGrade: list.auto_grade,
                                        editor: list?.editor_answer,
                                        matchCase: list.match_case,
                                        quesNo: list.question_no,
                                        pageNo: list.page_no,
                                        explain: list.answer_explanation,
                                        option: list.options,
                                        array: list.array,
                                        question: list.question
                                    });
                                }
                                this.dragQuestionRevise(this.multiform['controls'].repeatnumeric.value.length, changedQuesNo);
                            }
                        }
                    }
                    if (this.sectionCount != this.sectionNo) {
                        this.dragCount = [];
                        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                        }
                        for (let i = 0; i < this.reloadQues; i++) {
                            const num = i + 1;
                            this.dragCount.push(num);
                        }
                    }
                }
                for (let i = 0; i < this.totalsub.length; i++) {
                    this.totalsub[i].section.sort((a, b) => parseFloat(a.quesNo) - parseFloat(b.quesNo));
                }
                for (let i = 0; i < this.subQuestion.length; i++) {
                    this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                }
                const controlNumeric = <FormArray>this.multiform.controls['repeatnumeric'];
                for (let i = controlNumeric.length; i >= 1; i--) {
                    controlNumeric.reset();
                    this.multiform['controls'].repeatnumeric['controls'][0]['controls']['points'].patchValue('1');
                    this.multiform['controls'].repeatnumeric['controls'][0]['controls']['autograde'].patchValue(true);
                    controlNumeric.removeAt(i);
                }
                this.hide = true;
                if (this.isBulkUpload) {
                    this.multiform.get('repeatnumeric').reset();
                    this.bulkAddingCount++;
                    if (this.bulkAddingCount === this.bulkFormData.noOfQuestions) {
                        this.numericDialog = false;
                        this.isBulkUpload = false;
                    } else {
                        this.question('30');
                    }
                } else {
                    this.numericDialog = false;
                }
                this.clickEvent();
            } else {
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }, 500);
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

    submitGraph(value) {
        setTimeout(() => {
            if (this.graphform.valid && this.graphBoardValue.attr && !this.quesNoInvalid) {
                this.showdropdown = true;
                this.subQuestionGraph = [];
                let list;
                let changedQuesNo = this.countList;
                let objects = {};
                for (let el in this.graphBoardValue.objects) {
                    let inherit = [];
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
                let graph = {
                    attr: this.graphBoardValue.attr,
                    objects: objects
                };
                this.graphform.controls.answer.patchValue(stringify(graph));
                list = {
                    options: '',
                    points: this.graphform.controls.points.value,
                    question_no: this.countList,
                    sub_question_no: this.countList,
                    question_type_id: '40',
                    answer: this.graphform.controls.answer.value,
                    difficulty: '0',
                    allow_exact_match: '0',
                    allow_any_text: '0',
                    match_case: '0',
                    minimum_line: '0',
                    editor_answer: this.graphform.controls.editorAnswer.value,
                    question: this.graphform.controls.question.value,
                    page_no: this.graphform.controls.page.value,
                    answer_explanation: this.graphform.controls.explain.value,
                    answer_id: this.graphform.controls.answerId.value,
                    auto_grade: '0',
                    array: []
                };
                this.subQuestionGraph.push(list);
                if (value == 'add') {
                    if (this.totalsub[this.sectionCount] == null) {
                        this.totalsub[this.sectionCount] = {heading: '', section: []};
                    }
                    this.totalsub[this.sectionCount].section.push({
                        sub: list.sub_question_no,
                        answer: list.answer,
                        quesId: '0',
                        typeId: list.question_type_id,
                        autoGrade: list.auto_grade,
                        explain: list.answer_explanation,
                        matchCase: list.match_case,
                        quesNo: list.question_no,
                        pageNo: list.page_no,
                        option: list.options,
                        array: list.array,
                        editor: list.editor_answer,
                        question: list.question
                    });
                }
                // }
                if (value == 'add') {
                    if (this.subQuestion[this.sectionCount] == null) {
                        this.subQuestion[this.sectionCount] = {heading: '', section: []};
                    }
                    this.subQuestion[this.sectionCount].section.push({
                        has_sub_question: 0,
                        sub_questions: this.subQuestionGraph
                    });
                } else if (value == 'edit') {
                    for (let i = 0; i < this.subQuestion.length; i++) {
                        if (this.sectionNo == i) {
                            this.totalsub[i] = {heading: this.secHeadingArray[i], section: []};
                            for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                                if (this.subQuestion[i].section[x].sub_questions[0].question_no == this.editQuesNo) {
                                    this.subQuestion[i].section[x] = {
                                        has_sub_question: 0,
                                        sub_questions: this.subQuestionGraph
                                    };
                                }
                                for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                    let list = this.subQuestion[i].section[x].sub_questions[j];
                                    this.totalsub[i].section.push({
                                        sub: list.sub_question_no,
                                        answer: list.answer,
                                        quesId: list.answer_id,
                                        typeId: list.question_type_id,
                                        autoGrade: list.auto_grade,
                                        matchCase: list.match_case,
                                        editor: list?.editor_answer,
                                        explain: list.answer_explanation,
                                        quesNo: list.question_no,
                                        pageNo: list.page_no,
                                        option: list.options,
                                        array: list.array,
                                        question: list.question
                                    });
                                }
                                this.dragQuestionRevise(1, changedQuesNo);

                            }
                        }
                    }
                    if (this.sectionCount != this.sectionNo) {
                        this.dragCount = [];
                        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                        }
                        for (let i = 0; i < this.reloadQues; i++) {
                            const num = i + 1;
                            this.dragCount.push(num);
                        }
                    }
                }
                for (let i = 0; i < this.totalsub.length; i++) {
                    this.totalsub[i].section.sort((a, b) => parseFloat(a.quesNo) - parseFloat(b.quesNo));
                }
                for (let i = 0; i < this.subQuestion.length; i++) {
                    this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
                }
                this.hide = true;
                if (this.isBulkUpload) {
                    this.showGraph = false;
                    this.graphform.reset();
                    this.bulkAddingCount++;
                    if (this.bulkAddingCount === this.bulkFormData.noOfQuestions) {
                        this.graphDialog = false;
                        this.showGraph = true;
                    } else {
                        // $('#log40').attr('data-target');
                        // $('#log40').attr('data-toggle', 'modal');
                        this.question('40');
                        setTimeout(() => {
                            this.showGraph = true;
                        });
                    }
                } else {
                    this.graphDialog = false;
                }
                this.clickEvent();
            } else {
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }, 500);

    }

    updateGraphValue(type) {
        // this.childGraph.submitValue();
        this.submitGraph(type);
    }

    graphDetail(val) {
        this.graphShow = parse(val);
        this.modalRef = this.modalService.open(this.viewGraph, {size: 'xl', backdrop: 'static'});
    }

    deletePdf() {
        this.answerpdfpath = [];
        this.attachment1.nativeElement.value = '';
    }

    deleteVersion() {
        this.teacherVersion = [];
        this.attachment2.nativeElement.value = '';
    }

    getEmitedValue(event) {
        this.markType = event;
    }

    getGraphQuestionValue(event, id) {
        this.graphQuestion[id] = event;
        this.graphform.controls.question.patchValue(event.content);
    }

    getGraphAnswerValue(event) {
        this.graphBoardValue = event;
    }

    getEditorAnswerValue(event) {
        this.graphEditorAnswerValue = event;
        if (this.graphform.controls) {
            this.graphform.controls.editorAnswer.patchValue(event.content);
        }
    }

    getQuestionValue(event, id, formarray) {
        this.numericQuestion[id] = event;
        if (formarray[id]) {
            formarray[id]['controls']['question'].patchValue(event.content);
        }
    }

    getExplanationValue(event, id, formarray) {
        this.numericExplain[id] = event;
        if (formarray[id]) {
            formarray[id]['controls']['explain'].patchValue(event.content);
        }
    }

    getGraphExplain(event, id) {
        this.numericExplain[id] = event;
        if (this.graphform.controls) {
            this.graphform.controls.explain.patchValue(event.content);
        }
    }

    getFillinQuestionValue(event, id) {
        if (!this.deleteFillBlanks) {
            this.numericQuestion[id] = event;
            if (this.multiform.get('repeatblanks')['controls'][id]) {
                this.multiform.get('repeatblanks')['controls'][id]['controls']['question'].patchValue(this.numericQuestion[id].content);
            }
            // this.multiform?.controls?.repeatblanks[id]?.controls?.question.patchValue(event.content);
            let val = event.content.split(' ');
            let count = 0;
            if (this.fillInArray[id]) {
            } else {
                this.fillInArray[id] = {input: []};
            }
            val.forEach((item, index) => {
                if (item == 'class="inputValue"') {
                    count += 1;
                    if (count > this.fillInArray[id].input.length) {
                        this.fillInArray[id].input.push({id: index + '-input', index, value: ''});
                    }
                }
            });
            let spl = this.fillInArray[id].input.length - count;
            if (spl != 0) {
                this.fillInArray[id].input.splice(this.fillInArray[id].input.length - 1, spl);
            }
        }
    }

    getNumericAnswerValue(event, id) {
        this.numericAnswer[id] = event;
        if (this.multiform['controls']?.repeatnumeric['controls'][id]) {
            this.multiform['controls']?.repeatnumeric['controls'][id]['controls']['answer']?.patchValue(event.content);
        }
    }
    addBulkQuestion() {
        this.modalRef = this.modalService.open(this.addBulk, {size: 'lg', backdrop: 'static'});
    }
    createBulkQues() {
        if (this.bulkQuestionForm.valid) {
            this.isBulkUpload = true;
            this.bulkFormData = this.bulkQuestionForm.value;
            this.bulkAddingCount = 0;
            console.log(this.bulkFormData, 'bulkFormData');
            if (this.bulkFormData.section === '') {
                this.addSec(this.bulkFormData.sectionName);
            } else if (this.bulkFormData.section !== undefined && this.bulkFormData.section !== null) {
                this.sectionCount = this.bulkFormData.section;
            }
            this.modalRef.close();
            this.bulkQuestionForm.reset();
            this.question(this.bulkFormData.questionType);
        } else {
            this.toastr.error('Please Enter Mandatory Fields');
        }

    }

    async editAction(list, event, data, section, index) {
        let id = list.typeId;
        this.numericQuestion = [];
        this.numericExplain = [];
        this.deleteFillBlanks = false;
        // this.shapesType = '';
        this.fillInArray = [];
        this.submitType = 'edit';
        this.editIndexValue = index;
        this.editQuesNo = list.quesNo;
        this.sectionNo = section;
        this.countList = list.quesNo;
        if (id == '1') {
            this.multiDialog = true;
            this.showdropdown = true;
            const controlmulti = <FormArray>this.multiform.controls['repeatlink'];
            for (let i = controlmulti.length; i >= 0; i--) {
                controlmulti.reset();
                controlmulti.removeAt(i);
            }
            // this.countList = this.dragCount.length + 1;
        } else if (id == '3') {
            // this.countList = this.dragCount.length + 1;
            this.trueDialog = true;
            this.showdropdown = true;
            const controlChoose = <FormArray>this.multiform.controls['repeatchoose'];
            for (let i = controlChoose.length; i >= 0; i--) {
                controlChoose.reset();
                controlChoose.removeAt(i);
            }
        } else if (id == '9') {
            // this.countList = this.dragCount.length + 1;
            this.choiceDialog = true;
            this.showdropdown = true;
            const controlPlus = <FormArray>this.multiform.controls['repeatplus'];
            for (let i = controlPlus.length; i >= 0; i--) {
                controlPlus.reset();
                controlPlus.removeAt(i);
            }
        } else if (id == '10') {
            // this.countList = this.dragCount.length + 1;
            this.entryDialog = true;
            this.showdropdown = true;
            const controlEntry = <FormArray>this.multiform.controls['repeatentry'];
            for (let i = controlEntry.length; i >= 0; i--) {
                controlEntry.reset();
                controlEntry.removeAt(i);
            }
        } else if (id == '20') {
            // this.countList = this.dragCount.length + 1;
            this.essayDialog = true;
            this.showdropdown = true;
            const controlEssay = <FormArray>this.multiform.controls['repeatessay'];
            for (let i = controlEssay.length; i >= 0; i--) {
                controlEssay.removeAt(i);
            }
        } else if (id == '30') {
            // this.modalRef = this.modalService.open(this.numericData,  {size: 'md', backdrop: 'static'});
            this.numericDialog = true;
            this.showdropdown = true;
            const controlNumeric = <FormArray>this.multiform.controls['repeatnumeric'];
            for (let i = controlNumeric.length; i >= 0; i--) {
                controlNumeric.removeAt(i);
            }
        } else if (id == '40') {
            this.graphDialog = true;
            this.graphBoardValue = '';
            // this.modalRef = this.modalService.open(this.graph,  {size: 'lg', backdrop: 'static'});
            this.showdropdown = true;
        } else if (id == '54') {
            this.showdropdown = true;
            this.blankDialog = true;
            const controlBlanks = <FormArray>this.multiform.controls['repeatblanks'];
            for (let i = controlBlanks.length; i >= 0; i--) {
                controlBlanks.removeAt(i);
            }
        }
        let valid = 0;
        for (let i = 0; i < event.length; i++) {
            valid += 1;
            if (section == i) {
                for (let x = 0; x < event[i].section.length; x++) {
                    for (let j = 0; j < event[i].section[x].sub_questions.length; j++) {
                        if (list.quesNo == event[i].section[x].sub_questions[j].question_no) {
                            this.InitialArrayLength = event[i].section[x].sub_questions.length;
                            if (event[i].section[x].sub_questions.length > 1) {
                                this.hide = false;
                            }
                            if (id == '1') {
                                this.repeatlink = this.multiform.get('repeatlink') as FormArray;
                                this.repeatlink.push(this.createlink());
                                this.multiform['controls'].repeatlink['controls'][j]['controls']['option'].patchValue(event[i].section[x].sub_questions[j].options);
                                this.multiform['controls'].repeatlink['controls'][j]['controls']['answerId'].patchValue(event[i].section[x].sub_questions[j].answer_id);
                                this.multiform['controls'].repeatlink['controls'][j]['controls']['points'].patchValue(event[i].section[x].sub_questions[j].points);
                                this.multiform['controls'].repeatlink['controls'][j]['controls']['page'].patchValue(event[i].section[x].sub_questions[j].page_no);
                                this.multiform['controls'].repeatlink['controls'][j]['controls']['array'].patchValue(event[i].section[x].sub_questions[j].array);
                                this.multiform['controls'].repeatlink['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                this.multiform['controls'].repeatlink['controls'][j]['controls']['autograde'].patchValue(event[i].section[x].sub_questions[j].auto_grade == '1');
                                this.multiform['controls'].repeatlink['controls'][j]['controls']['array'].value.forEach((val, activid) => {
                                    if (val == event[i].section[x].sub_questions[j].answer) {
                                        this.multiform['controls'].repeatlink['controls'][j]['controls']['active'].patchValue(activid);
                                        this.multiform['controls'].repeatlink['controls'][j]['controls']['correct'].patchValue(val);
                                    }
                                });

                            } else if (id == '3') {
                                this.repeatchoose = this.multiform.get('repeatchoose') as FormArray;
                                this.repeatchoose.push(this.createchoose());
                                this.multiform['controls'].repeatchoose['controls'][j]['controls']['optradio'].patchValue(event[i].section[x].sub_questions[j].answer);
                                this.multiform['controls'].repeatchoose['controls'][j]['controls']['points1'].patchValue(event[i].section[x].sub_questions[j].points);
                                this.multiform['controls'].repeatchoose['controls'][j]['controls']['page'].patchValue(event[i].section[x].sub_questions[j].page_no);
                                this.multiform['controls'].repeatchoose['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                this.multiform['controls'].repeatchoose['controls'][j]['controls']['answerId'].patchValue(event[i].section[x].sub_questions[j].answer_id);
                                this.multiform['controls'].repeatchoose['controls'][j]['controls']['autograde'].patchValue(event[i].section[x].sub_questions[j].auto_grade == '1');
                            } else if (id == '9') {
                                this.repeatplus = this.multiform.get('repeatplus') as FormArray;
                                this.repeatplus.push(this.truelink());
                                this.repeattotalplus = this.multiform['controls'].repeatplus['controls'][j]['controls']['choiceList']['controls'] as FormArray;
                                for (let k = 0; k < event[i].section[x].sub_questions[j].array.length - 1; k++) {
                                    this.repeattotalplus.push(this.addlink());
                                }
                                let answerOptionList = [];
                                for (let k = 0; k < event[i].section[x].sub_questions[j].array.length; k++) {
                                    const val = event[i].section[x].sub_questions[j].array[k].choice;
                                    this.repeattotalplus[k]['controls'].choice.patchValue(val);
                                    answerOptionList.push({choice: val});
                                }
                                this.multiform['controls'].repeatplus['controls'][j]['controls']['optionList']['controls'] = [];
                                this.multiform['controls'].repeatplus['controls'][j]['controls']['autograde'].patchValue(event[i].section[x].sub_questions[j].auto_grade == '1');
                                this.multiform['controls'].repeatplus['controls'][j]['controls'].optionList.patchValue(answerOptionList);
                                for (let z = 0; z < this.multiform['controls'].repeatplus['controls'][j]['controls']['optionList'].value.length; z++) {
                                    const correct = this.multiform['controls'].repeatplus['controls'][j]['controls']['optionList'].value[z];
                                    if (correct.choice == event[i].section[x].sub_questions[j].answer) {
                                        this.multiform['controls'].repeatplus['controls'][j]['controls']['active'].patchValue(z);
                                        this.multiform['controls'].repeatplus['controls'][j]['controls']['answer'].patchValue(event[i].section[x].sub_questions[j].answer);
                                    }
                                }
                                this.multiform['controls'].repeatplus['controls'][j]['controls']['points'].patchValue(event[i].section[x].sub_questions[j].points);
                                this.multiform['controls'].repeatplus['controls'][j]['controls']['page'].patchValue(event[i].section[x].sub_questions[j].page_no);
                                this.multiform['controls'].repeatplus['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                this.multiform['controls'].repeatplus['controls'][j]['controls']['answerId'].patchValue(event[i].section[x].sub_questions[j].answer_id);
                            } else if (id == '10') {
                                this.repeatentry = this.multiform.get('repeatentry') as FormArray;
                                this.repeatentry.push(this.createentry());
                                this.multiform['controls'].repeatentry['controls'][j]['controls']['correct'].patchValue(event[i].section[x].sub_questions[j].answer);
                                this.multiform['controls'].repeatentry['controls'][j]['controls']['points'].patchValue(event[i].section[x].sub_questions[j].points);
                                this.multiform['controls'].repeatentry['controls'][j]['controls']['page'].patchValue(event[i].section[x].sub_questions[j].page_no);
                                this.multiform['controls'].repeatentry['controls'][j]['controls']['matchCase'].patchValue(event[i].section[x].sub_questions[j].match_case == '1');
                                this.multiform['controls'].repeatentry['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                this.multiform['controls'].repeatentry['controls'][j]['controls']['answerId'].patchValue(event[i].section[x].sub_questions[j].answer_id);
                                this.multiform['controls'].repeatentry['controls'][j]['controls']['autograde'].patchValue(event[i].section[x].sub_questions[j].auto_grade == '1');
                            } else if (id == '20') {
                                this.repeatessay = this.multiform.get('repeatessay') as FormArray;
                                this.repeatessay.push(this.createessay());
                                this.multiform['controls'].repeatessay['controls'][j]['controls']['lines'].patchValue(event[i].section[x].sub_questions[j].minimum_line);
                                this.multiform['controls'].repeatessay['controls'][j]['controls']['points'].patchValue(event[i].section[x].sub_questions[j].points);
                                this.multiform['controls'].repeatessay['controls'][j]['controls']['page'].patchValue(event[i].section[x].sub_questions[j].page_no);
                                this.multiform['controls'].repeatessay['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                this.multiform['controls'].repeatessay['controls'][j]['controls']['answerId'].patchValue(event[i].section[x].sub_questions[j].answer_id);
                                this.multiform['controls'].repeatessay['controls'][j]['controls']['autograde'].patchValue(event[i].section[x].sub_questions[j].auto_grade == '1');
                            } else if (id == '30') {
                                this.repeatnumeric = this.multiform.get('repeatnumeric') as FormArray;
                                this.repeatnumeric.push(this.createnumeric());
                                this.multiform['controls'].repeatnumeric['controls'][j]['controls']['answer'].patchValue(event[i].section[x].sub_questions[j].answer);
                                this.multiform['controls'].repeatnumeric['controls'][j]['controls']['points'].patchValue(event[i].section[x].sub_questions[j].points);
                                this.multiform['controls'].repeatnumeric['controls'][j]['controls']['page'].patchValue(event[i].section[x].sub_questions[j].page_no);
                                this.multiform['controls'].repeatnumeric['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                this.multiform['controls'].repeatnumeric['controls'][j]['controls']['answerId'].patchValue(event[i].section[x].sub_questions[j].answer_id);
                                this.multiform['controls'].repeatnumeric['controls'][j]['controls']['autograde'].patchValue(event[i].section[x].sub_questions[j].auto_grade == '1');
                            } else if (id == '40') {
                                this.graphBoardValue = parse(event[i].section[x].sub_questions[j].answer);
                                this.graphform.controls.answer.patchValue(event[i].section[x].sub_questions[j].answer);
                                this.graphform.controls.points.patchValue(event[i].section[x].sub_questions[j].points);
                                this.graphform.controls.page.patchValue(event[i].section[x].sub_questions[j].page_no);
                                this.graphform.controls.question.patchValue(event[i].section[x].sub_questions[j].question);
                                this.graphform.controls.answerId.patchValue(event[i].section[x].sub_questions[j].answer_id);
                                this.graphform.controls.editorAnswer.patchValue(event[i].section[x].sub_questions[j].editor_answer);
                                this.graphform.controls.autograde.patchValue(event[i].section[x].sub_questions[j].auto_grade == '1');
                            } else if (id == '54') {
                                this.repeatblanks = this.multiform.get('repeatblanks') as FormArray;
                                this.repeatblanks.push(this.createblanks());
                                this.multiform['controls'].repeatblanks['controls'][j]['controls']['answer'].patchValue(event[i].section[x].sub_questions[j].answer);
                                this.multiform['controls'].repeatblanks['controls'][j]['controls']['points'].patchValue(event[i].section[x].sub_questions[j].points);
                                this.multiform['controls'].repeatblanks['controls'][j]['controls']['page'].patchValue(event[i].section[x].sub_questions[j].page_no);
                                this.multiform['controls'].repeatblanks['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                this.multiform['controls'].repeatblanks['controls'][j]['controls']['answerId'].patchValue(event[i].section[x].sub_questions[j].answer_id);
                                this.multiform['controls'].repeatblanks['controls'][j]['controls']['autograde'].patchValue(event[i].section[x].sub_questions[j].auto_grade == '1');
                            }
                        }
                    }
                }
            }
        }
        if (valid == event.length) {
            this.secondFunction(list.quesNo, id, event, data, section, index);

        }


    }

    //2. Create an async function
    async secondFunction(no, id, event, data, section, index) {
        //3. Await for the first function to complete
        // let result = await this.firstFunction(no, id, event, data, section, index)
        this.patchNumereic(no, id, event, data, section, index);

    };


    async patchNumereic(no, id, event, data, section, index) {
        setTimeout(() => {
            for (let i = 0; i < event.length; i++) {
                if (section == i) {
                    for (let x = 0; x < event[i].section.length; x++) {
                        for (let j = 0; j < event[i].section[x].sub_questions.length; j++) {
                            if (no == event[i].section[x].sub_questions[j].question_no) {
                                if (id != '40') {
                                    this.numericQuestion[j]?.editor.setContent(event[i].section[x].sub_questions[j].question);
                                } else {
                                    this.graphEditorAnswerValue.editor.setContent(event[i].section[x].sub_questions[j].editor_answer);
                                    this.graphQuestion[j].editor.setContent(event[i].section[x].sub_questions[j].question);
                                    this.graphQuestion[j].content = event[i].section[x].sub_questions[j].question;
                                }
                                if (id == '30') {
                                    this.numericAnswer[j].editor.setContent(event[i].section[x].sub_questions[j].answer);
                                    this.numericAnswer[j].content = event[i].section[x].sub_questions[j].question;
                                } else if (id == '54') {
                                    this.deleteFillBlanks = false;
                                    this.getFillinQuestionValue(this.numericQuestion[j], j);
                                }
                                this.numericExplain[j]?.editor.setContent(event[i].section[x].sub_questions[j].answer_explanation);
                                if (id == '1') {
                                    this.multiform['controls'].repeatlink['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                    this.multiform['controls'].repeatlink['controls'][j]['controls']['explain'].patchValue(event[i].section[x].sub_questions[j].answer_explanation);
                                } else if (id == '3') {
                                    this.multiform['controls'].repeatchoose['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                    this.multiform['controls'].repeatchoose['controls'][j]['controls']['explain'].patchValue(event[i].section[x].sub_questions[j].answer_explanation);
                                } else if (id == '9') {
                                    this.multiform['controls'].repeatplus['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                    this.multiform['controls'].repeatplus['controls'][j]['controls']['explain'].patchValue(event[i].section[x].sub_questions[j].answer_explanation);
                                } else if (id == '10') {
                                    this.multiform['controls'].repeatentry['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                    this.multiform['controls'].repeatentry['controls'][j]['controls']['explain'].patchValue(event[i].section[x].sub_questions[j].answer_explanation);
                                } else if (id == '20') {
                                    this.multiform['controls'].repeatessay['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                    this.multiform['controls'].repeatessay['controls'][j]['controls']['explain'].patchValue(event[i].section[x].sub_questions[j].answer_explanation);
                                } else if (id == '30') {
                                    this.multiform['controls'].repeatnumeric['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                    this.multiform['controls'].repeatnumeric['controls'][j]['controls']['answer'].patchValue(event[i].section[x].sub_questions[j].answer);
                                    this.multiform['controls'].repeatnumeric['controls'][j]['controls']['explain'].patchValue(event[i].section[x].sub_questions[j].answer_explanation);
                                } else if (id == '40') {
                                    this.graphform.controls.question.patchValue(event[i].section[x].sub_questions[j].question);
                                    this.graphform.controls.explain.patchValue(event[i].section[x].sub_questions[j].answer_explanation);
                                    this.graphform.controls.editorAnswer.patchValue(event[i].section[x].sub_questions[j].editor_answer);
                                } else if (id == '54') {
                                    this.multiform['controls'].repeatblanks['controls'][j]['controls']['question'].patchValue(event[i].section[x].sub_questions[j].question);
                                    this.fillInArray[j].input = event[i].section[x].sub_questions[j].answer;
                                    this.multiform['controls'].repeatblanks['controls'][j]['controls']['answer'].patchValue(event[i].section[x].sub_questions[j].answer);
                                    this.multiform['controls'].repeatblanks['controls'][j]['controls']['explain'].patchValue(event[i].section[x].sub_questions[j].answer_explanation);
                                }
                            }
                        }
                    }
                }
            }
        }, 3000);
    }

    deleteAlertView(no, section, id) {
        this.modalRef = this.modalService.open(this.deleteAlert, {size: 'md', backdrop: 'static'});
        this.deleteID = no;
        this.delSection = section;
        console.log(id, 'quesId');
        this.questionId = id;
    }

    deleteSection(section) {
        // this.shapesType = '';
        this.modalRef = this.modalService.open(this.deleteSectionPopup, {size: 'md', backdrop: 'static'});
        this.delSection = section;
    }

    deleteSectionConfirm(section) {
        const ides = [];
        for (let i = 0; i < this.subQuestion[section].section.length; i++) {
            for (let j = 0; j < this.subQuestion[section].section[i].sub_questions.length; j++) {
                const id = this.subQuestion[section].section[i].sub_questions[j].answer_id;
                if (id != '0') {
                    ides.push(id);
                }
            }
        }
        this.deleteQuestion(ides);
        this.totalsub.splice(section, 1);
        this.subQuestion.splice(section, 1);
        this.secHeadingArray.splice(section, 1);
        this.modalRef.close();
        this.clickEvent();
    }

    deleteCancel() {
        this.close();
    }

    deleteSub(array, id) {
        this.deleteFillBlanks = true;
        this.repeatlink = array as FormArray;
        console.log(this.repeatlink.value[id].answerId, 'this.repeatlink[id]');
        if (this.repeatlink.value[id].answerId != '0') {
            this.deleteQuestion([this.repeatlink.value[id].answerId]);
        }
        this.repeatlink.removeAt(id);
        this.numericQuestion.splice(id, 1);
        if (array == this.multiform.get('repeatblanks')) {
            setTimeout(() => {
                let val = this.fillInArray.filter((item, index) => {
                    if (index == id) {
                        item.input = [];
                    }
                    return index != id;
                });
                this.fillInArray = [];
                this.fillInArray = [...val];
                this.deleteFillBlanks = false;
                console.log(this.fillInArray, 'splice');
            }, 100);
            this.cdr.detectChanges();
        }
        if (array.length == 1) {
            this.hide = true;
        }
        this.cdr.detectChanges();

    }

    deleteQues(no, section, id) {
        this.sliced = false;
        for (let i = 0; i < this.subQuestion.length; i++) {
            if (i == section) {
                for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                    if (this.sliced == false) {
                        this.sliceNo = x + 10;
                    }
                    for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                        if (no == this.subQuestion[i].section[x].sub_questions[j].sub_question_no) {
                            this.slicedQuesNo = this.subQuestion[i].section[x].sub_questions[j].question_no;
                            this.subQuestion[i].section[x].sub_questions.splice(j, 1);
                            this.sliceNo = x;
                            this.sliced = true;
                        }
                    }
                    if (this.subQuestion[i].section[x].sub_questions.length == 0) {
                        this.subQuestion[i].section.splice(x, 1);
                        this.sliceNo = -1;
                    }
                    if (this.sliceNo == x) {
                        if (this.subQuestion[i].section[x] != null) {
                            for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                                let sub = ((j + 1) + 9).toString(36).toLowerCase();
                                this.subQuestion[i].section[x].sub_questions[j].sub_question_no = this.subQuestion[i].section[x].sub_questions.length == 1 ? (this.slicedQuesNo) : (this.slicedQuesNo) + sub;
                                this.subQuestion[i].section[x].sub_questions[j].question_no = this.slicedQuesNo;
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < this.subQuestion.length; i++) {
            if (this.subQuestion[i].section.length == 0) {
                this.subQuestion.splice(i, 1);
                this.secHeadingArray.splice(i, 1);
                if (this.subQuestion.length != 0) {
                    this.sectionCount -= 1;
                } else {
                    this.sectionCount = 0;
                }
            }
        }
        this.totalsub = [];
        if (this.subQuestion.length != 0) {
            for (let i = 0; i < this.subQuestion.length; i++) {
                if (this.totalsub[i] == null) {
                    this.totalsub[i] = {heading: '', section: []};
                }
                for (let x = 0; x < this.subQuestion[i].section.length; x++) {
                    for (let j = 0; j < this.subQuestion[i].section[x].sub_questions.length; j++) {
                        const list = this.subQuestion[i].section[x].sub_questions[j];
                        this.totalsub[i].section.push({
                            sub: list.sub_question_no,
                            answer: list.answer,
                            typeId: list.question_type_id,
                            quesId: list.answer_id,
                            autoGrade: list.auto_grade,
                            matchCase: list.match_case,
                            quesNo: list.question_no,
                            editor: list?.editor_answer,
                            explain: list.answer_explanation,
                            option: list.options,
                            array: list.array,
                            question: list.question
                        });
                    }
                }
            }
            if (section != this.sectionCount) {
                this.dragCount = [];
                for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                    this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                }
                for (let i = 0; i < this.reloadQues; i++) {
                    const num = i + 1;
                    this.dragCount.push(num);
                }
            }
        }
        if (id !== '0') {
            this.deleteQuestion(id);
        }
        this.modalRef.close();
        this.clickEvent();
    }

    deleteQuestion(id) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            answer_id: id
        };
        this.creator.deleteQuestion(data).subscribe((successData) => {
                this.deleteQuestionSuccess(successData);
            },
            (error) => {
                this.deleteQuestionFailure(error);
            });
    }

    deleteQuestionSuccess(successData) {
        if (successData.isSuccess) {
            console.log(successData.responseObject);
        }
    }

    deleteQuestionFailure(error) {
        console.log(error);
    }

    close() {
        this.modalRef.close();
    }

    closeDialog() {
        this.multiDialog = false;
        this.trueDialog = false;
        this.choiceDialog = false;
        this.entryDialog = false;
        this.essayDialog = false;
        this.numericDialog = false;
        this.graphDialog = false;
        this.blankDialog = false;
        this.isBulkUpload = false;
        this.hide = true;
        this.dragCount = [];
        if (this.subQuestion[this.sectionCount] != null) {
            console.log(this.subQuestion[this.sectionCount], 'in');
            for (let i = 0; i < this.countList - 1; i++) {
                const num = i + 1;
                this.dragCount.push(num);
            }
        }
        this.numericQuestion = [];
    }

    truefunction(id, index) {
        for (let i = 0; i < this.multiform['controls'].repeatchoose['controls'].length; i++) {
            if (index == i) {
                this.multiform['controls'].repeatchoose['controls'][index]['controls']['optradio'].patchValue(id.target.checked);
            }
        }
    }

    falsefunction(id, value) {
        console.log(id, value, 'Valueeee');
    }

    classList(id) {
        if (id == '1') {
            this.type = 'Description';
        } else if (id == '2') {
            this.type = 'Workspace';
        } else if (id == '3') {
            this.type = 'Preview';
        }
    }

    deleteAction() {
        this.modalRef = this.modalService.open(this.deleteClass, {size: 'md', backdrop: 'static'});
    }

    getIcons() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
        };
        this.creator.iconList(data).subscribe((successData) => {
                this.iconListSuccess(successData);
            },
            (error) => {
                this.iconListFailure(error);
            });
    }

    iconListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            console.log(successData, 'error');
            this.icons = successData.ResponseObject;
            console.log(this.icons, 'icons');
        }
    }

    iconListFailure(error) {
        console.log(error, 'error');
    }

    subjectList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            type: 'active'
        };
        this.classService.subjectList(data).subscribe((successData) => {
                this.subjectListSuccess(successData);
            },
            (error) => {
                this.subjectListFailure(error);
            });
    }

    subjectListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.subjectData = successData.ResponseObject;
        }
    }

    subjectListFailure(error) {
        console.log(error, 'error');
    }

    gradeList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            type: 'active'
        };
        this.classService.gradeList(data).subscribe((successData) => {
                this.gradeListSuccess(successData);
            },
            (error) => {
                this.gradeListFailure(error);
            });
    }

    gradeListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.gradeData = successData.ResponseObject;
        }
    }

    gradeListFailure(error) {
        console.log(error, 'error');
    }

    listDetails(event) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: event.content_id,
            content_format: event.content_format,
            content_type: event.content_type,
            school_id: event.school_id
        };
        this.creator.repositoryDetail(data).subscribe((successData) => {
                this.detailsSuccess(successData);
            },
            (error) => {
                this.detailsFailure(error);
            });
    }

    detailsSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.editData = successData.ResponseObject;
            console.log(this.editData.batch_id, 'batch');
            this.contentName = this.editData.name;
            this.areaInfo = this.editData.annotation;
            this.dragQuestionsList = this.editData.questionAnnotation;
            this.showdropdown = true;
            if (this.editData.status == 5) {
                this.draftAdd = 'publish';
            }
            this.subQuestion = this.editData.answers;
            for (let i = 0; i < this.subQuestion.length; i++) {
                this.subQuestion[i].section.sort((a, b) => parseFloat(a.sub_questions[0].question_no) - parseFloat(b.sub_questions[0].question_no));
            }
            this.showpdf = this.common.convertBase64(this.editData.file_path);
            console.log(this.showpdf, 'showpdf');
            this.getpdf = this.showpdf[0];
            if(this.getpdf.links == undefined) {
                this.getpdf.links = [];
            }
            this.resourceLinks = this.getpdf?.links;
            this.answerpdfpath = this.common.convertBase64(this.editData.answerkey_path);
            this.showAnswerKey = this.editData.allow_answer_key == '1';
            this.teacherVersion = this.editData.teacher_version;
            for (let i = 0; i < this.editData.answers.length; i++) {
                this.sectionCount = i;
                this.totalsub[i] = {heading: '', section: []};
                this.secHeadingArray[i] = this.editData.answers[i].heading;
                for (let x = 0; x < this.editData.answers[i].section.length; x++) {
                    let ans = this.editData.answers[i].section[x];
                    const num = x + 1;
                    for (let j = 0; j < ans.sub_questions.length; j++) {
                        if (ans.sub_questions[j].question_type_id == '3') {
                            this.totalsub[i].section.push({
                                answer: ans.sub_questions[j].answer,
                                sub: ans.sub_questions[j].sub_question_no,
                                quesId: ans.sub_questions[j].answer_id,
                                pageNo: ans.sub_questions[j].page_no,
                                typeId: ans.sub_questions[j].question_type_id,
                                autoGrade: ans.sub_questions[j].auto_grade,
                                matchCase: ans.sub_questions[j].match_case,
                                explain: ans.sub_questions[j].answer_explanation,
                                quesNo: ans.sub_questions[j].question_no,
                                question: ans.sub_questions[j].question,
                                array: ans.sub_questions[j].array
                            });
                        } else {
                            this.totalsub[i].section.push({
                                answer: ans.sub_questions[j].answer,
                                sub: ans.sub_questions[j].sub_question_no,
                                quesId: ans.sub_questions[j].answer_id,
                                pageNo: ans.sub_questions[j].page_no,
                                typeId: ans.sub_questions[j].question_type_id,
                                autoGrade: ans.sub_questions[j].auto_grade,
                                matchCase: ans.sub_questions[j].match_case,
                                explain: ans.sub_questions[j].answer_explanation,
                                editor: ans?.sub_questions[j]?.editor_answer,
                                quesNo: ans.sub_questions[j].question_no,
                                question: ans.sub_questions[j].question,
                                array: ans.sub_questions[j].array
                            });
                        }
                    }
                    this.reloadQues = this.editData.answers[i].section[x].sub_questions[0].question_no;
                }
            }
            for (let i = 0; i < this.reloadQues; i++) {
                const num = i + 1;
                this.dragCount.push(num);
            }
            if(this.getpdf.original_image_url != undefined) {
                this.isPdfAvailable = true;
                this.pdfTemplate = this.webhost + '/' + this.getpdf?.original_image_url;
            } else {
                this.isPdfAvailable = false;
            }
            this.multiform.controls.classname.patchValue(this.editData.name);
            this.multiform.controls.description.patchValue(this.editData.description);
            this.getNewlinks = [];
            if (this.editData.links != '') {
                const links = this.editData.links;
                links.forEach((item) => {
                    this.getNewlinks.push({display: item, value: item});
                });
            }
            this.multiform.controls.resourcesLink.patchValue(this.getNewlinks);
            if (this.editData.tags != '') {
                const tag = this.editData.tags.split(',');
                for (let i = 0; i < tag.length; i++) {
                    this.getTag.push({display: tag[i], value: tag[i]});
                }
            }
            this.multiform.controls.tag.patchValue(this.getTag);
            if (this.editData.grade != '') {
                this.gradeSplit = [];
                const grade = this.editData.grade.split(',');
                this.gradeSplit = [...grade];
            }
            if (this.editData.subject != '') {
                this.subjectSplit = [];
                const subject = this.editData.subject.split(',');
                for (let i = 0; i < subject.length; i++) {
                    this.subjectSplit.push(subject[i]);
                }
            }
            this.multiform.controls.grade.patchValue(this.gradeSplit);
            this.multiform.controls.subject.patchValue(this.subjectSplit);
            this.multiform.controls.option.patchValue(this.editData.access);
            if (this.editData.download == '1') {
                this.multiform.controls.downloadContent.patchValue(true);
            } else if (this.editData.download == '0') {
                this.multiform.controls.downloadContent.patchValue(false);
            }
            this.showPage = true;
            this.clickEvent();
            console.log('finish');
        }
    }

    detailsFailure(error) {
        console.log(error, 'error');
    }

    assign(value) {
        this.headingSame = false;
        this.headingEmpty = false;
        this.updatePrimaryLink();
        const corporate = this.roleid == 6 ? this.auth.getSessionData('rista-corporate_id') : undefined;
        console.log(this.treeviewCompoent, 'treeViewComponenet');
        const batchId = this.treeviewCompoent?.batchid;

        if (this.multiform.controls.tag.value != '') {
            this.tagArray = [];
            const tags = this.multiform.controls.tag.value;
            for (let i = 0; i < tags.length; i++) {
                this.tagArray.push(tags[i].value);
            }
        }
        if (this.subQuestion != []) {
            for (let i = 0; i < this.subQuestion.length; i++) {
                if (this.subQuestion.length > 1) {
                    if (this.secHeadingArray[i] != null && this.secHeadingArray[i] != '') {
                        this.subQuestion[i].heading = this.secHeadingArray[i];
                    } else if (this.secHeadingArray[i] == null || this.secHeadingArray[i] == '') {
                        document.getElementById('headingNull' + i).hidden = false;
                    }
                    if (document.getElementById('subHeading' + i).hidden == false) {
                        this.headingSame = true;
                    }
                    if (document.getElementById('headingNull' + i).hidden == false) {
                        this.headingEmpty = true;
                    }
                } else {
                    if (this.secHeadingArray[i] != null) {
                        this.subQuestion[i].heading = this.secHeadingArray[i];
                    }
                }
            }
        }

        let areaInfoData = this.areaInfo;
        console.log(areaInfoData, 'area');
        if (areaInfoData) {
            areaInfoData = areaInfoData.filter(item => !item.isDelete);
        }
        if (this.multiform.controls.resourcesLink.value != '') {
            this.resourceArray = [];
            const video = this.multiform.controls.resourcesLink.value;
            for (let i = 0; i < video.length; i++) {
                this.resourceArray.push(video[i].value);
            }
        }
        console.log(this.getpdf, 'getDpd');
        this.getpdf.links = this.getpdf.links.filter((item) => item.link !== '');

        let nameNotEntered = false;
        console.log(this.getpdf.links, 'pdf')
            this.getpdf.links.every((items) => {
                if (items.name == '') {
                    nameNotEntered = true;
                    return false;
                }
                return true;
            });

        if (!nameNotEntered) {

            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                name: this.multiform.controls.classname.value,
                description: this.multiform.controls.description.value,
                grade: this.multiform.controls.grade.value,
                subject: this.multiform.controls.subject.value,
                school_id: this.auth.getSessionData('rista-school_id'),
                file_path: [this.getpdf],
                links: this.resourceArray,
                file_text: '',
                content_type: this.uploadType == 'assessment' ? '3' : '2',
                tags: this.multiform.controls.tag.value != '' ? this.tagArray : [],
                annotation: areaInfoData,
                questionAnnotation: this.dragQuestionsList,
                assign: '0',
                classdetails: [],
                content_format: this.getpdf != [] ? '1' : '2',
                status: '1',
                profile_url: this.imagepath,
                answerkey_path: this.answerpdfpath,
                allow_answer_key: this.showAnswerKey == true ? '1' : '0',
                teacher_version: this.teacherVersion,
                profile_thumb_url: this.imagepaththumb,
                access: this.multiform.controls.option.value,
                answers: this.subQuestion,
                editor_type: '',
                corporate_id: corporate,
                download: this.multiform.controls.downloadContent.value == true ? '1' : '0',
                batch_id: batchId == undefined ? '' : batchId
            };
            if (this.headingEmpty == false) {
                if (this.headingSame == false) {
                    if (this.uploadType == 'assessment') {
                        console.log(this.subQuestion, 'subQuestion');
                        if (value != 'edit') {
                            this.creator.assignAnnotation(data).subscribe((successData) => {
                                    this.assignSuccess(successData);
                                },
                                (error) => {
                                    this.assignFailure(error);
                                });
                        } else if (value == 'edit') {
                            data['content_id'] = this.editData.content_id;
                            this.creator.editAssignResourse(data).subscribe((successData) => {
                                    this.assignSuccess(successData);
                                },
                                (error) => {
                                    this.assignFailure(error);
                                });
                        }
                    } else {
                        if (value != 'edit') {
                            this.creator.assignAnnotation(data).subscribe((successData) => {
                                    this.assignSuccess(successData);
                                },
                                (error) => {
                                    this.assignFailure(error);
                                });
                        } else if (value == 'edit') {
                            data['content_id'] = this.editData.content_id;
                            this.creator.editAssignResourse(data).subscribe((successData) => {
                                    this.assignSuccess(successData);
                                },
                                (error) => {
                                    this.assignFailure(error);
                                });
                        }
                    }
                } else {
                    this.toastr.error('Sub heading should not be same');
                }
            } else {
                this.toastr.error('Sub heading should not be Empty');
            }
        } else {
            this.toastr.error('Name is mandatory for each additional resource links');
        }

    }

    assignSuccess(successData) {
        console.log(successData, 'successData');

        if (successData.IsSuccess) {
            this.assignData = successData.Contentdetails;
            if (this.assessmentType == 'add') {
                this.toastr.success('Content Created Successfully');
                this.modalRef = this.modalService.open(this.assignContentToClass, {size: 'md', backdrop: 'static'});
            } else {
                if (this.pdfChanged || this.valueChanged) {
                    this.multiform.controls.resourcesLink.patchValue('');
                    this.resourceArray = [];
                    this.listDetails(successData.Contentdetails);
                    this.classList(2);
                    this.pdfChanged = false;
                    this.valueChanged = false;
                } else {
                    this.router.navigate(['repository/content-home']);
                    this.toastr.success(successData.ResponseObject);
                    this.auth.removeSessionData('rista-editor');
                }
            }
        } else {
            this.toastr.error(successData.ResponseObject);
        }
    }

    assignFailure(error) {
        console.log(error, 'error');
        if (this.assessmentType == 'add') {
            this.toastr.error('Assessment publish failed');
        } else {
            this.toastr.error('Assessment update failed');
        }
    }

    draft(value) {
        this.headingSame = false;
        this.headingEmpty = false;
        this.updatePrimaryLink();
        let corporate: any;
        if (this.roleid == 6) {
            corporate = this.auth.getSessionData('rista-corporate_id');
        } else {
            corporate = undefined;
        }
        if (this.multiform.controls.tag.value != '') {
            this.tagArray = [];
            const tags = this.multiform.controls.tag.value;
            for (let i = 0; i < tags.length; i++) {
                this.tagArray.push(tags[i].value);
            }
        }
        if (this.subQuestion != []) {
            for (let i = 0; i < this.subQuestion.length; i++) {
                document.getElementById('headingNull' + i).hidden = true;
                if (this.subQuestion.length > 1) {
                    if (this.secHeadingArray[i] != null && this.secHeadingArray[i] != '') {
                        this.subQuestion[i].heading = this.secHeadingArray[i];
                    } else if (this.secHeadingArray[i] == null || this.secHeadingArray[i] == '') {
                        document.getElementById('headingNull' + i).hidden = false;
                    }
                    if (document.getElementById('subHeading' + i).hidden == false) {
                        this.headingSame = true;
                    }
                    if (document.getElementById('headingNull' + i).hidden == false) {
                        this.headingEmpty = true;
                    }
                } else {
                    if (this.secHeadingArray[i] != null) {
                        this.subQuestion[i].heading = this.secHeadingArray[i];
                    }
                }
            }
        }
        if (this.multiform.controls.resourcesLink.value != '') {
            this.resourceArray = [];
            const video = this.multiform.controls.resourcesLink.value;
            for (let i = 0; i < video.length; i++) {
                this.resourceArray.push(video[i].value);
            }
        }
        this.getpdf.links = this.getpdf.links.filter((item) => item.link !== '');

        let nameNotEntered = false;
        this.getpdf.links.every((items) => {
            if (items.name == '') {
                nameNotEntered = true;
                return false;
            }
            return true;
        });

        if (!nameNotEntered) {

            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                name: this.multiform.controls.classname.value,
                description: this.multiform.controls.description.value,
                grade: this.multiform.controls.grade.value,
                subject: this.multiform.controls.subject.value,
                school_id: this.auth.getSessionData('rista-school_id'),
                file_path: [this.getpdf],
                answerkey_path: this.answerpdfpath,
                allow_answer_key: this.showAnswerKey == true ? '1' : '0',
                teacher_version: this.teacherVersion,
                links: this.multiform.controls.resourcesLink.value != '' ? this.resourceArray : [],
                file_text: '',
                content_type: this.uploadType == 'assessment' ? '3' : '2',
                tags: this.multiform.controls.tag.value != '' ? this.tagArray : [],
                annotation: this.areaInfo,
                assign: '0',
                classdetails: [],
                content_format: this.getpdf != [] ? '1' : '2',
                status: '5',
                profile_url: this.imagepath,
                profile_thumb_url: this.imagepaththumb,
                access: this.multiform.controls.option.value,
                answers: this.subQuestion,
                editor_type: '',
                corporate_id: corporate,
                download: this.multiform.controls.downloadContent.value == true ? '1' : '0'
            };
            if (this.headingEmpty == false) {
                if (this.headingSame == false) {
                    if (value != 'edit') {
                        this.creator.addDraftResourse(data).subscribe((successData) => {
                                this.draftSuccess(successData);
                            },
                            (error) => {
                                this.draftFailure(error);
                            });
                    } else if (value == 'edit') {
                        data['content_id'] = this.editData.content_id;
                        this.creator.editDraftResourse(data).subscribe((successData) => {
                                this.draftSuccess(successData);
                            },
                            (error) => {
                                this.draftFailure(error);
                            });
                    }
                } else {
                    this.toastr.error('Sub heading should not be same');
                }
            } else {
                this.toastr.error('Sub heading should not be empty');
            }
        } else {
            this.toastr.error('Name is mandatory for each additional resource links');
        }
    }

    draftSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            if (this.assessmentType == 'add') {
                if (this.functionCalled == true) {
                    this.toastr.success('Draft created successfully');
                    this.router.navigate(['repository/content-home']);
                }
                console.log(successData.ResponseObject, 'see what');
                this.listDetails(successData.Contentdetails);
                this.functionCalled = true;
                this.classList(2);
            } else {
                if (this.pdfChanged == true || this.valueChanged) {
                    this.multiform.controls.resourcesLink.patchValue('');
                    this.resourceArray = [];
                    this.listDetails(successData.Contentdetails);
                    this.classList(2);
                    this.pdfChanged = false;
                    this.valueChanged = false;
                    // this.allowChanged = true;
                } else {
                    this.toastr.success('Draft updated successfully');
                    this.auth.removeSessionData('rista-editor');
                    this.router.navigate(['repository/content-home']);
                }
            }
            console.log(successData, 'vetri');
        } else {
            this.toastr.error(successData.ResponseObject);
        }
    }

    draftFailure(error) {
        console.log(error, 'error');
        if (this.assessmentType == 'add') {
            this.toastr.error('Draft creation failed');
        } else {
            this.toastr.error('Draft update failed');
        }
    }

    getRandrom() {
        return Math.random().toFixed(7);
    }
    createLink() {
        this.getpdf.links.push({link: '', name: '', type: 'document'});
        this.isEditLink = true;
    }
    pushNewLink() {
        this.getpdf.links.push({link: '', name: '', type: 'document'});
    }
    updateLink() {
        this.getpdf.links = this.getpdf.links.filter((items) => {return items.link != ''});
        this.getpdf.links.forEach((list) => {
            list.link = list.link.includes('http') ? list.link : 'https://' + list.link;
        });

        let nameNotEntered = false;
        console.log(this.getpdf.links, 'pdf')
        this.getpdf.links.every((items) => {
            if (items.name == '') {
                nameNotEntered = true;
                return false;
            }
            return true;
        });

        if (!nameNotEntered) {
            this.isEditLink = false;
        }
    }
    spliceLink(index) {
        this.getpdf.links.splice(index, 1);
    }
    editPrimaryLink() {
        this.editLinkVal = this.getpdf.link;
        this.editSourceLink = true;
    }
    updatePrimaryLink(calledFrom?) {
        if (this.editLinkVal != '') {
            this.getpdf.link = this.editLinkVal.includes('http') ? this.editLinkVal : 'https://' + this.editLinkVal;
            this.editSourceLink = false;
        } else if (this.editLinkVal == '' && calledFrom == 'icon') {
            this.toastr.error('Sourec Link should not be empty');
        }
    }

    viewDetail(value) {
        this.pdfName = value.image;
        if (value.base64_data) {
            this.pdfTemplate = value.base64_data == '' ? this.webhost + '/' + value.original_image_url : this.common.convertBase64PdfPath(value.base64_data);
        } else {
            this.pdfTemplate = this.webhost + '/' + value.original_image_url;
        }
        this.modalRef = this.modalService.open(this.viewPdf, {size: 'xl'});
    }

    pdfUpload() {
        this.modalRef = this.modalService.open(this.uploadPdf, {size: 'md'});
    }

    encodePdfFileAsURL(event: any, type) {
        let images = [];
        let imageLength = event.target.files.length;
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const pdfDetails = event.target.files[i];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                let uploadTypeList = event.target.result.split(',');
                images.push({
                    image: uploadTypeList[1],
                    size: pdfDetails.size,
                    type: pdfDetails.type,
                    name: pdfDetails.name
                });
                const pic = pdfDetails.type.split('/');
                if (pic[1] == 'pdf') {
                    if (imageLength == images.length) {
                        this.onUploadKYCFinishedpdf(images, type);
                    }
                } else {
                    this.toastr.error('PDF are the required file format');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }

    }

    onUploadKYCFinishedpdf(getUrlEdu, type) {
        let pdftype: any;
        if (type == '1') {
            pdftype = 'content';
        } else if (type == '2') {
            pdftype = 'answerkey';
        } else {
            pdftype = 'teacheranswerkey';
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: getUrlEdu,
            uploadtype: pdftype
        };

        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.pdfuploadSuccess(successData, type);
            },
            (error) => {
                this.pdfuploadFailure(error);
            }
        );
    }

    pdfuploadSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            this.pdfChanged = true;
            this.response = successData.ResponseObject;
            if (type == '1') {
                let resourceLink = this.getpdf.links;
                this.showpdf = [];
                this.pdfpaththumb = [];
                for (let i = 0; i < this.response.imagepath.length; i++) {
                    this.showpdf.push(this.response.imagepath[i]);
                    this.pdfpaththumb.push(this.response.imagepath[i].resized_url);
                }
                this.getpdf = this.showpdf[0];
                this.getpdf['links'] = resourceLink;
                this.auth.setSessionData('pdf', JSON.stringify(this.showpdf));
                this.modalRef.close();
            } else if (type == '2') {
                console.log('in');
                this.answerpdfpath = [];
                this.attachment1.nativeElement.value = '';
                this.answerpdfpath.push(this.response.imagepath[0]);
            } else {
                this.teacherVersion = [];
                this.attachment2.nativeElement.value = '';
                this.teacherVersion[0] = this.response.imagepath[0];
            }
        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    pdfuploadFailure(error) {
        console.log(error, 'error');
    }

    question(id) {
        this.random = Math.random().toFixed(3);
        this.deleteFillBlanks = false;
        this.quesNoInvalid = false;
        console.log(this.numericQuestion, 'numric');
        if (id == '1') {
            this.multiDialog = true;
            const controlmulti = <FormArray>this.multiform.controls['repeatlink'];
            for (let i = controlmulti.length; i >= 1; i--) {
                controlmulti.reset();
                this.multiform['controls'].repeatlink['controls'][0]['controls']['points'].patchValue('1');
                this.multiform['controls'].repeatlink['controls'][0]['controls']['page'].patchValue('0');
                this.multiform['controls'].repeatlink['controls'][0]['controls']['autograde'].patchValue(true);
                this.multiform['controls'].repeatlink['controls'][0]['controls']['option'].patchValue('a b c d ');
                this.multiform['controls'].repeatlink['controls'][0]['controls']['array'].patchValue(['a', 'b', 'c', 'd']);
                this.multiform['controls'].repeatlink['controls'][0]['controls']['explain'].patchValue('');
                controlmulti.removeAt(i);
            }
        } else if (id == '3') {
            this.trueDialog = true;
            const controlChoose = <FormArray>this.multiform.controls['repeatchoose'];
            for (let i = controlChoose.length; i >= 1; i--) {
                controlChoose.reset();
                this.multiform['controls'].repeatchoose['controls'][0]['controls']['points1'].patchValue('1');
                this.multiform['controls'].repeatchoose['controls'][0]['controls']['page'].patchValue('0');
                this.multiform['controls'].repeatchoose['controls'][0]['controls']['autograde'].patchValue(true);
                this.multiform['controls'].repeatchoose['controls'][0]['controls']['explain'].patchValue('');
                controlChoose.removeAt(i);
            }
        } else if (id == '9') {
            this.choiceDialog = true;
            const controlPlus = <FormArray>this.multiform.controls['repeatplus'];
            for (let i = controlPlus.length; i >= 1; i--) {
                const controls = controlPlus['controls'][0]['controls']['choiceList'];
                for (let j = controls.length; j >= 1; j--) {
                    controls.removeAt(j);
                }
                controlPlus.reset();
                this.multiform['controls'].repeatplus['controls'][0]['controls']['points'].patchValue('1');
                this.multiform['controls'].repeatplus['controls'][0]['controls']['page'].patchValue('0');
                this.multiform['controls'].repeatplus['controls'][0]['controls']['autograde'].patchValue(true);
                this.multiform['controls'].repeatplus['controls'][0]['controls']['explain'].patchValue('');
                controlPlus.removeAt(i);
            }

        } else if (id == '10') {
            this.entryDialog = true;
            const controlEntry = <FormArray>this.multiform.controls['repeatentry'];
            for (let i = controlEntry.length; i >= 1; i--) {
                controlEntry.reset();
                this.multiform['controls'].repeatentry['controls'][0]['controls']['points'].patchValue('1');
                this.multiform['controls'].repeatentry['controls'][0]['controls']['page'].patchValue('0');
                this.multiform['controls'].repeatentry['controls'][0]['controls']['autograde'].patchValue(false);
                this.multiform['controls'].repeatentry['controls'][0]['controls']['explain'].patchValue('');
                controlEntry.removeAt(i);
            }

        } else if (id == '20') {
            this.essayDialog = true;
            const controlEssay = <FormArray>this.multiform.controls['repeatessay'];
            for (let i = controlEssay.length; i >= 1; i--) {
                controlEssay.reset();
                this.multiform['controls'].repeatessay['controls'][0]['controls']['points'].patchValue('1');
                this.multiform['controls'].repeatessay['controls'][0]['controls']['page'].patchValue('0');
                this.multiform['controls'].repeatessay['controls'][0]['controls']['autograde'].patchValue(false);
                this.multiform['controls'].repeatessay['controls'][0]['controls']['explain'].patchValue('');
                controlEssay.removeAt(i);
            }
        } else if (id == '30') {
            this.numericDialog = true;
            const controlNumeric = <FormArray>this.multiform.controls['repeatnumeric'];
            for (let i = controlNumeric.length; i >= 1; i--) {
                controlNumeric.reset();
                this.multiform['controls'].repeatnumeric['controls'][0]['controls']['points'].patchValue('1');
                this.multiform['controls'].repeatnumeric['controls'][0]['controls']['page'].patchValue('0');
                this.multiform['controls'].repeatnumeric['controls'][0]['controls']['autograde'].patchValue(false);
                this.multiform['controls'].repeatnumeric['controls'][0]['controls']['explain'].patchValue('');
                controlNumeric.removeAt(i);
            }
        } else if (id == '40') {
            this.graphDialog = true;

        } else if (id == '54') {
            this.fillInArray = [];
            this.blankDialog = true;
            const controlBlanks = <FormArray>this.multiform.controls['repeatblanks'];
            for (let i = controlBlanks.length; i >= 1; i--) {
                controlBlanks.reset();
                this.multiform['controls'].repeatblanks['controls'][0]['controls']['points'].patchValue('1');
                this.multiform['controls'].repeatblanks['controls'][0]['controls']['page'].patchValue('0');
                this.multiform['controls'].repeatblanks['controls'][0]['controls']['autograde'].patchValue(false);
                this.multiform['controls'].repeatblanks['controls'][0]['controls']['explain'].patchValue('');
                controlBlanks.removeAt(i);
            }
        }
        this.hide = true;
        // this.shapesType = '';
        if (this.subQuestion.length != 0 && !this.isBulkUpload) {
            this.sectionCount = this.subQuestion.length - 1;
        }
        console.log(id);
        this.submitType = 'add';
        console.log(this.subQuestion, 'this.subQuestion');
        this.dragCount = [];
        console.log(this.sectionCount, 'this.sectionCount');
        if (this.subQuestion[this.sectionCount] != null) {
            if (this.subQuestion[this.sectionCount].section.length > 0) {
                console.log('in');
                for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                    this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
                }
                for (let i = 0; i < this.reloadQues; i++) {
                    const num = i + 1;
                    this.dragCount.push(num);
                }
            }
        }
        console.log(this.dragCount, 'this.dragCount');
        this.countList = this.dragCount.length + 1;
        this.dragCount.push(this.countList);
        this.numericQuestion[0]?.editor.setContent('');
        if (id == '40') {
            this.graphQuestion[0]?.editor.setContent('');
            this.graphform.controls.question.patchValue('');
            this.graphform.controls.answer.patchValue('');
            this.graphform.controls.points.patchValue('1');
            this.graphform.controls.page.patchValue('0');
            this.graphBoardValue = '';
        } else if (id == '30') {
            this.numericAnswer[0]?.editor.setContent('');
        }

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

    createSpace(id, event) {
        console.log(event, 'event');
        let list;
        if (this.choices != '') {
            this.choices = [];
        }
        if (event.key != 'Backspace') {
            this.multiform['controls'].repeatlink['controls'][id]['controls']['option'].patchValue(this.multiform['controls'].repeatlink['controls'][id]['controls']['option'].value + ' ');
        }
        this.options = this.multiform['controls'].repeatlink['controls'][id]['controls']['option'].value;
        const choose = this.options.split(' ');
        for (let i = 0; i < choose.length; i++) {
            if (choose[i] != null && choose[i] != '') {
                this.choices.push(choose[i]);
                console.log(this.choices, 'this.choices123');
                list = this.choices.filter((val, index) => this.choices.indexOf(val) == index);
                list.forEach((item) => {
                    this.filterListChoices = item.toString().length;
                });

                // this.filterListChoices = 'Not allowed duplicate options';
                console.log(this.filterListChoices, 'this.filterListChoices');
            }
        }
        for (let i = 0; i < this.multiform['controls'].repeatlink['controls'].length; i++) {
            if (id == i) {
                this.multiform['controls'].repeatlink['controls'][id]['controls']['array'].patchValue(list);
            } else {
            }
        }
    }

    subQues(id) {
        for (let i = 0; i < this.multiform['controls'].repeatlink['controls'].length; i++) {
            for (let j = 0; j < this.alphabets.length; j++) {
                if (id == j) {
                    this.multiform['controls'].repeatlink['controls'][id]['controls']['subQuestion'].patchValue(this.alphabets[j]);
                }
            }
        }
    }

    //question List


// number Validation
    numberValidate(event) {
        this.validationService.numberValidate(event);
    }

    getOptionVal(event) {
        console.log(event.target.value, 'gfjgdghdjhg');
    }

    removechoiceList(index) {
        let remove4 = this.multiform.get('repeatplus') as FormArray;
        for (let i = 0; i < this.multiform['controls'].repeatplus['controls'].length; i++) {
            console.log(this.multiform['controls'].repeatplus['controls'][i]['controls'].optionList.length, 'choicerwrewtreytr');
            if (this.multiform['controls'].repeatplus['controls'][i]['controls'].choiceList.length > 1) {
                this.multiform['controls'].repeatplus['controls'][i]['controls'].choiceList.removeAt(index);
                this.multiform['controls'].repeatplus['controls'][i]['controls'].optionList.value.splice(index, 1);
            }
        }
    }

    addSec(val) {
        if (this.subQuestion.length != 0) {
            this.sectionCount = this.subQuestion.length - 1;
            console.log(this.subQuestion, 'subQuesww');
            console.log(this.sectionCount, 'count');
            if (this.subQuestion[this.sectionCount] != null) {
                if (this.subQuestion[this.sectionCount].section.length != 0) {
                    this.dragCount = [];
                    this.sectionCount += 1;
                    console.log(this.sectionCount, 'count');
                    this.totalsub[this.sectionCount] = {heading: val, section: []};
                    this.subQuestion[this.sectionCount] = {heading: val, section: []};
                    this.secHeadingArray[this.sectionCount] = val;
                    console.log(this.subQuestion, 'this.subQuestion');
                }
            }
            setTimeout(() => document.getElementById('section' + this.sectionCount).focus());
        }
    }

    changeSpanTo() {
        this.changeInput = true;
        if (!this.quesNoChanged) {
            this.spanQuesVal = this.editQuesNo;
        }
    }

    changeInputTo() {
        this.quesNoInvalid = false;
        this.changeInput = false;
        if (this.spanQuesVal != this.countList) {
            this.quesNoChanged = true;
            for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
                if (this.countList == this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no) {
                    this.quesNoInvalid = true;
                }
            }
        }
        this.dragCount = [];
        for (let i = 0; i < this.countList; i++) {
            const num = i + 1;
            this.dragCount.push(num);
        }
    }

    validation(id, value) {
        document.getElementById('subHeading' + id).hidden = true;
        document.getElementById('headingNull' + id).hidden = true;
        console.log(value, 'typedVal');
        console.log(id, 'id');
        console.log(this.secHeadingArray, 'this.secHeadingArray');
        for (let i = 0; i < this.secHeadingArray.length; i++) {
            if (value == '' && this.secHeadingArray.length > 1) {
                document.getElementById('headingNull' + id).hidden = false;
            }
            if (id != i) {
                console.log(i, 'ideee');
                if (value == this.secHeadingArray[i]) {
                    if (value != '') {
                        console.log('in');
                        console.log(id, 'viewId');
                        document.getElementById('subHeading' + id).hidden = false;
                    }
                }
            }
        }
    }

    changeSection(id, no) {
        this.quesNoInvalid = false;
        if (no == '40') {
            this.sectionCount = this.graphform.controls.head.value;
        } else {
            this.sectionCount = this.multiform.controls.head.value;
        }
        console.log(this.graphform.controls.head.value, 'selectbox val');
        document.getElementById(id).setAttribute('selected', this.sectionCount);
        console.log(this.sectionCount, 'sectionCount');
        this.dragCount = [];
        for (let i = 0; i < this.subQuestion[this.sectionCount].section.length; i++) {
            this.reloadQues = this.subQuestion[this.sectionCount].section[i].sub_questions[0].question_no;
        }
        for (let i = 0; i < this.reloadQues; i++) {
            const num = i + 1;
            this.dragCount.push(num);
        }
        this.countList = this.dragCount.length + 1;
    }

    openExplanationPopup(value) {
        this.ExplanationPopupValue = value;
        this.modalRef = this.modalService.open(this.viewExplain);
        this.clickEvent();
    }

    preventScroll() {
        // document.body.style.overflow = 'hidden';
    }

    allowScroll() {
        // document.body.style.overflow = 'scroll';
    }

    disableSelect(id, event) {
        console.log(event);
    }

    assignContent() {
        this.modalRef.close();
        this.classDetails = JSON.parse(this.auth.getSessionData('card-data'));
        this.modalRef = this.modalService.open(this.assignTemplate, {size: 'lg', backdrop: 'static'});
    }

    closeAssignPopUp() {
        this.auth.removeSessionData('rista-assignedForm');
        this.modalRef.close();
    }

    dontAssign() {
        this.modalRef.close();
        const assignedFrom = this.auth.getSessionData('rista-assignedForm');
        if (assignedFrom && assignedFrom == 'class') {
            this.router.navigate(['class/topicsAndCurriculum/1']);
        } else {
            this.router.navigate(['/repository/content-home']);
        }
    }
}


////Annatation ////
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








