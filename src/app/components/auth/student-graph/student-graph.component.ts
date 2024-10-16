import {AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {ClassService} from '../../../shared/service/class.service';
import {ContentService} from '../../../shared/service/content.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {FormBuilder} from '@angular/forms';
import {CreatorService} from '../../../shared/service/creator.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ValidationService} from '../../../shared/service/validation.service';
import * as JXG from '../../../../assets/js/jsxgraphcore';
import {parse, stringify} from 'flatted';

@Component({
  selector: 'app-student-graph',
  templateUrl: './student-graph.component.html',
  styleUrls: ['./student-graph.component.scss']
})
export class StudentGraphComponent implements  OnInit, AfterContentInit {


  /// graphin varibales

  public markType = '';
  public board: any;
  public editMode: any;


  public studentId: any;
  public contentId: any;
  public questionId: any;
  public class_id: any;
  public typeId: any;
  public teacherAns: any;
  public studentAns: any;
  public questionType: any;
  public contentFormat: any;
  public question: any;
  public studentAns1: any;
  public studentAns2: any;



  constructor(public auth: AuthService,
              public activateRoute: ActivatedRoute,
              public cd: ChangeDetectorRef,
              public classService: ClassService,
              public config: ConfigurationService,
              public sanitizer: DomSanitizer,
              private formBuilder: FormBuilder,
              public creator: CreatorService,
              private toastr: ToastrService,
              public router: Router,
              public validationService: ValidationService, public route: ActivatedRoute) {
    this.activateRoute.params.forEach((params) => {
      this.studentId = params.studentId;
      this.contentId = params.cId;
      this.questionId = params.qId;
      this.class_id = params.classId;
      this.typeId = params.typeId;
      this.questionType = params.quesType;
      this.contentFormat = params.format;
    });

    router.events.subscribe((val) => {
      console.log(val instanceof NavigationEnd);
      console.log(val ,'val');
      if(val instanceof NavigationEnd){
        let url  = val.url.split('/');
        console.log(url ,'url')
        this.studentId = url[2];
        this.contentId = url[3];
        this.questionId = url[4];
        this.class_id = url[5];
        this.questionType = url[6];
        this.contentFormat = url[7];
        this.typeId = url[8];
        console.log(this.typeId ,'typeid')
      }
    });
    this.getGraphDetails(this.typeId);
  }

  ngOnInit(): void {
    // this.findPointsDuplicate();
    // this.activateRoute.params.forEach((params) => {
    //   this.studentId = params.studentId;
    //   this.contentId = params.cId;
    //   this.questionId = params.qId;
    //   this.class_id = params.classId;
    //   this.typeId = params.typeId;
    // });
    // let id = this.typeId == '1'  ? '2' : '3';
  }

  ngAfterContentInit(): void {

  }

  getGraphDetails(type) {
    let graph: any;
    if (this.studentAns1 && type == '1') {
      let objects = {};
      for (let el in this.studentAns1.objects) {
        let inherit = [];
        this.studentAns1.objects[el].inherits.forEach((item) => {
          inherit.push({name: item.name});
        });
        objects[el] = {
          elType: this.studentAns1.objects[el].elType,
          coords: this.studentAns1.objects[el].coords,
          name: this.studentAns1.objects[el].name,
          inherits: inherit,
          parents: this.studentAns1.objects[el].parents,
          splinePoints: this.studentAns1.objects[el].splinePoints,
          quadraticform: this.studentAns1.objects[el].quadraticform,

        };
      }
      console.log(objects, 'objectss')
      let objectsArr = [];
      objectsArr.push(objects);
      console.log(objectsArr, 'objectsArr')
      graph = {
        attr: this.studentAns1.attr,
        objects: objects
      }
    }
      const data = {
        platform: 'ios',
        student_id: this.studentId,
        question_id: this.questionId,
        content_id: this.contentId,
        class_id: this.class_id,
        // graph_answer: this.studentAns2,
        content_format: this.contentFormat,
        answer: type != '3' && type != '2' ? [{correctAnswer: stringify(graph), correctActive: ''}] : [{correctAnswer: '', correctActive: ''}],
        student_answer: type != '3' && type != '2'  ? [{correctAnswer: stringify(graph), correctActive: ''}] : [{correctAnswer: '', correctActive: ''}],
        type
      };
      this.creator.graphAnswer(data).subscribe((successData) => {
            this.saveGraphSuccess(successData , type);
          },
          (error) => {
            this.saveGraphFailure(error);
          });

  }
  saveGraphSuccess(successData , type) {
 
    this.question = '';
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      console.log(type ,'type');
      // this.editPatchValue = false;
      this.question = successData.ResponseObject[0].question;
      if (type == '2' ){
        this.studentAns1 = '';
        this.studentAns1 = successData.ResponseObject[0].student_answer != '' && parse(successData.ResponseObject[0]?.student_answer[0]?.correctAnswer) ? parse(successData.ResponseObject[0].student_answer[0].correctAnswer): false;
        this.editMode = true;
      }else if (type == '1'){
        this.toastr.success('Updated Successfully');
        // setTimeout( ()=> {
        //   this.router.navigate(['/auth/login']);
        // } , 500);
      }else if (type == '3'){
        this.teacherAns = '';
        this.studentAns = '';
        console.log(successData.ResponseObject, 'sudas');
        this.studentAns = successData.ResponseObject[0].student_answer != '' ? parse(successData.ResponseObject[0].student_answer[0].correctAnswer) : '';
        this.teacherAns = successData.ResponseObject[0].correct_answer != '' ? parse(successData.ResponseObject[0].correct_answer) : '';
      }
    }
  }
  saveGraphFailure(error) {
    console.log(error, 'error');
  }

  getRoughWorkEvent(event){

  }
  getNumericWorkSpaceValue(event) {
    if (event.content != '') {
      this.studentAns2 = event.content;
    }
  }

  // line drawing code  ended

  getEmitedValue(event){
    this.markType = event;
    console.log(event , 'evet emited');
  }

  getGraphValue(event){
    this.studentAns1 = event;

  }

  /// graphing code closed here
}
