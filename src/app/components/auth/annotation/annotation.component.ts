import {
  Component,
  OnInit,
  ViewChild,
  SimpleChange,
  OnChanges,
  AfterViewInit,
  ElementRef,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  TemplateRef, ChangeDetectionStrategy, SecurityContext, SimpleChanges
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import {AuthService} from '../../../shared/service/auth.service';
import {CreatorService} from '../../../shared/service/creator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ClassService} from '../../../shared/service/class.service';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {NavService} from '../../../shared/service/nav.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import { jsPDF } from 'jspdf';
import {EnvironmentService} from '../../../environment.service';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationComponent implements OnInit {
  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  @Input() toolHide: boolean;
  @Input() toolAdjust: boolean = false;
  @Input() expandPdf: boolean = false;
  @Input() toolAlignCenter: boolean;
  @Input() userType: any;
  @Input() getAnnotate: any;
  @Input() getDragQues: any;
  @Input() pdfPath: any;
  @Input() showPageNo: any = false;
  @Input() pageVariable: any = 1;
  @Input() id: any = 'pdf-page';
  @Output() annotate = new EventEmitter<any>();
  @Output() deleteAnnotation = new EventEmitter<any>();
  @Output() currentPageNo = new EventEmitter<any>();
  @Output() expandBoolean = new EventEmitter<any>();

  public model = {
    editorData: ''
  };

  rect: Rectangle = { x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0 };
  lastMousePosition: Position = { x: 0, y: 0 };
  canvasPosition: Position = { x: 0, y: 0 };
  mousePosition: Position = { x: 0, y: 0 };
  mouseDownFlag = false;
  pagePosition: Position = { x: 0, y: 0 };
  show = false;
  element = null;
  dataPageNumber: number;
  areaInfo: AreaInfo[] = [];
  indexOfPage = 1;
  showPopup = false;
  listRectangleId = '';
  public shapesType: any = 'select';
  public pointerType: any;
  public jsPDF: jsPDF;
  public teacherCorrection: boolean;
  public expand: boolean = false;
  public elem: any;
  public scale: any;
  public globalPdfViewerPath: any;
  public mathDelayer = false;
  public showInput: any = true;
  public textValue: any;
  public inputElement: any;
  public deleteAnnatation: boolean = false;
  public dragQuestionsList: any = [];
  public dragButton: any;
  public startTime: any;
  public editTextInput = false;
  public eraserActive = false;
  public pdfTemplate: any;
  public webhost: any;
  public textPathData: any;
  public rectElem: any;
  public svgColor: any;
  public selectedElement: any;
  public mathVal: any;
  public mathInputEvent: any;
  public editMathInput = false;
  public editMathValue: any;
  public zoom = 1.0;
  public editingTextValue: any;
  public type: any;
  public selectedDeleteIcon = false;
  public buffer: any;
  public strPath: any;
  public textPosition: any;
  public offsetter: any;
  public dragpaths: any;
  public dragPageNumber: any;
  public textFontSize: string;
  public selectedPageAnnatation: any;
  public currentPage = 1;
  public workAreaPageNo = 0;
  public totalPdfPage = 1;
  public itemSelect: any = [];
  public redoListArray: any = [];
  public svgId: any;
  public customPdfLoader = true;
  private modalRef: NgbModalRef;
  public customeScrollPosition: number = 0;
  public workAreaScroll: boolean = false;
  public reccursiveLoading: boolean = false;
  public pdfWidth = 0;
  public pdfHeight = 0;

  @ViewChild('deleteSvgDraw') deleteSvgDraw: TemplateRef<any>;
  @ViewChild('class') deleteClass: TemplateRef<any>;
  @ViewChild('mathShow') mathShow: TemplateRef<any>;
  @ViewChild('eraseAll') eraseAll: TemplateRef<any>;

  constructor(private sanitized: DomSanitizer, public auth: AuthService, public creator: CreatorService, private modalService: NgbModal,
              public activateRoute: ActivatedRoute, public confi: ConfigurationService, public classService: ClassService,
              public toastr: ToastrService, public common: CommonDataService, public env: EnvironmentService,
              public validationService: ValidationService, public router: Router, public navServices: NavService) {
    this.webhost = this.confi.getimgUrl();
    this.preventScroll();
    this.toolAlignCenter = false;
    this.textFontSize = '16';
    this.teacherCorrection = this.type == 'student';

  }

  ngOnInit() {
    this.areaInfo = this.getAnnotate;
    this.dragQuestionsList = this.getDragQues;
    console.log(this.areaInfo , 'areaInfo');
    if (this.toolHide && this.toolAdjust) {
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
    } else {
      this.pdfTemplate = this.pdfPath;
    }
    this.startTime = new Date().getTime();
    this.svgColor = this.userType == 'student' ? '#00CED1' : '#ff0000';
    // this.pageVariable = this.scrollPage == 0 ? 1 : this.scrollPage;
    // this.scrollPage.addEventListener((event) => {
    //   if (this.scrollPage != '0') {
    //
    //   }
    //   console.log(this.pageVariable, 'pageVariable');
    // });
  }

  AfterViewInit(): void {
  }

  // OnChanges(changes: SimpleChanges): void {
  //   if (this.scrollPage != '0') {
  //     console.log(this.pageVariable, 'this.pageVariable');
  //     this.pageVariable = parseInt(this.scrollPage);
  //   }
  // }

  /// main mouse hovering events for annotation //

  mouseOut(event){
    this.commonMouseUp();
    this.lastMousePosition = { x: 0, y: 0 };
    this.mousePosition = { x: 0, y: 0 };
    this.pagePosition = { x: 0, y: 0 };
  }

  mouseOver(event) {
    this.areaInfo.forEach((value) => {
      if (value.rectangleId == event.target.id) {
        if (value.isTeacherCorrection) {
          const split = event.target.id.split('-');
          if (split[0] == 'text' && this.shapesType != 'eraser') {
            event.target.style.cursor = 'move';
          } else if (this.shapesType == 'eraser') {
            event.target.style.cursor = 'default';
          }
        } else {
          event.target.style.cursor = 'default';
        }
      }
    });
  }

  mouseEnter() {
      if (document.getElementById('customText') && this.shapesType == 'text') {
          document.getElementById('customText').focus();
      }
    }
  getParentRecurrsive(val, tagName) {
    this.reccursiveLoading = true;
    if (val.parentElement.tagName === tagName) {
      console.log(val.parentElement.id, 'val.parentElement.id');
      if (tagName == 'svg') {
        this.reccursiveLoading = false;
        return val.parentElement;
      } else {
        this.reccursiveLoading = false;
        return val.parentElement.id;
      }
    } else {
      if (val.parentElement.localName == 'html') {
        this.reccursiveLoading = false;
        return null;
      } else {
        return this.getParentRecurrsive(val.parentElement, tagName);
      }
    }
  }

  async mouseEvent(event, calledFrom ='') {
      const svgData = document.getElementById(this.id).getElementsByTagName('svg');
      if (svgData){
        //// eraser opens///
        if (event.type === 'mousemove' && this.shapesType == 'eraser') {
          if (this.eraserActive) {
            event.preventDefault();
            let math;
            if (event.target.tagName.toLowerCase() == 'span' || event.target.tagName.toLowerCase() == 'p') {
              if (!this.reccursiveLoading) {
                math = await this.getParentRecurrsive(event.target, 'foreignObject');
              }
            }
            if ((document.getElementById(event.target.id) || math != null) && event.target.tagName != 'DIV') {
              let id;
              console.log(math, 'detcet span eraser');
              if (math != null) {
                id = math;
              } else {
                id = event.target.id;
              }
              for (let i = 0; i < this.areaInfo.length; i++) {
                if (this.areaInfo[i].rectangleId == id && this.areaInfo[i].isTeacherCorrection) {
                  this.areaInfo.splice(i, 1);
                  document.getElementById(id).remove();
                  const emitter = this.areaInfo.filter((value) => {
                    return value.isTeacherCorrection == true && value.isDelete == false;
                  });
                  this.annotate.emit(emitter);
                }
              }
            }
          }
        }
        // eraser closes //

        // drag and drop text opens //
        if (event.type == 'mousedown' && this.shapesType != 'eraser' && !this.editTextInput) {
            this.textPathData = null;
            // if (event.path != undefined) {
            //   for (let i = 0; i < event.path.length; i++) {
            //     if (event.path[i].tagName == 'foreignObject') {
            //       this.textPathData = document.getElementById(event.path[i].id);
            //     }
            //   }
            // }
          let id;
          if (event.target.tagName != 'svg') {
            id = this.getParentRecurrsive(event.target, 'foreignObject');
            this.textPathData = document.getElementById(id);
          }
            this.areaInfo.forEach((value) => {
            if (value.rectangleId == this.textPathData?.id) {
              if (value.isTeacherCorrection) {
                this.selectedElement = this.textPathData;
                this.selectedElement.style.cursor = 'move';
                this.offsetter = this.getMousePosition(event);
                this.offsetter.x -= parseFloat(this.selectedElement.getAttributeNS(null, 'x'));
                this.offsetter.y -= parseFloat(this.selectedElement.getAttributeNS(null, 'y'));
                this.mouseDownFlag = true;
              }
            }
          });
        }
        // drag and drop text closes//

        if (event.type === 'click' && this.shapesType != 'eraser') {
          this.dragpaths = this.composedPath(event.target);
        }

        if (event.type == 'mousedown' && this.shapesType != 'text' && this.shapesType != 'eraser' && this.editTextInput) {
          let path = this.composedPath(event.target);
          this.appendTextAreaInput(event, path);
        }
        if (!this.showPopup && this.shapesType != undefined && this.shapesType != '' && this.shapesType != 'select' && this.selectedElement == null) {
          this.initializeAnnotation(event , svgData);
        } else if (this.selectedElement) {
          // drag text
          this.dragAndDropText(event);
        }
      }
  }

  // custom logical created function used for annotation

  initializeAnnotation(event , svgData){
    if (event.type === 'mousemove' && this.shapesType != 'eraser' && this.shapesType != 'text') {
      event.preventDefault();
      this.mousePosition = {
        x: event.clientX - this.pagePosition.x,
        y: event.clientY - this.pagePosition.y,
      };

      if (this.mouseDownFlag) {
        const width = (this.mousePosition.x / this.scale) - (this.lastMousePosition.x  / this.scale);
        const height = (this.mousePosition.y / this.scale)  - (this.lastMousePosition.y  / this.scale);

        this.rect = {
          x1: (this.lastMousePosition.x  / this.scale),
          y1: (this.lastMousePosition.y  / this.scale),
          x2: (this.mousePosition.x /  this.scale),
          y2: (this.mousePosition.y / this.scale),
          d: '',
          text: '',
          width,
          height
        };

        if (this.element != null ) {
          this.updatingPathRectinMousemove(event , width , height);
        }
      }
    }

    if (event.type === 'mousedown' && event.target.tagName != 'DIV' && event.target.tagName != 'TEXTAREA') {
      this.eraserActive = true;
      this.mouseDownFlag = true;
      const path = this.composedPath(event.target);
      const eventPath = path.find(p => p.className == 'page');
      if (typeof eventPath !== 'undefined') {
        this.dataPageNumber = parseInt(eventPath.getAttribute('data-page-number'));
        for (let i = 0; i < svgData.length; i++) {
          if (svgData[i].id == this.dataPageNumber?.toString()) {
            this.svgId = i;
          }
        }
        const toDrawRectangle = document.getElementById(this.id).getElementsByTagName('svg');
        if (toDrawRectangle[this.svgId]){
          const pageOffset = toDrawRectangle[this.svgId].getBoundingClientRect();
          this.pagePosition = {
            x: pageOffset.left,
            y: pageOffset.top
          };
          this.lastMousePosition = {
            x: event.clientX - this.pagePosition.x,
            y: event.clientY - this.pagePosition.y
          };
          this.drawingAnnotationbyShapetype(event , path);
        }
      }
    }

    if (event.type === 'mouseup') {
      this.commonMouseUp();
    }
  }

  drawingAnnotationbyShapetype(event , path){
    const rectId = Math.random().toFixed(6);
    if (this.shapesType != 'text' && this.shapesType != 'math') {
      this.element = document.createElementNS('http://www.w3.org/2000/svg', this.shapesType == 'rectMask' ? 'rect' : this.shapesType == 'highlight' ? 'rect' : this.shapesType);
      this.element.setAttribute('stroke-width', '2');
      this.element.setAttribute('stroke', this.svgColor);
      this.element.setAttribute('fill', 'none');
    }

    if (this.shapesType == 'rect') {
      this.element.id = 'rect-' + rectId;
      this.element.setAttribute('x', this.lastMousePosition.x / this.scale);
      this.element.setAttribute('y', this.lastMousePosition.y / this.scale);
    }

    if (this.shapesType == 'path'){

      this.element.id = 'path-' + rectId;
      this.strPath = 'M' + (this.lastMousePosition.x / this.scale) + ' ' + (this.lastMousePosition.y / this.scale);
      this.element.setAttribute('d', this.strPath);
    }

    if (this.shapesType == 'rectMask'){
      this.element.id = 'rectMask-' + rectId;
      this.element.setAttribute('stroke-width', '0');
      this.element.setAttribute('fill', '#fff');
      this.element.setAttribute('x', (this.lastMousePosition.x / this.scale));
      this.element.setAttribute('y', (this.lastMousePosition.y / this.scale));

    }

    if (this.shapesType == 'highlight'){
      this.element.id = 'highlight-' + rectId;
      this.element.setAttribute('stroke-width', '0');
      this.element.setAttribute('fill', this.svgColor);
      this.element.setAttribute('fill-opacity', '0.2');
      this.element.setAttribute('x', (this.lastMousePosition.x / this.scale));
      this.element.setAttribute('y', (this.lastMousePosition.y / this.scale));

    }
    if (this.shapesType == 'math' && !this.editTextInput && !this.editMathInput) {
      this.editMathValue = '';
      this.modalRef = this.modalService.open(this.mathShow, { size: 'md', backdrop: 'static' });
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

    if (this.shapesType == 'text' ) {
      this.appendTextAreaInput(event , path);
    }

    if (this.element){
      this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
    }
  }

  updatingPathRectinMousemove(event , width , height){
    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';

    if (this.shapesType != 'path') {
      if (this.rect.width < 0 || this.rect.height < 0) {
        if (document.getElementById(this.element.id)) {
          document.getElementById(this.element.id).remove();
        }
      } else {
        document.getElementById(this.id).getElementsByTagName('svg')[this.svgId].appendChild(this.element);
      }
    }else if ( this.shapesType == 'path') {
      document.getElementById(this.id).getElementsByTagName('svg')[this.svgId].appendChild(this.element);
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

  commonMouseUp(){
    // when user released the mouse or done the annotation
    this.eraserActive = false;
    this.mouseDownFlag = false;
    this.buffer = [];
    this.rect.d = this.strPath;
    this.rect.text = this.textValue;
    if (this.shapesType == 'text'){
        document.getElementById('customText')?.focus();
    } else if (this.shapesType == 'rect') {
      if (this.rect.x1 !== 0 && this.rect.x2 !== this.rect.x1){
        this.save();
      }
    } else if (this.shapesType != 'math'){
      if (this.rect.x1 !== 0 && this.rect.x2 !== 0){
        this.save();
      }
    }
  }

  dragAndDropText(event) {
    // patching the dynamic coordinates to the dragging element while mousemove
    if (event.type == 'mousemove' && this.mouseDownFlag && this.selectedElement) {
      event.preventDefault();
      const coord = this.getMousePosition(event);
      this.selectedElement.setAttributeNS(null, 'x', coord.x - this.offsetter.x);
      this.selectedElement.setAttributeNS(null, 'y', coord.y - this.offsetter.y);
    }

    // updating the element position and its value when mouse up
    if (event.type == 'mouseup' && this.selectedElement) {
      this.mouseDownFlag = false;
      this.offsetter = null;
      this.areaInfo.forEach((val) => {
        if (this.selectedElement.id == val.rectangleId) {
          val.rect.x1 = this.selectedElement.x.baseVal.value;
          val.rect.y1 = this.selectedElement.y.baseVal.value;
        }
      });
      const emitter = this.areaInfo.filter((value) => {
        return value.isTeacherCorrection == true && value.isDelete == false;
      });
      this.annotate.emit(emitter);
      this.selectedElement = null;
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

  appendTextAreaInput(event , path){
    this.pdfWidth = parseInt((document.getElementById(this.id).getElementsByTagName('svg')[this.svgId].style.width).split('px')[0]);
    this.pdfHeight = parseInt((document.getElementById(this.id).getElementsByTagName('svg')[this.svgId].style.height).split('px')[0]);
    console.log(this.pdfWidth, 'pdfWidth');
    if (event.target.tagName != 'TEXTAREA') {
      if (document.getElementById('customArea') != null) {
        if ($('textarea[name="customText"]').val() == '') {
          document.getElementById('customArea')?.remove();
          this.showInput = true;
        } else {
          this.showInput = false;
        }
      }
      if (this.showInput) {
        this.appendTextArea(event, path, '40px', '50px');
        this.lastMousePosition = {
          x: event.clientX - this.pagePosition.x,
          y: event.clientY - this.pagePosition.y
        };
        this.inputElement.style.left = (this.lastMousePosition.x / this.scale) > 560 ? ((this.lastMousePosition.x) - 60).toString() + 'px' : (this.lastMousePosition.x).toString() + 'px';
        this.inputElement.style.top = (this.lastMousePosition.y / this.scale) > 920 ? ((this.lastMousePosition.y) - 50).toString() + 'px' : (this.lastMousePosition.y).toString() + 'px';
        this.inputElement.style.width = 'auto';
        this.inputElement.style.position = 'absolute';
        this.textPosition = {
          x: this.lastMousePosition.x / this.scale,
          y: this.lastMousePosition.y / this.scale,
        };
        const paths = this.composedPath(event.target);
        if (event.target.name != 'customArea') {
          paths?.find(p => p.className == 'page').appendChild(this.inputElement);
        }
      }
      console.log(this.textPosition, 'textPosition');
      if (!this.showInput){
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
            this.element = this.createWrappingText(this.textValue, this.textPosition.x, this.textPosition.y , height , width , idd, this.svgColor);
            this.element.id = 'text-' + rectId;
            this.element.setAttribute('fill', this.svgColor);
            this.element.style.fontSize = this.textFontSize + 'px';
            this.element.style.flexWrap = 'wrap';
            this.element.style.cursor = 'move';
            this.rect.x1 = this.textPosition.x;
            this.rect.y1 = this.textPosition.y;
            this.rect.text = this.textValue;
            console.log(this.rect, 'reacyandaglue');
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
        }
        else {
          this.textValue = $('textarea[name="customText"]').val();
          if (this.textValue != '') {
            const height = document.getElementById('customText').style.height;
            const width = document.getElementById('customText').style.width;
            this.element = this.createWrappingText(this.textValue, this.editingTextValue.rect.x1, this.editingTextValue.rect.y1 , height , width , this.editingTextValue.rectangleId, this.svgColor);
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
            const emitter = this.areaInfo.filter((value) => {
              return value.isTeacherCorrection == true && value.isDelete == false;
            });
            this.annotate.emit(emitter);
            document.getElementById('customArea').remove();
          }
        }
        this.textValue = '';
        this.showInput = true;
        this.element = null;
        this.editTextInput = false;
      }
    }
  }

  createWrappingText(text , x , y , height , width , id, color){
    // const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    svgText.setAttributeNS(null, 'x', x);
    svgText.setAttributeNS(null, 'y', y);
    let post = document.createElement('pre');
    post.setAttribute('id' , id);
    post.className = 'textInput';
    post.setAttribute('xmlns' , 'http://www.w3.org/1999/xhtml');
    post.textContent = text;
    const textValue = [];
    text.split(/^/gm).forEach((items) => {
      textValue.push(items.length);
    });
    post.innerHTML = post.innerHTML.replace(/\n/g, '<br>\n');
    // let split1 = post.innerHTML.split('<br>');
    // let wordCount = 0;
    // let word;
    // for (let i = 0; i < split1.length; i++) {
    //   let split2 = split1[i].split('');
    //   if (split2.length > wordCount) {
    //     wordCount = split2.length;
    //     word = split1[i];
    //   }
    // }
    // console.log(word, 'long')
    // let w = word.getContext('2d');
    // console.log(w)
    // let getWid = w.measureText(word).width;
    // console.log(getWid, 'width');

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

  async editText(event) {
      let id = null;
      if (!this.reccursiveLoading) {
        id = await this.getParentRecurrsive(event.target, 'foreignObject');
      }
      // event.path.forEach((value, index) => {
      //     if (value.tagName == 'foreignObject') {
      //         id = index;
      //     }
      // });
    console.log(id, 'edit id');
    if (id) {
      let split = id.split('-');
      if (split[0] == 'text') {
        this.areaInfo.forEach((value) => {
          if (value.rectangleId == id && value.isTeacherCorrection) {
            this.editingTextValue = value;
            console.log(value, 'value')
            this.appendTextArea(event, event.path, value.rect.width, value.rect.height);
            this.inputElement.children[0].innerHTML = event.target.innerText;
            this.inputElement.style.left = value.rect.x1 > 520 ? (value.rect.x1 - 60).toString() + 'px' : (value.rect.x1).toString() + 'px';
            // this.inputElement.style.top = value.rect.y1 > 920 ? (value.rect.y1 - 50).toString() + 'px' : (value.rect.y1).toString() + 'px';
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
            this.modalRef = this.modalService.open(this.mathShow, { size: 'md', backdrop: 'static' });
          }
        });
      }
    }
  }
  //
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
  expandPage(val) {
    this.expand = val;
    this.expandBoolean.emit(val);
  }

  tools(type, pointerType){
    this.elem.style.cursor = pointerType;
    if (this.shapesType === type){
      this.shapesType = '';
      if (document.getElementById('customArea') && this.shapesType != 'text') {
        document.getElementById('customArea').remove();
        this.editTextInput = false;
      }
      this.showInput = true;
    }else{
      this.shapesType = type;
      if (document.getElementById('customArea') && this.shapesType != 'text') {
        document.getElementById('customArea').remove();
        this.editTextInput = false;
      }
      this.showInput = true;
    }
    this.elem.style.cursor = pointerType;
  }

  eraseAlert() {
    this.modalRef = this.modalService.open(this.eraseAll, { size: 'md', backdrop: 'static' });
  }

  clearAll() {
    this.areaInfo = [];
    this.annotate.emit(this.areaInfo);
    console.log(this.areaInfo, 'areaInfo');
    this.jsPDF = new jsPDF();
    this.pdfTemplate = this.jsPDF.output('datauristring');
    // if (this.pageVariable == 1) {
    //   this.pageVariable = 2;
    // } else {
    //   this.pageVariable = 1;
    // }
    this.close();
  }

  preventScroll() {
    document.body.style.overflow = 'hidden';
  }

  allowScroll() {
    document.body.style.overflow = 'scroll';
  }

  deleteSvg(){
    this.modalRef = this.modalService.open(this.deleteClass, { size: 'md', backdrop: 'static' });
  }

  backToQuestion(){
    this.selectedDeleteIcon = false;
    this.deleteAnnatation = false;
    this.deleteAnnotation.emit(this.deleteAnnatation);
  }


  ///math input annotation
  clickEvent(){
    if (!this.mathDelayer) {
      this.mathDelayer = true;
      setTimeout( () => {
        document.getElementById('myDiv').click();
      } , 1000);
    }
    setTimeout(() => {
      this.mathDelayer = false;
    }, 1500);
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
        const emitter = this.areaInfo.filter((value) => {
          return value.isTeacherCorrection == true && value.isDelete == false;
        });
        this.annotate.emit(emitter);
      }
      else {
        this.rect.x1 = this.textPosition.x;
        this.rect.y1 = this.textPosition.y;
        this.rect.text = this.mathVal;
        this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
        const path = this.composedPath(this.mathInputEvent);
        this.element.children[0].children.forEach((value) => value.id = 'math-' + rectId);
        // let pagePath = path.find(p => p.className == 'page').children[1].appendChild(this.element);
        const pagePath = path.find(p => p.className == 'page');
        const lengthofChilds = path.find(p => p.className == 'page').children.length;
        for (let i = 0; i < lengthofChilds; i ++){
          if (pagePath.children[i].tagName == 'svg'){
            this.element.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
            pagePath.children[i].appendChild(this.element);
          }
        }
        console.log('before save funct');
        this.save();
      }
      this.mathVal = '';
      this.element = null;
      this.editMathInput = false;
      this.editMathValue = '';
      this.clickEvent();
    }
  }

  // annotation part related function //

  getMousePosition(evt) {
    if (evt.target.tagName != 'DIV') {
        let CTM;
      if (evt.target.tagName == 'svg') {
        CTM = evt.target.getScreenCTM();
      } else {
        const svgElem = this.getParentRecurrsive(evt.target, 'svg');
        CTM = svgElem.getScreenCTM();
      }
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
      const emitter = this.areaInfo.filter((value) => {
        return value.isTeacherCorrection == true && value.isDelete == false;
      });
      this.annotate.emit(emitter);
      this.selectedElement = null;
    }
  }

  save() {
    const path = document.getElementById(this.element.id);
    if (path){
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
      const emitter = this.areaInfo.filter((value) => {
        return value.isTeacherCorrection == true && value.isDelete == false;
      });
      this.annotate.emit(emitter);
      this.showPopup = false;
      this.rect = { x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0 };

      this.selectedPageAnnatation =  this.areaInfo.filter((value, id, array) => {
        if (value.isTeacherCorrection) {
          return value.pageNumber == this.pageVariable;
        }
      });
      this.itemSelect = this.selectedPageAnnatation;
    }else{
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

  appendToBuffer(pt) {
    this.buffer.push(pt);
    while (this.buffer.length > 8) {
      this.buffer.shift();
    }
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

// pdf-viewer built in funtions //
  pageRendered(event) {
    this.scale = event.source.scale;
    console.log(this.scale, 'scale')
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
          rect = this.createWrappingText(value.rect.text, value.rect.x1, value.rect.y1 , 'auto', value.rect.width , value.rectangleId, value.color);
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

        if (value.shape == 'foreignObject'){
          rect.id = rectId;
          rect.setAttribute('fill', value.color);
          rect.setAttribute('stroke-width', 'none');
          rect.setAttribute('stroke', 'none');
          rect.setAttribute('x', value.rect.x1.toString());
          rect.setAttribute('y', value.rect.y1.toString());
          rect.style.width = 'math';
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
          rect.id = rectId;
          rect.children[0].id = rectId;
          rect.setAttribute('fill', value.color);
          rect.setAttribute('stroke-width', 'none');
          rect.setAttribute('stroke', 'none');
          rect.setAttribute('x', value.rect.x1.toString());
          rect.setAttribute('y', value.rect.y1.toString());
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
          rect.setAttribute('fill', value.color);
          rect.setAttribute('fill-opacity', '0.2');
          rect.setAttribute('x', value.rect.x1.toString());
          rect.setAttribute('y', value.rect.y1.toString());
        }

        // get to-draw-rectangle div and add rectangle
        rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
        const pagePath = path.find(p => p.className == 'page');
        const lengthofChilds = path.find(p => p.className == 'page').children.length;
        for (let i = 0; i < lengthofChilds; i ++){
          if (pagePath.children[i].tagName == 'svg'){
            rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
            pagePath.children[i].appendChild(rect);
          }
        }
      }
    });
    this.clickEvent();
    this.addQuestionButtonInPdf(event, path);
  }

  addQuestionButtonInPdf(value, way){
    // Exists.
    // this.dragpaths = this.composedPath(event.target);
    // let drageventPath = this.dragpaths.find(p => p.className == 'page');

    // if (drageventPath) {
    if (this.dragQuestionsList){
      this.dragQuestionsList.forEach( (item) => {
        if ($('#' + item.dragButton.id).length == 0){
          // document.getElementById(item.id).style.position = 'absolute';
          // document.getElementById(item.id).style.transform = 'none';
          this.dragButton = document.createElement('span');
          this.dragButton.id = item.dragButton.id;
          this.dragButton.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
          // this.dragButton.style.left = item.dragButton.x + 'px';
          // this.dragButton.style.top = item.dragButton.y + 'px';
          // this.dragButton.style.fontSize = '14px';
          // this.dragButton.style.width = '27px';
          // this.dragButton.style.background = "#e6baea";
          // this.dragButton.style.padding = "6px";
          // this.dragButton.style.borderRadius = "4px";
          // this.dragButton.style.textAlign = "center";
          ///
          this.dragButton.style.left = (item.dragButton.x * this.scale) + 'px';
          this.dragButton.style.top = (item.dragButton.y * this.scale) + 'px';
          this.dragButton.style.fontSize = (14 * this.scale).toString() + 'px';
          this.dragButton.style.minWidth = (27 * this.scale).toString() + 'px';
          this.dragButton.style.padding = (6 * this.scale).toString() + 'px';
          this.dragButton.style.borderRadius = (4 * this.scale).toString() + 'px';
          this.dragButton.style.background = '#e6baea';
          this.dragButton.style.textAlign = 'center';
          this.dragButton.style.position = 'absolute';
          this.dragButton.innerHTML = item.text;
          // const pagePath = way.find(p => p.className == 'page');
          // const lengthofChilds = way.find(p => p.className == 'page').children.length;
          // for (let i = 0; i < lengthofChilds; i ++){
          //   if (pagePath.children[i].tagName == 'svg'){
          //     this.dragButton.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
          //     pagePath.children[i].appendChild(this.dragButton);
          //   }
          // }
          let path = document.getElementsByClassName('page')[item.pageNumber - 1];
          // path.children[2].appendChild(this.dragButton);
          path.appendChild(this.dragButton);
          // this.dragpaths.find(p => p.className == 'page').appendChild(this.dragButton);
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

  textRender(event){
    const path = this.composedPath(event.source.textLayerDiv);
    path.find(p => p.className == 'page').appendChild(event.source.textLayerDiv);
  }

  callBackFn(pdf: any) {
    this.totalPdfPage = pdf._pdfInfo.numPages;
    let end = new Date().getTime();
    let total_time = end - this.startTime;
    console.log(total_time ,'total_time');
    console.timeEnd('pdf tim end');
    this.customPdfLoader = false;
    this.allowScroll();
    this.setCustomScrollPosition();
  }

  setCustomScrollPosition() {
    if (this.workAreaScroll){
      const workArea = document.getElementById('workArea');
      console.log(workArea , 'workArea');
      console.log(this.customeScrollPosition ,'pos');
      setTimeout(() => {
        workArea?.scrollTo(0, this.customeScrollPosition);
        this.workAreaScroll = false;
      }, 50);
    }
  }
  scrollDownPads(event) {
    this.customeScrollPosition = Math.floor(event.currentScrollPosition);
    this.workAreaScroll = true;
    this.jsPDF.addPage();
    this.pdfTemplate = this.jsPDF.output('datauristring');
    console.log(this.areaInfo, 'area');
  }

  pagechanging(event) {
    if (this.deleteAnnatation){
      this.selectedPageAnnatation =  this.areaInfo.filter((value, id, array) => {
        if (value.isTeacherCorrection) {
          return value.pageNumber == event;
        }
      });
      this.itemSelect = this.selectedPageAnnatation;
    }
    this.currentPageNo.emit(event);
  }

  onerror(error){
    this.customPdfLoader = false;
    console.error(error , 'errr');
    this.toastr.error(error.message);
  }



  // old delete feature set of codes

  redoPageRendered(value) {
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
    if (value.shape == 'text') {
      rect.id = rectId;
      rect.setAttribute('fill', 'red');
      rect.setAttribute('stroke-width', 'none');
      rect.setAttribute('stroke', 'none');
      rect.setAttribute('x', value.rect.x1.toString());
      rect.setAttribute('y', value.rect.y1.toString());
      rect.appendChild(document.createTextNode(value.rect.text.toString()));
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
      rect.id =  rectId;
      rect.setAttribute('stroke-width', '0');
      rect.setAttribute('fill', value.color);
      rect.setAttribute('fill-opacity', '0.2');
      rect.setAttribute('x', value.rect.x1.toString());
      rect.setAttribute('y', value.rect.y1.toString());

    }
    rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';

    const lengthofChilds = path.children.length;
    for (let i = 0; i < lengthofChilds; i ++){
      if (path.children[i].tagName == 'svg'){
        rect.style.transform = 'scale(' + this.scale.toString() + ') rotate(0) translate(0, 0)';
        path.children[i].appendChild(rect);
      }
    }
  }

  hoverRemoveItemEnter(event){
    this.globalPdfViewerPath.find(p => p.className == 'page').appendChild(this.elem);
    $('.textLayer').addClass('disable-textLayer');

    this.rectElem = this.areaInfo.forEach((value) => {

      const eventsvgPath = document.getElementById(event.rectangleId);
      const valuesvgPath = document.getElementById(value.rectangleId);
      if (value.pageNumber == event.pageNumber ) {

        if (eventsvgPath == valuesvgPath){
          const rect = valuesvgPath;
          if (rect){
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
            }

            if (value.shape == 'rectMask') {
              rect.style.animation = 'blinkFill 0.8s infinite';
              rect.setAttribute('fill', value.color);
              rect.setAttribute('stroke-width', '0');
            }

            if (value.shape == 'highlight') {
              rect.style.animation = 'blinkFill 0.8s infinite';
              rect.setAttribute('stroke-width', '0');
              rect.setAttribute('fill', value.color);
              rect.setAttribute('fill-opacity', '0.2');
            }
          }
        }
      }
    });

  }

  hoverLeaveRemoveItemEnter(event){
    this.globalPdfViewerPath.find(p => p.className == 'page').appendChild(this.elem);

    $('.textLayer').addClass('disable-textLayer');

    this.rectElem = this.areaInfo.forEach((value, index, arr) => {
      const eventsvgPath = document.getElementById(event.rectangleId);
      const valuesvgPath = document.getElementById(value.rectangleId);

      if (value.pageNumber == event.pageNumber ) {

        if (eventsvgPath == valuesvgPath){
          const rect = valuesvgPath;
          if (rect){
            rect.style.animation = '';

            if (value.shape == 'rect') {
              rect.setAttribute('stroke-width', '2');
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
              rect.setAttribute('stroke-width', 'none');
              rect.setAttribute('stroke', 'none');
            }

            if (value.shape == 'rectMask') {
              rect.setAttribute('fill', '#fff');
              rect.setAttribute('stroke-width', '0');
            }

            if (value.shape == 'highlight') {
              rect.setAttribute('stroke-width', '0');
              rect.setAttribute('fill', value.color);
              rect.setAttribute('fill-opacity', '0.2');
            }
          }
        }
      }
    });

  }

  removeAnnatation(event){

    for (let i = 0; i < this.areaInfo.length; i++) {
      if (event.rectangleId == this.areaInfo[i].rectangleId) {
        this.areaInfo[i].isDelete = true;
        this.redoListArray.push(this.areaInfo[i]);
      }
    }
    const joinString = event.rectangleId;
    document.getElementById(joinString).remove();

    this.selectedPageAnnatation =  this.areaInfo.filter((value, id, array) => {
      if (value.isTeacherCorrection) {
        return value.pageNumber == this.pageVariable;
      }
    });

    this.itemSelect = this.selectedPageAnnatation;
    const emitter = this.areaInfo.filter((value) => {
      return value.isTeacherCorrection == true && value.isDelete == false;
    });
    this.annotate.emit(emitter);

  }

  undoDeleteAnnatation(event){
    for (let i = 0; i < this.redoListArray.length; i++) {
      if (event.rectangleId == this.redoListArray[i].rectangleId) {
        this.redoPageRendered(this.redoListArray[i]);
        this.redoListArray.splice(i , 1);

      }
    }

    for (let i = 0; i < this.areaInfo.length; i++) {
      if (event.rectangleId == this.areaInfo[i].rectangleId) {
        this.areaInfo[i].isDelete = false;
      }
    }

    this.selectedPageAnnatation =  this.areaInfo.filter((value, id, array) => {
      if (value.isTeacherCorrection) {
        return value.pageNumber == this.pageVariable;
      }
    });

    this.itemSelect = this.selectedPageAnnatation;
    const emitter = this.areaInfo.filter((value) => {
      return value.isTeacherCorrection == true && value.isDelete == false;
    });
    this.annotate.emit(emitter);

  }


  deleteAllAnnotation(){

    for (let i = 0; i < this.areaInfo.length; i++) {
      if (document.getElementById(this.areaInfo[i].rectangleId)){
        if (this.areaInfo[i].isTeacherCorrection) {
          this.areaInfo[i].isDelete = true;
          // this.areaInfo.splice(i, 1);
          this.redoListArray.push(this.areaInfo[i]);
          document.getElementById(this.areaInfo[i].rectangleId).remove();
        }
      }
    }

    // this.areaInfo = [];
    this.selectedPageAnnatation =  this.areaInfo.filter((value, id, array) => {
      if (value.isTeacherCorrection) {
        return value.pageNumber == this.pageVariable;
      }
    });

    this.itemSelect = this.selectedPageAnnatation;
    const emitter = this.areaInfo.filter((value) => {
      return value.isTeacherCorrection == true && value.isDelete == false;
    });
    this.annotate.emit(emitter);
    this.close();
  }

  close() {
    this.modalRef.close();
  }

  deleteCurrentPageAnnotation(){
    for (let i = 0; i < this.areaInfo.length; i++) {
      if (document.getElementById(this.areaInfo[i].rectangleId)) {
        if (this.pageVariable == this.areaInfo[i].pageNumber && this.areaInfo[i].isTeacherCorrection) {
          this.areaInfo[i].isDelete = true;
          // this.areaInfo.splice(i, 1);
          this.redoListArray.push(this.areaInfo[i]);
          document.getElementById(this.areaInfo[i].rectangleId).remove();
        }
      }
    }
    const emitter = this.areaInfo.filter((value) => {
      return value.isTeacherCorrection == true && value.isDelete == false;
    });
    this.annotate.emit(emitter);
    this.close();
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
