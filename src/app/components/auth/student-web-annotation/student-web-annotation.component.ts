import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    SecurityContext,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import * as $ from 'jquery';
import {CreatorService} from '../../../shared/service/creator.service';
import {CommonService} from '../../../shared/service/common.service';
import {jsPDF} from 'jspdf';
import { debounce } from 'lodash';

@Component({
    selector: 'app-student-web-annotation',
    templateUrl: './student-web-annotation.component.html',
    styleUrls: ['./student-web-annotation.component.scss']
})
export class StudentWebAnnotationComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

    public static me: StudentWebAnnotationComponent;
    @Input() toolHide: boolean;
    @Input() toolAdjust: boolean = false;
    @Input() popUp: boolean = false;
    @Input() getAnnotate: any = [];
    @Input() expandPdf: boolean = false;
    @Output() annotate = new EventEmitter<any>();
    @Output() expandBoolean = new EventEmitter<any>();
    editTextInput = false;
    @ViewChild('toolbar') elementView: ElementRef;
    contentHeight: 70;
    rect: Rectangle = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
    lastMousePosition: Position = {x: 0, y: 0};
    canvasPosition: Position = {x: 0, y: 0};
    mousePosition: Position = {x: 0, y: 0};
    public customeScrollPosition: number = 0;
    mouseDownFlag = false;
    public editingTextValue: any;
    public mathVal: any;
    public workAreaPageNo = 0;
    public mathInputEvent: any;
    public editMathInput = false;
    public mathDelayer = false;
    public editMathValue: any;
    public scale: any;
    pagePosition: Position = {x: 0, y: 0};
    show = false;
    public jsPDF: jsPDF;
    public shapesType = '';
    public touchEvents = [];
    public pointerType: any;
    public elem: any;
    public globalPdfViewerPath: any;
    public queNum: any;
    public showInput: any;
    public textValue: any;
    public inputElement: any;
    public pageVariable: any = 1;
    public moveCount = 0;
    public deleteAnnatation: boolean;
    public clearSetTimeout: any;
    public clearSetTimeoutWorkspace: any;
    cnv;
    pdfBody;
    ctx;
    element = null;
    dataPageNumber: number;
    public customPdfLoader = true;
    areaInfo: AreaInfo[] = [];
    indexOfPage = 1;
    showPopup = false;
    listRectangleId = '';
    public icons: any;
    public pdfTemplate: any;
    public count = 0;
    public dblTimer = 0;
    public webhost: any;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public options: any;
    public hide: boolean;
    public schoolId: any;
    public gradeData: any;
    public subjectData: any;
    public rectElem: any;
    public svgColor: any;
    public fontList = [
        {value: 12},
        {value: 13},
        {value: 14},
        {value: 15},
        {value: 16},
        {value: 17},
        {value: 18},
        {value: 19},
        {value: 20},
        {value: 21},
        {value: 22},
    ];
    public color = '#00CED1';
    public zoom = 0.9;
    @ViewChild('mathShow') mathShow: TemplateRef<any>;
    public alphabets: any;
    public editData: any;
    public detailData: any = [];
    public showAnnotation: boolean;
    public itemsList: any = [];
    public imagepath: any;
    public imagepaththumb: any;
    public getpdf: any;
    public getlinks: any;
    public recordBase64Url: any;
    public selectedElements: any;
    public type: any;
    public selectedDeleteIcon = false;
    public eraserDownMouse = false;
    public drag = false;
    public buffer: any;
    public strPath: any;
    public textPosition: any;
    public dragpaths: any;
    public showdropdown: boolean;
    public queDrag: boolean;
    public savaText: boolean;
    public dragPageNumber: any;
    public dragQuestionsList: any = [];
    public textFontSize: any;
    public originalSize = false;
    public pathChanged = false;
    public dragButton: any;
    public assessmentType: any;
    public selectedPageAnnatation: any;
    public disable: boolean;
    public currentPage = 1;
    public selectedQueNum: number;
    public itemSelect: any = [];
    public redoListArray: any = [];
    public studentId: any;
    public annotationType: any;
    public offsetter: any;
    pressing: boolean;
    selectedElement: any = null;
    public workAreaScroll: boolean = false;
    public expand: boolean = false;
    public pdfWidth = 0;
    public pdfHeight = 0;
    @ViewChild('pdfPage', {static: false}) pdfPage: ElementRef;
    @ViewChild('canvas', {static: false}) canvas: ElementRef;
    @ViewChild('pencilCanvas', {static: false}) pencilCanvas: ElementRef;
    @ViewChild('deleteAlert') deleteAlert: TemplateRef<any>;
    @ViewChild('deleteSvgDraw') deleteSvgDraw: TemplateRef<any>;
    @ViewChild('eraser') eraser: TemplateRef<any>;
    @ViewChild('class') deleteClass: TemplateRef<any>;
    @ViewChild('delete') delete: TemplateRef<any>;
    @ViewChild('eraseAll') eraseAll: TemplateRef<any>;
    showPage = false;

    @Input() overallData: any;
    public allowWorkSpaceScroll: boolean = true;

    constructor(public auth: AuthService, public creator: CreatorService, public activateRoute: ActivatedRoute, private formBuilder: FormBuilder,
                public sanitized: DomSanitizer, public confi: ConfigurationService, private modalService: NgbModal,
                public toastr: ToastrService,
                public cdr: ChangeDetectorRef,
                public router: Router, public common: CommonService) {
        this.activateRoute.params.forEach((params) => {
            this.assessmentType = params.type;
            this.studentId = params.id;
            if (this.assessmentType == 'preview') {
                this.annotationType = params.type;
            } else {
                this.annotationType = 'none';
            }
        });
        this.webhost = this.confi.getimgUrl();
        // this.getStudentDetails();

        this.hide = true;
        this.svgColor = '#00CED1';
        this.disable = true;
        this.showInput = true;
        this.savaText = false;
        this.queDrag = false;
        this.deleteAnnatation = false;
        this.queNum = [];

        this.strPath = '';
        this.alphabets = [];
        this.buffer = [];

        for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
            this.alphabets.push(String.fromCharCode(i));
        }
        this.itemsList = [{value: 'true'},
            {value: 'false'},
        ];
        this.showPage = true;

        StudentWebAnnotationComponent.me = this;
    }

    @HostListener('pointerdown', ['$event'])
    onpointerdown(event: TouchEvent | any) {
        if (event.target.tagName == 'svg' && !this.drag) {
            this.mouseEvent1(event);
        } else if (event.target.tagName != 'svg') {
            this.handleEdit(event);
            console.log(event, 'pointer');
            this.textDrag(event);
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent | any) {
        if (event.target.tagName == 'svg' && !this.drag) {
            this.mouseEvent1(event);

        } else if (event.target.tagName == 'text') {
            this.textDrag(event);
        }
    }

    @HostListener('input', ['$event'])
    onInput(e: InputEvent | any) {
        this.keyPressfunction(e);
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event: TouchEvent | any) {
        if (event.target.tagName == 'svg' && !this.drag) {
            this.mouseEvent1(event);

        } else if (event.target.tagName == 'DIV' && this.selectedElement == null) {
            if (this.shapesType != '' && this.shapesType != undefined) {
                if (this.mouseDownFlag) {
                    this.mouseDownFlag = false;
                    this.buffer = [];
                    this.rect.d = this.strPath;
                    this.rect.text = this.textValue;
                    this.save();
                    this.lastMousePosition = {x: 0, y: 0};
                    this.mousePosition = {x: 0, y: 0};
                    this.pagePosition = {x: 0, y: 0};
                    this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
                    this.strPath = '';
                    this.buffer = [];
                }
            }
        }
        if (this.selectedElements) {
            this.preventScroll();
            // this.dragElem(event);
            this.textDrag(event);
        }
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: TouchEvent | any) {
        if (event.target.tagName == 'svg' && !this.drag) {
            this.mouseEvent1(event);
        }
        if (this.selectedElements) {
            this.saveAnnotationDetails();
            this.selectedElement = null;
        }
    }

    @HostListener('pointermove', ['$event'])
    onpointermove(event: TouchEvent | any) {
        if (event.target.tagName == 'svg' && this.selectedElement == null && !this.drag) {
            this.mouseEvent1(event);
        } else if (event.target.tagName == 'DIV' && this.selectedElement == null) {
            if (this.shapesType != '' && this.shapesType != undefined) {
                if (this.mouseDownFlag) {
                    this.mouseDownFlag = false;
                    this.buffer = [];
                    this.rect.d = this.strPath;
                    this.rect.text = this.textValue;
                    this.save();
                    this.lastMousePosition = {x: 0, y: 0};
                    this.mousePosition = {x: 0, y: 0};
                    this.pagePosition = {x: 0, y: 0};
                    this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
                    this.strPath = '';
                    this.buffer = [];
                }
            }
        }
        if (this.selectedElement) {
            this.preventScroll();
            this.dragElem(event);
        }
    }

    @HostListener('pointerup', ['$event'])
    onpointerup(event: TouchEvent | any) {
        if (event.target.tagName != 'DIV' && this.shapesType != 'eraser') {
            this.mouseEvent1(event);
        } else if (event.target.tagName != 'DIV' && this.shapesType == 'eraser') {
            this.eraserAlert(event);
        }
        console.log(this.selectedElements, 'selected');
        if (this.selectedElements) {
            this.textDrag(event);
        }
    }

    @HostListener('dblclick', ['$event']) onDoubleClicked(event) {
        console.log(event.type, 'dblclick');
        if (this.shapesType == 'eraser') {
            for (let i = 0; i < this.areaInfo.length; i++) {
                if (event.target.tagName != 'svg') {
                    if (this.areaInfo[i].rectangleId == event.target.id && this.areaInfo[i].isTeacherCorrection) {
                        this.areaInfo.splice(i, 1);
                        document.getElementById(event.target.id).remove();
                    }
                } else {
                    const clientX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
                    const clientY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
                    this.lastMousePosition = {
                        x: clientX - this.pagePosition.x,
                        y: clientY - this.pagePosition.y
                    };
                }
            }
            this.saveAnnotationDetails();
        } else {
            this.editText(event);
        }
    }

    ngAfterViewInit() {

        if (this.elementView) {
            this.contentHeight = this.elementView.nativeElement.offsetHeight;
        }
    }

    ngOnInit(): void {
        if (this.toolHide && this.toolAdjust) {
            this.areaInfo = this.getAnnotate;
            if (this.areaInfo.length != 0) {
                this.jsPDF = new jsPDF();
                this.areaInfo.forEach((val) => {
                    if (val.pageNumber > this.workAreaPageNo) {
                        this.workAreaPageNo = val.pageNumber;
                    }
                });
                for (let i = 0; i < this.workAreaPageNo - 1; i++) {
                    this.jsPDF.addPage();
                }
                this.pdfTemplate = this.jsPDF.output('datauristring');
            } else {
                this.jsPDF = new jsPDF();
                this.pdfTemplate = this.jsPDF.output('datauristring');
            }
            this.clearSetTimeoutWorkspace = setTimeout(() => {
                this.cdr.detectChanges();
                this.showAnnotation = true;
                this.annotationType = 'workarea';
            }, 2500);
        } else {
            this.getStudDetailSuccess(this.overallData);
        }
    }

    ngAfterContentInit(): void {
        this.allowScroll();
    }

    ngOnDestroy(): void {
        this.saveAnnotationDetails();
        if (this.clearSetTimeout) {
            clearTimeout(this.clearSetTimeout);
        }

        if (this.clearSetTimeoutWorkspace) {
            clearTimeout(this.clearSetTimeoutWorkspace);
        }
    }

    incrementZoom(amount: number) {
        this.zoom += amount;
    }

    callBackFn(pdf: any) {
        // this.totalPdfPage = pdf._pdfInfo.numPages;
        let end = new Date().getTime();
        // let total_time = end - this.startTime;
        // console.log(total_time ,'total_time');
        // console.timeEnd('pdf tim end');
        this.customPdfLoader = false;
        this.allowScroll();
        this.setCustomScrollPosition();
    }

    expandPage(val) {
        this.expand = val;
        this.expandBoolean.emit(val);
    }

    tools(type, pointerType) {
        console.log(type, pointerType, 'parameters');
        console.log(this.shapesType, 'shapeType');
        if (this.selectedDeleteIcon) {
            for (let i = 0; i < this.areaInfo.length; i++) {
                this.areaInfo[i].userSelect = false;
                this.hoverLeaveRemoveItemEnter(this.areaInfo[i]);
            }
        }
        this.selectedDeleteIcon = false;
        this.lastMousePosition = {x: 0, y: 0};
        this.mousePosition = {x: 0, y: 0};
        this.pagePosition = {x: 0, y: 0};
        this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
        if (this.shapesType === type) {
            this.allowWorkSpaceScroll = true;
            this.shapesType = '';
            this.mouseDownFlag = false;
            if (document.getElementById('customArea')) {
                document.getElementById('customArea').remove();
                this.editTextInput = false;
            }
            this.allowScroll();
        } else {
            this.allowWorkSpaceScroll = false;
            this.shapesType = type;
            this.elem.style.cursor = pointerType;
            if (document.getElementById('customArea') && this.shapesType != 'text') {
                document.getElementById('customArea').remove();
                this.editTextInput = false;
            }
            this.preventScroll();

        }
        this.showInput = true;
        if (this.shapesType == '' || this.shapesType == undefined) {
            this.mouseDownFlag = false;
            this.allowScroll();
        }

    }

    getMousePosition(evt, element, type) {
        console.log(element.nearestViewportElement, 'nearestViewportElement');
        console.log(element.farthestViewportElement, 'farthestViewportElement');
        let CTM;
        if (type == 'move') {
            CTM = element.nearestViewportElement.getScreenCTM();
        } else {
            CTM = element.farthestViewportElement.getScreenCTM();
        }
        if (type == 'move') {
            return {
                x: (evt.changedTouches[0].clientX - CTM.e) / CTM.a,
                y: (evt.changedTouches[0].clientY - CTM.f) / CTM.d
            };
        } else {
            return {
                x: (evt.clientX - CTM.e) / CTM.a,
                y: (evt.clientY - CTM.f) / CTM.d
            };
        }
    }

    dragElem(event) {
        if (this.mouseDownFlag && this.selectedElement) {
            event.preventDefault();
        }
    }

    textDrag(event) {
        console.log(event.type, 'text drag enter');
        if (event.type == 'pointerdown' || event.type == 'touchstart') {
            console.log(event, 'pointD');
            this.selectedElements = null;
            event.preventDefault();
            let val = event.target.parentElement;
            console.log(val, 'val');
            console.log(val.parentElement, 'parent');
            for (let i = 0; i < i + 1; i++) {
                // console.log(i, val.tagName, 'index');
                // if (val.tagName) {
                if (val.tagName == 'foreignObject') {
                    console.log(i, val.id, 'id');
                    this.selectedElements = document.getElementById(val.id);
                    this.drag = true;
                    break;
                } else {
                    val = val.parentElement;
                }
                // } else {
                //     val = val.parentElement;
                // }
            }
            console.log(this.selectedElements, 'selectedElements');
            // this.selectedElements = document.getElementById(event.target.id);
            if (this.selectedElements) {
                this.areaInfo.forEach((value) => {
                    if (value.rectangleId == this.selectedElements.id) {
                        if (value.isTeacherCorrection) {
                            this.selectedElements.style.cursor = 'move';
                            this.offsetter = this.getMousePosition(event, this.selectedElements, 'down');
                            this.offsetter.x -= parseFloat(this.selectedElements.getAttributeNS(null, 'x'));
                            this.offsetter.y -= parseFloat(this.selectedElements.getAttributeNS(null, 'y'));
                            this.mouseDownFlag = true;
                            this.preventScroll();
                        }
                    }
                });
                console.log(this.offsetter, 'offsetter');
            }
        }
        if ((event.type == 'pointermove' || event.type == 'touchmove') && this.selectedElements) {
            event.preventDefault();
            const coord = this.getMousePosition(event, this.selectedElements, 'move');
            if (this.selectedElements) {
                this.selectedElements.setAttributeNS(null, 'x', coord.x - this.offsetter.x);
                // this.selectedElements.setAttributeNS(null, 'x', coord.x);
                this.selectedElements.setAttributeNS(null, 'y', coord.y - this.offsetter.y);
                // this.selectedElements.setAttributeNS(null, 'y', coord.y);
            }
        }
        if (event.type == 'pointerup' || event.type == 'touchend') {
            this.mouseDownFlag = this.drag = false;
            this.offsetter = null;
            this.moveCount = 0;
            this.areaInfo.forEach((val) => {
                if (this.selectedElements.id == val.rectangleId) {
                    val.rect.x1 = this.selectedElements.x.baseVal.value;
                    val.rect.y1 = this.selectedElements.y.baseVal.value;
                }
            });
            this.saveAnnotationDetails();
            this.selectedElements = null;
            this.allowScroll();
        }
    }

    eraserAlert(event) {
        this.mouseDownFlag = false;
        this.lastMousePosition = {x: 0, y: 0};
        this.mousePosition = {x: 0, y: 0};
        this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
        if (event.type == 'pointerup' && this.eraserDownMouse) {
            this.modalRef = this.modalService.open(this.eraser, {size: 'md', backdrop: 'static', windowClass: 'studentAnotation'});
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
                this.saveAnnotationDetails();
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
    }

    editText(event) {
        console.log(event, 'parentELem');
        let id;
        let selected;
        let val = event.target.parentElement;
        for (let i = 0; i < i + 1; i++) {
            console.log(val.tagName, i, 'tagname');
            if (val.tagName == 'foreignObject') {
                selected = document.getElementById(val.id);
                break;
            } else {
                val = val.parentElement;
            }
        }
        console.log(selected, 'selected');
        if (selected.tagName == 'foreignObject') {
            let split = selected.id.split('-');
            if (split[0] == 'text') {
                this.areaInfo.forEach((value) => {
                    if (value.rectangleId == selected.id && value.isTeacherCorrection) {
                        this.editingTextValue = value;
                        console.log(selected.children[0], 'edit getvel');
                        this.appendTextArea(event, event.path, value.rect.width, value.rect.height);
                        this.inputElement.children[0].innerHTML = selected.children[0].innerText;
                        this.inputElement.style.left = value.rect.x1 > 520 ? (value.rect.x1 - 60).toString() + 'px' : (value.rect.x1).toString() + 'px';
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
                this.mathInputEvent = document.getElementById(selected.id);
                this.areaInfo.forEach((value) => {
                    if (value.rectangleId == selected.id && value.isTeacherCorrection) {
                        if (document.getElementById('customArea')) {
                            document.getElementById('customArea').remove();
                            this.editTextInput = false;
                            this.inputElement = null;
                            this.showInput = true;
                            this.element = null;
                        }
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
                const calculatedWidth = maxCharacterLength == 1 ? maxCharacterLength * 40 : (maxCharacterLength * 6) + 40;
                const leftPosition = this.inputElement.style.left.toString().split('px')[0];
                const allowedPdfWidth = this.pdfWidth - 10 - Math.round(leftPosition);
                console.log(allowedPdfWidth, 'allowd');
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
        text.className = 'text-area-annotation';
        text.setAttribute('type', 'text');
        text.setAttribute('name', 'customText');
        text.setAttribute('Placeholder', 'Text');
        text.style.resize = 'both';
        text.style.height = height == '' || height == '0' ? '50px' : height;
        text.style.width = width == '' || width == '0' ? '40px' : width;
        text.style.fontSize = this.textFontSize + 'px';
        text.style.overflowWrap = 'break-word';
        text.id = 'customText';
        this.inputElement.id = 'customArea';
        this.inputElement.appendChild(text);
    }

    appendTextAreaInput(event, path) {
        const pageNumber = this.dataPageNumber;
        const pageDetails = document.getElementById('pdf-page').getElementsByTagName('div')[1].getElementsByClassName('page')[pageNumber - 1] as HTMLElement;
        this.pdfWidth = parseInt((pageDetails.style.width).split('px')[0]);
        this.pdfHeight = parseInt((pageDetails.style.height).split('px')[0]);
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
        console.log(this.showInput, 'showinput');

        if (event.target.tagName != 'TEXTAREA') {
            if (this.showInput) {
                this.appendTextArea(event, path, '40px', '50px');
                const clientX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
                const clientY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
                this.lastMousePosition = {
                    x: clientX - this.pagePosition.x,
                    y: clientY - this.pagePosition.y
                };
                console.log(this.lastMousePosition.x, 'this.lastMousePosition.x');

                this.inputElement.style.left = this.lastMousePosition.x > 520 ? (this.lastMousePosition.x - 60).toString() + 'px' : (this.lastMousePosition.x).toString() + 'px';
                this.inputElement.style.top = (this.lastMousePosition.y / this.scale) > 920 ? (this.lastMousePosition.y - 50).toString() + 'px' : (this.lastMousePosition.y).toString() + 'px';
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
                document.getElementById('customArea').focus();
            }
            if (!this.showInput) {
                let rectId;
                let idd;
                if (!this.editTextInput) {
                    rectId = Math.random().toFixed(6);
                    idd = 'text-' + rectId;
                    this.textValue = $('textarea[name="customText"]').val();
                    if (this.textValue != '') {
                        // console.log(document.getElementById('customText').get)
                        const height = document.getElementById('customText').style.height;
                        const width = document.getElementById('customText').style.width;

                        this.element = this.createWrappingText(this.textValue, this.textPosition.x, this.textPosition.y, height, width, idd, this.svgColor);
                        this.element.id = 'text-' + rectId;
                        this.element.setAttribute('fill', this.svgColor);
                        this.element.style.fontSize = this.textFontSize + 'px';
                        this.element.style.flexWrap = 'wrap';
                        this.element.style.cursor = 'move';
                        this.rect.x1 = this.textPosition.x;
                        this.rect.y1 = this.textPosition.y;
                        this.rect.text = this.textValue;
                        this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                        const push = path.find(p => p.className == 'page').children;
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

                        this.element = this.createWrappingText(this.textValue, this.editingTextValue.rect.x1, this.editingTextValue.rect.y1, height, width, this.editingTextValue.rectangleId, this.svgColor);
                        this.element.id = this.editingTextValue.rectangleId;
                        this.element.setAttribute('fill', this.editingTextValue.color);
                        this.element.style.fontSize = this.textFontSize + 'px';
                        this.element.style.flexWrap = 'wrap';
                        this.element.style.cursor = 'move';

                        this.editingTextValue.rect.text = this.textValue;
                        this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                        for (let i = 0; i < this.areaInfo.length; i++) {
                            if (this.areaInfo[i].rectangleId == this.editingTextValue.rectangleId) {
                                this.areaInfo[i].rect.text = this.editingTextValue.rect.text;
                                this.areaInfo[i].rect.width = this.rect.width;
                                this.areaInfo[i].rect.height = this.rect.height;
                            }
                        }
                        document.getElementById(this.editingTextValue.rectangleId).remove();
                        const push = path.find(p => p.className == 'page').children;
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
                // this.lastMousePosition = {
                //     x: event.clientX - this.pagePosition.x,
                //     y: event.clientY - this.pagePosition.y
                // };
                //
                // this.inputElement.style.left = (this.lastMousePosition.x).toString() + 'px';
                // this.inputElement.style.top = (this.lastMousePosition.y).toString() + 'px';
                // this.inputElement.style.width = '200px';
                // this.inputElement.style.height = '20px';
                // this.inputElement.style.overflow = 'visible';
                // this.inputElement.style.position = 'absolute';
                // this.textPosition = {
                //     x: this.lastMousePosition.x / this.scale,
                //     y: this.lastMousePosition.y / this.scale,
                // };
            }
        }
    }

    createWrappingText(text, x, y, height, width, id, color) {
        const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        svgText.setAttributeNS(null, 'x', x);
        svgText.setAttributeNS(null, 'y', y);
        const post = document.createElement('pre');
        post.setAttribute('id', id);
        post.className = 'textInput';
        post.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        post.textContent = text;
        const textValue = [];
        text.split(/^/gm).forEach((items) => {
            textValue.push(items.length);
        });
        post.innerHTML = post.innerHTML.replace(/\n/g, '<br>\n');
        post.style.color = color;
        const calculateWidth = width ? width.split('px') : width;
        post.style.width = width ? (calculateWidth[0] - 20).toString() + 'px' : width;
        post.style.overflowWrap = 'break-word';
        this.rect.width = width;
        this.rect.height = height;
        post.style.fontFamily = 'sans-serif', 'Arial', 'Verdana', "Trebuchet MS", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        post.style.whiteSpace = 'normal';
        post.style.fontSize = this.textFontSize;

        svgText.style.width = width ? (calculateWidth[0] - 20).toString() + 'px' : width;
        svgText.style.height = textValue.length == 1 ? ((height.split('px')[0] - 20).toString() + 'px') : height;
        svgText.style.overflow = 'visible';
        svgText.appendChild(post);
        return svgText;
    }

    mathInit(event) {
        this.editMathValue = '';
        this.modalRef = this.modalService.open(this.mathShow, {size: 'md', backdrop: 'static'});
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

    async mouseEvent1(event) {
        if (event.type == 'pointerdown' && this.shapesType != 'text' && this.shapesType != 'eraser' && this.editTextInput) {
            event.preventDefault();
            let path = this.composedPath(event.target);
            this.appendTextAreaInput(event, path);
        }

        if (this.annotationType != 'preview') {
            if (!this.showPopup && this.shapesType != undefined && this.shapesType != '') {

                if (event.type === 'pointerdown') {
                    event.preventDefault();
                    console.log('pointerDown');
                    this.mouseDownFlag = true;
                    this.pathChanged = false;
                    this.lastMousePosition = {x: 0, y: 0};
                    this.mousePosition = {x: 0, y: 0};
                    this.pagePosition = {x: 0, y: 0};
                    this.buffer = [];
                    this.strPath = '';
                    let path: any;
                    this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
                    path = this.composedPath(event.target);
                    const eventPath = path.find(p => p.className == 'page');
                    if (typeof eventPath !== 'undefined') {
                        this.dataPageNumber = parseInt(eventPath.getAttribute('data-page-number'));

                        let toDrawRectangle: any;
                        const pagePath1 = path.find(p => p.className == 'page');
                        const lengthofChilds1 = path.find(p => p.className == 'page').children.length;
                        for (let i = 0; i < lengthofChilds1; i++) {
                            if (pagePath1.children[i].tagName == 'svg') {
                                toDrawRectangle = pagePath1.children[i];
                            }
                        }
                        const pageOffset = toDrawRectangle.getBoundingClientRect();

                        this.pagePosition = {
                            x: pageOffset.left,
                            y: pageOffset.top
                        };

                        const clientX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
                        const clientY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
                        this.lastMousePosition = {
                            x: clientX - this.pagePosition.x,
                            y: clientY - this.pagePosition.y
                        };

                        if (this.shapesType != 'text') {
                            this.element = document.createElementNS('http://www.w3.org/2000/svg', this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType);
                            this.element.setAttribute('stroke-width', '2');
                            this.element.setAttribute('stroke', this.svgColor);
                            this.element.setAttribute('fill', 'none');
                        }

                        if (this.shapesType == 'rect') {
                            const rectId = Math.random().toFixed(6);
                            this.element.id = 'rect-' + rectId;
                            this.element.setAttribute('x', (this.lastMousePosition.x / this.scale));
                            this.element.setAttribute('y', (this.lastMousePosition.y / this.scale));
                        }

                        if (this.shapesType == 'circle') {
                            const rectId = Math.random().toFixed(6);
                            this.element.id = 'circle-' + rectId;
                            this.element.setAttribute('cx', (this.lastMousePosition.x / this.scale));
                            this.element.setAttribute('cy', (this.lastMousePosition.y / this.scale));
                            this.element.setAttribute('r', ((this.lastMousePosition.x / this.scale) - (this.lastMousePosition.y / this.scale)));
                        }

                        if (this.shapesType == 'path') {
                            this.pathChanged = false;
                            const rectId = Math.random().toFixed(6);
                            this.element.id = 'path-' + rectId;
                            this.strPath = 'M' + (this.lastMousePosition.x / this.scale) + ' ' + (this.lastMousePosition.y / this.scale);
                            this.element.setAttribute('d', this.strPath);
                            // console.log("pointerdown" + this.strPath);
                        }

                        if (this.shapesType == 'rectMask') {
                            const rectId = Math.random().toFixed(6);
                            this.element.id = 'rectMask-' + rectId;
                            this.element.setAttribute('stroke-width', '0');
                            this.element.setAttribute('fill', '#fff');
                            this.element.setAttribute('x', (this.lastMousePosition.x / this.scale));
                            this.element.setAttribute('y', (this.lastMousePosition.y / this.scale));
                        }

                        if (this.shapesType == 'highlight') {
                            const rectId = Math.random().toFixed(6);
                            this.element.id = 'highlight-' + rectId;
                            this.element.setAttribute('stroke-width', '0');
                            // this.element.setAttribute('fill', 'yellow');
                            this.element.setAttribute('fill', this.svgColor);
                            this.element.setAttribute('fill-opacity', '0.2');
                            this.element.setAttribute('x', (this.lastMousePosition.x / this.scale));
                            this.element.setAttribute('y', (this.lastMousePosition.y / this.scale));

                        }
                        if (this.shapesType == 'line') {
                            const rectId = Math.random().toFixed(6);
                            this.element.id = 'line-' + rectId;
                            this.element.setAttribute('x2', (this.lastMousePosition.x / this.scale));
                            this.element.setAttribute('y2', (this.lastMousePosition.y / this.scale));

                        }
                        if (this.shapesType == 'math' && !this.editTextInput && !this.editMathInput) {
                            this.mathInit(event);
                        }
                        if (this.shapesType == 'text') {
                            this.appendTextAreaInput(event, path);
                        }
                    }
                    if (this.element) {
                        this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';

                    }

                }
                if (event.type === 'pointermove' && this.shapesType != 'text') {
                    event.preventDefault();
                    this.preventScroll();
                    const clientX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
                    const clientY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
                    this.mousePosition = {
                        x: clientX - this.pagePosition.x,
                        y: clientY - this.pagePosition.y
                    };
                    if (this.mouseDownFlag) {
                        const width = (this.mousePosition.x / this.scale) - (this.lastMousePosition.x / this.scale);
                        const height = (this.mousePosition.y / this.scale) - (this.lastMousePosition.y / this.scale);
                        this.rect = {
                            x1: (this.lastMousePosition.x / this.scale),
                            y1: (this.lastMousePosition.y / this.scale),
                            x2: (this.mousePosition.x / this.scale),
                            y2: (this.mousePosition.y / this.scale),
                            d: '',
                            text: '',
                            width,
                            height
                        };
                        if (this.element != null) {
                            this.element.style.width = width + 'px';
                            this.element.style.height = height + 'px';
                            // let path = this.composedPath(event.target)
                            const pagePath1 = this.composedPath(event.target).find(p => p.className == 'page');
                            const lengthofChilds1 = this.composedPath(event.target).find(p => p.className == 'page').children.length;
                            let toDrawRectangle: any;
                            for (let i = 0; i < lengthofChilds1; i++) {
                                if (pagePath1.children[i].tagName == 'svg') {
                                    toDrawRectangle = pagePath1.children[i];
                                }
                            }
                            const diffX = this.rect.x1 - this.rect.x2;
                            const diffY = this.rect.y1 - this.rect.y2;
                            if (this.rect.width > 0 && this.rect.height > 0 && this.shapesType != 'path') {

                                toDrawRectangle?.appendChild(this.element);

                            } else if (this.shapesType == 'path' && ((diffX > 4 || diffX < -4) || (diffY > 4 || diffY < -4))) {
                                this.pathChanged = true;
                                toDrawRectangle?.appendChild(this.element);
                            }
                        }
                        if (this.shapesType == 'path' && this.pathChanged) {
                            const clientX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
                            const clientY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
                            this.mousePosition = {
                                x: (clientX - this.pagePosition.x) / this.scale,
                                y: (clientY - this.pagePosition.y) / this.scale,
                            };
                            this.appendToBuffer(this.mousePosition);
                            this.updateSvgPath();
                        }
                    }
                }

                if (event.type === 'pointerup' && this.shapesType != 'eraser') {
                    this.touchEvents.push({type: event.type});
                    this.cdr.detectChanges();
                    this.mouseDownFlag = false;
                    this.buffer = [];
                    this.rect.d = this.strPath;
                    this.rect.text = this.textValue;

                    if (this.shapesType == 'text') {
                        if (document.getElementById('customText')) {
                            document.getElementById('customText').focus();
                        }
                    } else if (this.shapesType == 'path') {
                        if (this.rect.x1 !== 0 && this.pathChanged) {
                            this.save();
                        }
                    } else if (this.shapesType != 'math') {
                        if (this.rect.x1 !== 0 && this.rect.x1 !== this.rect.x2) {
                            this.save();
                        }
                    }
                    this.lastMousePosition = {x: 0, y: 0};
                    this.mousePosition = {x: 0, y: 0};
                    this.pagePosition = {x: 0, y: 0};
                    this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
                    this.strPath = '';
                    this.buffer = [];
                    console.log(this.lastMousePosition, 'this.lastMousePosition');
                } else if (event.type === 'pointerup' && this.shapesType == 'eraser') {
                    this.mouseDownFlag = false;
                }
            }
            if (this.shapesType == '' && event.type == 'pointerup') {
                this.allowScroll();
            }
        }
    }

    preventScroll() {
        document.body.style.overflow = 'hidden';
        const d = document.getElementsByClassName('ng2-pdf-viewer-container') as HTMLCollectionOf<HTMLElement>;
        // const d1 = document.getElementsByClassName('scrollPanel-student') as HTMLCollectionOf<HTMLElement>;
        d[0].style.overflow = 'hidden';
        // d1[0].style.overflow = 'hidden';
    }

    allowScroll() {
        if (!this.popUp) {
            document.body.style.overflow = 'scroll';
        } else {
            document.body.style.overflow = 'hidden';
        }
        const d = document.getElementsByClassName('ng2-pdf-viewer-container') as HTMLCollectionOf<HTMLElement>;
        // const d1 = document.getElementsByClassName('scrollPanel-student') as HTMLCollectionOf<HTMLElement>;
        if (d[0]) {
            d[0].style.overflow = 'scroll';
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
        }, 1500);
    }

    backToQuestion() {
        this.selectedDeleteIcon = false;
        this.deleteAnnatation = false;
        if (this.shapesType == '' || this.shapesType == undefined) {
            this.allowScroll();
        }
        for (let i = 0; i < this.areaInfo.length; i++) {
            this.areaInfo[i].userSelect = false;
            this.hoverLeaveRemoveItemEnter(this.areaInfo[i]);
        }
    }

    deleteSvg() {
        this.shapesType = '';
        this.modalRef = this.modalService.open(this.deleteClass, {size: 'md', backdrop: 'static', windowClass: 'studentAnotation'});
    }


    deleteAllAnnotation() {
        for (let i = 0; i < this.areaInfo.length; i++) {

            if (this.areaInfo[i].isTeacherCorrection) {
                this.areaInfo[i].isDelete = true;
                this.redoListArray.push(this.areaInfo[i]);

                if (document.getElementById(this.areaInfo[i].rectangleId)) {
                    document.getElementById(this.areaInfo[i].rectangleId).remove();

                }

            }
        }

        this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
            return value.pageNumber == this.pageVariable && value.isTeacherCorrection;
        });

        this.itemSelect = this.selectedPageAnnatation;
        this.close();
        this.saveAnnotationDetails();
    }

    deleteCurrentPageAnnotation() {
        for (let i = 0; i < this.areaInfo.length; i++) {
            if (this.pageVariable == this.areaInfo[i].pageNumber && this.areaInfo[i].isTeacherCorrection) {
                this.areaInfo[i].isDelete = true;
                this.redoListArray.push(this.areaInfo[i]);

                if (document.getElementById(this.areaInfo[i].rectangleId)) {
                    document.getElementById(this.areaInfo[i].rectangleId).remove();

                }

            }
        }
        this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
            return value.pageNumber !== this.pageVariable && value.isTeacherCorrection;
        });

        this.itemSelect = this.selectedPageAnnatation;
        this.deleteSvg();
        this.close();
        this.saveAnnotationDetails();

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
            this.strPath += ' L' + pt.x + ' ' + pt.y;

            let tmpPath = '';
            for (let offset = 10; offset < this.buffer.length; offset += 5) {
                pt = this.getAveragePoint(offset);
                tmpPath += ' L' + pt.x + ' ' + pt.y;
            }

            // Set the complete current path coordinates
            this.element.setAttribute('d', this.strPath + tmpPath);
        }
    }

    appendToBuffer(pt) {
        this.buffer.push(pt);
        while (this.buffer.length > 8) {
            this.buffer.shift();
        }
    }


    pagechanging(event) {

        this.currentPage = event;
        if (this.deleteAnnatation) {
            this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
                return value.pageNumber == this.currentPage && value.isTeacherCorrection;
            });
            this.itemSelect = this.selectedPageAnnatation;
        }
    }

    removeAnnatation(event) {

        for (let i = 0; i < this.areaInfo.length; i++) {
            if (event.rectangleId == this.areaInfo[i].rectangleId) {
                this.areaInfo[i].isDelete = true;
                this.redoListArray.push(this.areaInfo[i]);
            }
        }
        const joinString = event.rectangleId;
        // setTimeout(() => {
        document.getElementById(joinString).remove();
        // }, 100);

        this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
            return value.pageNumber == this.pageVariable && value.isTeacherCorrection;
        });
        this.itemSelect = this.selectedPageAnnatation;

        this.saveAnnotationDetails();
    }

    setCustomScrollPosition() {
        if (this.workAreaScroll) {
            const workArea = document.getElementById('workArea');
            console.log(workArea, 'workArea');
            console.log(this.customeScrollPosition, 'pos');
            setTimeout(() => {
                // console.log(workArea.scrollTo(0, 413));
                // workArea.scroll(0, this.customeScrollPosition);
                workArea?.scrollTo(0, this.customeScrollPosition);
                this.workAreaScroll = false;
                console.log('scrollTo');
            }, 50);
        }
    }

    scrollDownPads(event) {
        console.log(event.currentScrollPosition, 'event.currentScrollPosition');
        this.customeScrollPosition = Math.floor(event.currentScrollPosition);
        console.log(this.customeScrollPosition, 'custos');
        this.workAreaScroll = true;
        this.jsPDF.addPage();
        console.log(this.areaInfo, 'areaInfo');
        this.pdfTemplate = this.jsPDF.output('datauristring');
    }

    undoDeleteAnnatation(event) {
        for (let i = 0; i < this.redoListArray.length; i++) {
            if (event.rectangleId == this.redoListArray[i].rectangleId) {
                this.redoPageRendered(this.redoListArray[i]);
                this.redoListArray.splice(i, 1);

            }
        }

        for (let i = 0; i < this.areaInfo.length; i++) {
            if (event.rectangleId == this.areaInfo[i].rectangleId) {
                this.areaInfo[i].isDelete = false;
            }
        }

        this.selectedPageAnnatation = this.areaInfo.filter((value, id, array) => {
            return value.pageNumber == this.pageVariable && value.isTeacherCorrection;
        });

        this.itemSelect = this.selectedPageAnnatation;
        this.saveAnnotationDetails();

    }


    addQuestionButtonInPdf(value) {

        if (this.dragQuestionsList) {
            this.dragQuestionsList.forEach((item) => {
                this.dragButton = document.createElement('span');
                this.dragButton.id = item.dragButton.id;
                this.dragButton.style.transform = 'scale(' + this.zoom.toString() + ') rotate(0) translate(0, 0)';
                this.dragButton.style.left = (item.dragButton.x * this.zoom) + 'px';
                this.dragButton.style.top = (item.dragButton.y * this.zoom) + 'px';
                this.dragButton.style.fontSize = (14 * this.zoom).toString() + 'px';
                this.dragButton.style.width = (27 * this.zoom).toString() + 'px';
                this.dragButton.style.background = '#e6baea';
                this.dragButton.style.padding = (6 * this.zoom).toString() + 'px';
                this.dragButton.style.borderRadius = (4 * this.zoom).toString() + 'px';
                this.dragButton.style.textAlign = 'center';
                this.dragButton.style.position = 'absolute';
                this.dragButton.innerHTML = item.text;

                const path = document.getElementsByClassName('page')[item.pageNumber - 1];

                path.appendChild(this.dragButton);

            });
        }
    }

    redoPageRendered(value) {

        let dele: any;
        if (value?.isDelete) {
            dele = value.isDelete ? value.isDelete : true;
        }
        if (dele) {
            const path = document.getElementsByClassName('page')[value.pageNumber - 1];
            const path1 = document.getElementsByClassName('page')[value.pageNumber - 1].getAttribute('data-page-number');

            $('.textLayer').addClass('disable-textLayer');

            const rectId = value.rectangleId;
            const rect = document.createElementNS('http://www.w3.org/2000/svg', value.shape == 'rectMask' ? 'rect' : value.shape == 'highlight' ? 'rect' : value.shape);

            rect.setAttribute('stroke-width', '2');
            rect.setAttribute('stroke', 'red');
            rect.setAttribute('fill', 'none');
            rect.style.width = value.rect.width + 'px';
            rect.style.height = value.rect.height + 'px';

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
            if (value.shape == 'text' && value.rect?.text != '') {
                rect.id = rectId;
                rect.setAttribute('fill', value.color);
                rect.setAttribute('stroke-width', 'none');
                rect.setAttribute('stroke', 'none');
                rect.setAttribute('x', value.rect.x1.toString());
                rect.setAttribute('y', value.rect.y1.toString());
                rect.appendChild(document.createTextNode(value.rect?.text?.toString()));
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
                rect.setAttribute('stroke-width', '0');
                // rect.setAttribute('fill', 'yellow');
                rect.setAttribute('fill', value.color);
                rect.setAttribute('fill-opacity', '0.2');
                rect.setAttribute('x', value.rect.x1.toString());
                rect.setAttribute('y', value.rect.y1.toString());

            }
            rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
            const lengthofChilds = path.children.length;
            for (let i = 0; i < lengthofChilds; i++) {
                if (path.children[i].tagName == 'svg') {
                    rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                    path.children[i].appendChild(rect);
                }
            }
        }
    }


    hoverRemoveItemEnter(event) {
        this.globalPdfViewerPath.find(p => p.className == 'page').appendChild(this.elem);


        $('.textLayer').addClass('disable-textLayer');

        this.rectElem = this.areaInfo.forEach((value) => {

            const eventsvgPath = document.getElementById(event.rectangleId);
            const valuesvgPath = document.getElementById(value.rectangleId);
            // console.log(eventsvgPath , 'eventsvgPath')
            // console.log(valuesvgPath, 'valuesvgPath')
            if (value.pageNumber == event.pageNumber) {

                if (eventsvgPath == valuesvgPath) {
                    const rect = valuesvgPath;

                    if (rect) {
                        if (value.shape == 'rect') {
                            rect.style.animation = 'blinkStroke 0.8s infinite';

                            rect.setAttribute('stroke-width', '2');
                            rect.setAttribute('stroke', value.color);
                            rect.setAttribute('fill', 'none');
                        }
                        if (value.shape == 'circle') {
                            rect.style.animation = 'blinkStroke 0.8s infinite';

                            rect.setAttribute('stroke-width', '2');
                            rect.setAttribute('stroke', value.color);
                            rect.setAttribute('fill', 'none');
                        }

                        if (value.shape == 'path') {
                            rect.style.animation = 'blinkStroke 0.8s infinite';

                            rect.setAttribute('stroke-width', '2');
                            rect.setAttribute('stroke', value.color);
                            rect.setAttribute('fill', 'none');
                        }
                        if (value.shape == 'text') {
                            rect.style.animation = 'blinkFill 0.8s infinite';

                            rect.setAttribute('fill', value.color);
                            rect.setAttribute('stroke-width', 'none');
                            rect.setAttribute('stroke', 'none');
                            // rect.setAttribute("x", value.rect.x1.toString());
                            // rect.setAttribute("y", value.rect.y1.toString());
                            // rect.appendChild(document.createTextNode(value.rect.text.toString()));
                            // rect.style.fontSize = value.fontSize + 'px';
                        }

                        if (value.shape == 'rectMask') {
                            rect.style.animation = 'blinkFill 0.8s infinite';

                            // rect.setAttribute("fill", "#fff");
                            rect.setAttribute('fill', value.color);
                            rect.setAttribute('stroke-width', '0');


                        }

                        if (value.shape == 'highlight') {
                            rect.style.animation = 'blinkFill 0.8s infinite';

                            rect.setAttribute('stroke-width', '0');
                            // rect.setAttribute("fill", "yellow");
                            rect.setAttribute('fill', value.color);
                            rect.setAttribute('fill-opacity', '0.2');
                        }
                    }

                }

            }
        });

    }

    hoverLeaveRemoveItemEnter(event) {
        this.globalPdfViewerPath.find(p => p.className == 'page').appendChild(this.elem);

        $('.textLayer').addClass('disable-textLayer');

        this.rectElem = this.areaInfo.forEach((value, index, arr) => {
            const eventsvgPath = document.getElementById(event.rectangleId);
            const valuesvgPath = document.getElementById(value.rectangleId);

            if (value.pageNumber == event.pageNumber) {

                if (eventsvgPath == valuesvgPath) {
                    const rect = valuesvgPath;
                    if (rect) {
                        rect.style.animation = '';

                        if (value.shape == 'rect') {
                            rect.setAttribute('stroke-width', '2');
                            // rect.setAttribute("stroke", "red");
                            rect.setAttribute('stroke', value.color);
                            rect.setAttribute('fill', 'none');
                        }
                        if (value.shape == 'circle') {
                            rect.setAttribute('stroke-width', '2');
                            rect.setAttribute('stroke', value.color);
                            rect.setAttribute('fill', 'none');
                        }

                        if (value.shape == 'path') {
                            rect.setAttribute('stroke-width', '2');
                            rect.setAttribute('stroke', value.color);
                            rect.setAttribute('fill', 'none');
                        }
                        if (value.shape == 'text') {
                            rect.setAttribute('fill', value.color);
                            // rect.setAttribute("stroke-width", );
                            rect.setAttribute('stroke-width', 'none');
                            rect.setAttribute('stroke', 'none');
                            // rect.setAttribute("x", value.rect.x1.toString());
                            // rect.setAttribute("y", value.rect.y1.toString());
                            // rect.appendChild(document.createTextNode(value.rect.text.toString()));
                            // rect.style.fontSize = value.fontSize + 'px';
                        }

                        if (value.shape == 'rectMask') {
                            rect.setAttribute('fill', '#fff');
                            // rect.setAttribute("fill", "#fff");
                            rect.setAttribute('stroke-width', '0');


                        }

                        if (value.shape == 'highlight') {
                            rect.setAttribute('stroke-width', '0');
                            // rect.setAttribute("fill", "yellow");
                            rect.setAttribute('fill', value.color);
                            rect.setAttribute('fill-opacity', '0.2');

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
        this.elem.style.width = 100 + '%';
        this.elem.style.height = 100 + '%';
        this.elem.style.viewport = event.source.viewport;

        // this.elem.style.transform = 'scale(' + this.scale + ') rotate(0) translate(0, 0)';

        // console.log(event ,'event');
        const path = this.composedPath(event.source.div);
        this.globalPdfViewerPath = path;

        path.find(p => p.className == 'page').appendChild(this.elem);

        this.rectElem = this.areaInfo.forEach((value, index, arr) => {
            if (value.pageNumber == event.pageNumber && value?.isDelete == false) {
                const rectId = value.rectangleId;
                let rect;
                if (value.shape != 'text') {
                    rect = document.createElementNS('http://www.w3.org/2000/svg', value.shape == 'rectMask' ? 'rect' : value.shape == 'highlight' ? 'rect' : value.shape);

                    rect.setAttribute('stroke-width', '2');
                    rect.setAttribute('stroke', value.color);
                    // rect.setAttribute("fill", "none");
                    rect.setAttribute('fill', 'none');
                    rect.style.width = value.rect.width + 'px';
                    rect.style.height = value.rect.height + 'px';
                } else {
                    rect = this.createWrappingText(value.rect.text, value.rect.x1, value.rect.y1, 'auto', value.rect.width, value.rectangleId, value.color);
                }

                if (value.shape == 'rect') {
                    // rect.id = 'rect-' + rectId;
                    rect.id = rectId;
                    rect.setAttribute('x', value.rect.x1.toString());
                    rect.setAttribute('y', value.rect.y1.toString());
                    // rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';

                }
                if (value.shape == 'circle') {
                    // rect.id = 'circle-' + rectId;
                    rect.id = rectId;
                    rect.setAttribute('cx', value.rect.x1.toString());
                    rect.setAttribute('cy', value.rect.y1.toString());
                    rect.setAttribute('r', '50');
                }

                if (value.shape == 'path') {
                    // rect.id = 'path-' + rectId;
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
                    mathBody.id = rectId;
                    mathBody.innerHTML = userInput;
                    rect.appendChild(mathBody);
                }

                if (value.shape == 'text') {
                    // rect.id = 'text-' + rectId;
                    rect.id = rectId;
                    rect.children[0].id = rectId;
                    rect.setAttribute('fill', value.color);
                    rect.setAttribute('stroke-width', 'none');
                    rect.setAttribute('stroke', 'none');
                    rect.setAttribute('x', value.rect.x1.toString());
                    rect.setAttribute('y', value.rect.y1.toString());
                    // rect.appendChild(document.createTextNode(value.rect?.text?.toString()));
                    rect.style.fontSize = value.fontSize + 'px';
                }

                if (value.shape == 'rectMask') {
                    // rect.id = 'rectMask-' + rectId;
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
                    // rect.setAttribute('fill', 'yellow');
                    rect.setAttribute('fill', value.color);
                    rect.setAttribute('fill-opacity', '0.2');
                    rect.setAttribute('x', value.rect.x1.toString());
                    rect.setAttribute('y', value.rect.y1.toString());

                }


                // get to-draw-rectangle div and add rectangle
                const pagePath = path.find(p => p.className == 'page');
                const lengthofChilds = path.find(p => p.className == 'page').children.length;
                for (let i = 0; i < lengthofChilds; i++) {
                    if (pagePath.children[i].tagName == 'svg') {
                        rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
                        rect.addEventListener('pointerenter', this.handleAnnotateErase.bind(this), true);
                        pagePath.children[i].appendChild(rect);
                    }
                }

            }

        });
        this.addQuestionButtonInPdf(event);
        this.clickEvent();
    }

    handleEdit(event) {
        if (this.shapesType != 'eraser') {
            this.dblTimer += 1;
            setTimeout(() => {
                this.dblTimer = 0;
            }, 500);
            console.log(this.dblTimer, 'timer');
            if (this.dblTimer == 2) {
                this.editText(event);
            }
        }
    }


    handleAnnotateErase(event) {
        if (StudentWebAnnotationComponent.me.shapesType == 'eraser') {
            console.log(this.areaInfo, 'areainfo');
            for (let i = 0; i < this.areaInfo.length; i++) {
                if (this.areaInfo[i].isTeacherCorrection && !this.areaInfo[i].isDelete) {
                    if (event.srcElement.id == this.areaInfo[i].rectangleId) {
                        this.areaInfo.splice(i, 1);
                        document.getElementById(event.srcElement.id).remove();
                        this.saveAnnotationDetails();
                    }
                }
            }
        }
    }

    composedPath(el) {
        const path = [];
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
            return 'block';
        } else {
            return 'none';
        }
    }

    save() {
        const path = document.getElementById(this.element.id);
        if (path) {
            this.areaInfo.push({
                rectangleId: this.element.id,
                pageNumber: this.dataPageNumber,
                rect: this.rect,
                isDelete: false,
                userSelect: false,
                isTeacherCorrection: true,
                shape: this.shapesType == 'math' ? 'foreignObject' : this.shapesType,
                color: this.svgColor,
                fontSize: this.textFontSize
            });
            path.addEventListener('pointerenter', this.handleAnnotateErase.bind(this), true);
            this.showPopup = false;
            this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
            this.pagechanging(this.pageVariable);

            // setTimeout(() => {
            this.saveAnnotationDetails();
            // }, 1000);
        }

    }

    close() {
        this.mouseDownFlag = false;
        this.eraserDownMouse = false;
        this.modalRef.close();
    }

    deleteAction() {
        this.modalRef = this.modalService.open(this.deleteClass, {size: 'md', backdrop: 'static', windowClass: 'studentAnotation'});
    }

    ////// get ipad access token details service
    getStudentDetails() {
        const data = {
            platform: 'web',
            authorization_key: this.studentId
        };
        this.creator.getStudDetail(data).subscribe((successData) => {
                this.getStudDetailSuccess(successData);
            },
            (error) => {
                this.getStudDetailFailure(error);
            });
    }

    getStudDetailSuccess(successData) {
        if (successData.IsSuccess) {
            this.detailData = successData.ResponseObject;
            if (this.detailData.status == '1' || this.detailData.status == '2') {
                this.showAnnotation = true;
            }
            this.dragQuestionsList = this.detailData?.questionAnnotation;
            let pdfpath: any;
            pdfpath = this.common.convertBase64(this.detailData?.pdfpath);
            this.pdfTemplate = this.webhost + '/' + pdfpath[0].original_image_url;
            this.detailData.actual_annotation = this.detailData.actual_annotation == null ? [] : this.detailData.actual_annotation;
            this.areaInfo = [...this.detailData.actual_annotation, ...this.detailData.teacher_annotation];
            this.areaInfo.forEach((item) => {
                item.isTeacherCorrection = false;
            });
            this.detailData.student_annotation.forEach((item) => {
                item.isTeacherCorrection = true;
            });
            this.areaInfo = [...this.areaInfo, ...this.detailData.student_annotation];
            this.areaInfo.forEach((item) => {
                item.userSelect = false;
            });
            this.clearSetTimeout = setTimeout(() => {
                this.cdr.detectChanges();
            }, 2500);
        }
    }

    getStudDetailFailure(error) {
        console.log(error, 'error');
    }

    eraseAlert() {
        this.modalRef = this.modalService.open(this.eraseAll, {size: 'md', backdrop: 'static'});
    }

    clearAll() {
        this.areaInfo = [];
        // this.annotate.emit(this.areaInfo);
        console.log(this.areaInfo, 'areaInfo');
        this.jsPDF = new jsPDF();
        this.pdfTemplate = this.jsPDF.output('datauristring');
        this.close();
    }

    saveAnnotationDetails = debounce( () => {
        if (this.annotationType != 'preview') {
            let annotationValues = this.areaInfo.filter(f => f.isTeacherCorrection == true);
            annotationValues = annotationValues.filter(f => f.isDelete === false);
            if (!this.popUp) {
                const data = {
                    platform: 'ios',
                    student_id: this.detailData.student_id,
                    annotation: annotationValues,
                    content_id: this.detailData.content_id,
                    class_id: this.detailData.class_id,
                    student_content_id: this.detailData.student_content_id,
                };
                this.creator.saveAnnotation(data).subscribe(async (successData) => {
                        console.log(successData, 'annotationsucess');
                    },
                    (error) => {
                        console.log(error, 'error');
                    });
            } else {
                this.annotate.emit(annotationValues);
            }
        }
    }, 200);

}

//// Annatation ////

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
    userSelect?: boolean;
    shape: string;
    color: any;
    fontSize: any;
}




