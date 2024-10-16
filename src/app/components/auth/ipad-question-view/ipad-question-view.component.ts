import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreatorService} from '../../../shared/service/creator.service';
import {CommonService} from '../../../shared/service/common.service';
import {CommonDataService} from '../../../shared/service/common-data.service';

@Component({
  selector: 'app-ipad-question-view',
  templateUrl: './ipad-question-view.component.html',
  styleUrls: ['./ipad-question-view.component.scss']
})
export class IpadQuestionViewComponent implements OnInit {
// public data = [];
  public studentId: any;
  public cId: any;
  public qId: any;
  public classId: any;
  public typeId: any;
  public showId: any;
  public SelectTypeId: any;
  public questionDetails: any;
  public totalAns: any = [];
  public answer: any;
  constructor(public route: ActivatedRoute, public creator: CreatorService, public common: CommonService, public commondata: CommonDataService) {
    this.route.params.forEach((params) => {
      this.studentId = params.studentId;
      this.cId = params.cId;
      this.qId = params.qId;
      this.classId = params.classId;
      this.typeId = params.typeId;
      this.showId = params.showID;
      console.log(this.showId, 'showId');
    });
    console.log(this.typeId, 'typeId');
    this.SelectTypeId = '2';
    // this.data = [{
    //   name: 'a',
    //   id: 1
    // }, {
    //   name: 'b',
    //   id: 2
    // },
    //   {
    //     name: 'c',
    //     id: 3
    //   }, {
    //     name: 'd',
    //     id: 4
    //   },
    //   {
    //     name: 'e',
    //     id: 5
    //   }, {
    //     name: 'f',
    //     id: 6
    //   },
    //   {
    //     name: 'g',
    //     id: 7
    //   }, {
    //     name: 'h',
    //     id: 8
    //   },
    //   {
    //     name: 'i',
    //     id: 9
    //   }, {
    //     name: 'j',
    //     id: 10
    //   },
    //   {
    //     name: 'k',
    //     id: 11
    //   }, {
    //     name: 'l',
    //     id: 12
    //   },
    //   {
    //     name: 'm',
    //     id: 13
    //   }, {
    //     name: 'n',
    //     id: 14
    //   },
    //   {
    //     name: 'o',
    //     id: 15
    //   }, {
    //     name: 'p',
    //     id: 16
    //   }, {
    //     name: 'q',
    //     id: 17
    //   }, {
    //     name: 'r',
    //     id: 18
    //   },
    //   {
    //     name: 's',
    //     id: 19
    //   }, {
    //     name: 't',
    //     id: 20
    //   },
    //   {
    //     name: 'u',
    //     id: 21
    //   }, {
    //     name: 'v',
    //     id: 22
    //   },
    //   {
    //     name: 'w',
    //     id: 23
    //   }, {
    //     name: 'x',
    //     id: 24
    //   },
    //   {
    //     name: 'y',
    //     id: 25
    //   }, {
    //     name: 'z',
    //     id: 26
    //   }];
  }

  ngOnInit(): void {
    this.getViewScratchQuestions('2');
  }
  cfsGetChooseTable(item, index, row, column) {
    console.log(item, 'item');
    console.log(index, 'index');
    console.log(row, 'row');
    console.log(column, 'column');
    if (this.typeId == '5') {
      for (let i = 0; i < item.student_answer.length; i++) {
        if (i === row) {
          item.student_answer[i].isSelected = column.toString();
          console.log(item.student_answer[i].isSelected, 'coloumn');
        }
      }
      console.log(item.student_answer, 'add');
    } else if (this.typeId == '7') {
      for (let i = 0; i < item.student_answer.length; i++) {
        let val = '';
        if (item.student_answer[i].isSelected !== '') {
          let value = item.student_answer[i].isSelected.toString();
          let split = value.split(',');
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
            val = item.student_answer[i].isSelected + ',' + column;
          }
        } else {
          val = column.toString();
        }
        if (i === row) {
          item.student_answer[i].isSelected = val.toString();
          console.log(item.student_answer[i].isSelected, 'ewfd');
        }
      }
    }
    this.answer = item.student_answer;
    console.log(this.answer, 'answer');
    this.getViewScratchQuestions('1');
  }
  splitMultiChoose(val, index) {
    let values = val.toString();
    let value = values.split(',');
    for (let i = 0; i < value.length; i++) {
      if (parseInt(value[i]) === parseInt(index)) {
        return true;
      }
    }
  }
getViewScratchQuestions(id) {
    const data = {
      platform: 'web',
      student_id: this.studentId,
      question_id: this.qId,
      content_id: this.cId,
      class_id: this.classId,
      content_format: '3',
      type: id
    };
    if (id == '1'){
      data['student_answer'] = this.answer;
    }
    this.creator.viewScratchQuestions(data).subscribe((successData) => {
        this.viewScratchQuestionsSuccess(successData, id);
      },
      (error) => {
        this.viewScratchQuestionsFailure(error);
      });
}
  viewScratchQuestionsSuccess(successData, id) {
    if (successData.IsSuccess) {
      if (id == '2'){
        this.questionDetails = successData.ResponseObject;
        console.log(this.questionDetails, 'questions');
        if (this.showId == '3') {
          this.totalAns = this.questionDetails;
          setTimeout(() => {
            for (let i = 0; i < this.totalAns.length; i++) {
              for (let j = 0; j < this.totalAns[i].heading_option.length; j++) {
                let index = i;
                let row = this.totalAns[i].heading_option[j].correctActive;
                let column = this.totalAns[i].heading_option[j].correctAnswer;
                let final = index.toString() + row.toString() + column.toString();
                document.getElementById('chooseMultipass' + final).setAttribute('checked', 'true');
              }
            }
          }, 500);
        }
      }
    }
  }
  viewScratchQuestionsFailure(error){}
}
