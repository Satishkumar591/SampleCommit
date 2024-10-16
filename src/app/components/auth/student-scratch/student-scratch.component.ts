import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CreatorService} from '../../../shared/service/creator.service';
import {CommonService} from '../../../shared/service/common.service';
import {StudentService} from '../../../shared/service/student.service';
import {parse, stringify} from 'flatted';
import {TimeSpan} from '../../studentlogin/answering/answering.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {EnvironmentService} from '../../../environment.service';

@Component({
    selector: 'app-student-scratch',
    templateUrl: './student-scratch.component.html',
    styleUrls: ['./student-scratch.component.scss']
})
export class StudentScratchComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

    public studentId = '';
    public schoolId = '';
    public contentId = '';
    public contentFormat = '';
    public classId = '';
    public studentContentId = '';
    public classContentId = '';
    public scratchQuestionData: any;
    public contentName = '';
    public contentType = '';
    public totalFeedBack = '';
    public totalAns = [];
    public timeTaken = 0;
    public showQuestion = 0;
    public percentage = '0';
    public tryAgainButtonEnabled = false;
    public buttonClicked = '';
    public maximumAttempt = 3;
    public correctAnswer = true;
    public checkAutoGradeQns = '0';
    private modalRef: NgbModalRef;
    private modalRef1: NgbModalRef;
    public interval: any;
    private distance = 150;
    public graphBoardValue: any;
    public graphId: any;
    public graphIndex: any;
    public studentContentStatus = '';
    public queriesIndex = '';
    public queries = '';
    public linkdata: any = [];
    public graphEdited = false;
    public needSaveForThisQns = false;
    public selectedIndexForSameQns = 0;

    @ViewChild('submitAlert') submitAlert: TemplateRef<any>;
    // @ViewChild('answerGraph') answerGraph: TemplateRef<any>;
    @ViewChild('content') link: TemplateRef<any>;
    // @ViewChild('workArea') workArea: TemplateRef<any>;
    @ViewChild('scrollContent', {static: false}) scrollContent: ElementRef;
    @ViewChild('rightArrow', {static: false}) rightArrow: ElementRef;
    @ViewChild('leftArrow', {static: false}) leftArrow: ElementRef;

    constructor(public auth: AuthService, public creator: CreatorService, public activateRoute: ActivatedRoute, private formBuilder: FormBuilder,
                public sanitized: DomSanitizer, public confi: ConfigurationService, private modalService: NgbModal,
                public toastr: ToastrService, public student: StudentService, public env: EnvironmentService,
                public cdr: ChangeDetectorRef,
                public router: Router, public common: CommonService) {
        this.activateRoute.params.forEach((params) => {

            console.log(params, 'params');
            localStorage.setItem('Accesstoken', params?.accesstoken);
            this.studentId = params?.student_id;
            this.schoolId = params?.school_id;
            this.contentId = params?.content_id;
            this.contentFormat = params?.content_format;
            this.classId = params?.class_id;
            this.studentContentId = params?.student_content_id;
            this.classContentId = params?.class_content_id;
            this.studentContentStatus = params?.student_content_status;
        });
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.questionList();
    }

    ngAfterContentInit(): void {
    }

    ngOnDestroy(): void {
    }

    async questionList() {
        const data = {
            platform: 'web',
            role_id: '5',
            user_id: this.studentId,
            school_id: this.schoolId,
            content_id: this.contentId,
            content_format: this.contentFormat,
            class_id: this.classId,
            student_content_id: this.studentContentId,
            class_content_id: this.classContentId,
            student_id: this.studentId,
        };
        this.student.questionList(data).subscribe((successData) => {
            this.questionListSuccess(successData);
        }, (error) => {
            console.error(error, 'questionLus');
        });
    }

    questionListSuccess(successData) {
        if (successData.IsSuccess) {

            this.scratchQuestionData = successData.ResponseObject;
            console.log(this.scratchQuestionData, 'questionData');
            this.contentName = this.scratchQuestionData.name;
            this.linkdata = this.scratchQuestionData.links;
            this.contentType = this.scratchQuestionData.content_type == '2' ? 'Assignment' : 'Assessment';
            this.totalFeedBack = this.scratchQuestionData.overall_student_feedback;
            this.totalAns = this.scratchQuestionData.questions;
            this.timeTaken = this.totalAns.length != 0 ? this.totalAns[0]?.question_type_id != '24' ? this.totalAns[0]?.time_taken : this.totalAns[0]?.subQuestions[0]?.time_taken : 0;
            this.percentage = this.scratchQuestionData?.percentage;
            this.checkAutoGradeQns = this.scratchQuestionData.all_autograde == '1' ? this.scratchQuestionData?.auto_review : '0';
            console.log(this.checkAutoGradeQns, 'autogade');
            this.scratchQuestionData.questions.forEach((items) => {
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
                    this.totalAns[i].given_answer[0].isSelected = this.parseVal(this.totalAns[i].given_answer[0].correctAnswer);
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
                if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
                    let particularIndex = 0;
                    if (this.scratchQuestionData.laq_id != 0) {
                        for (let i = 0; i < this.totalAns.length; i++) {
                            const particularObject = this.totalAns[i].question_type_id != '24' ? this.totalAns[i] : this.totalAns[i].subQuestions[0];
                            if (this.scratchQuestionData.laq_id == particularObject.question_id) {
                                particularIndex = i;
                                if (this.serviceNeededOrNotFinalSubmit(this.totalAns[i])) {
                                    this.selectedQuestionList(this.totalAns[i], i, 'questionList');
                                    break;
                                } else {
                                    const checkIndexValue = particularIndex;
                                    this.runLoop(checkIndexValue + 1, checkIndexValue);
                                }
                            }
                        }
                    } else {
                        this.selectedQuestionList(this.totalAns[0], 0, 'questionList');
                    }
                } else {
                    this.selectedQuestionList(this.totalAns[0], 0, 'questionList');
                }
            }
        } else {
            this.toastr.info(successData.ResponseObject.message);
            if (successData.ResponseObject.content_type == '2') {
                this.router.navigate(['/studentlogin/assignment']);
            } else {
                this.router.navigate(['/studentlogin/assessment']);
            }
        }
        // this.clickEvent();

    }

    cfsGetMultiChoice(index, id, item) {
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
        if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
            // this.guard = true;
        }
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
        if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
            // this.guard = true;
        }
    }

    dropdownId(index, id) {
        return index + 'dropdown' + id;
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
        const control = this.totalAns[index].given_answer as any;
        moveItemInArray(control, event.previousIndex, event.currentIndex);
    }

    cfsGetInput(event, index, id, item) {
        if (item.editor_type == 1) {
            item.given_answer[id].isSelected1 = event.target.value;
        } else {
            item.given_answer[id].isSelected1 = event.content;
        }
        if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
            // this.guard = true;
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
        if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
            // this.guard = true;
        }
    }

    cfsGetPassageEssay(event, index, list) {
        if (list.given_answer.length != 0) {
            list.given_answer[0].isSelected = event.content;
        }
    }

    cfsGetHighlight(event, index) {
        this.totalAns[index].given_answer[0].isSelected = event.content;
        if ((this.studentContentStatus == '1' || this.studentContentStatus == '2') && event.content != '') {
            // this.guard = true;
        }
    }

    cfsGetPara(event, index) {
        this.totalAns[index].given_answer[0].isSelected1 = event.content;
        if ((this.studentContentStatus == '1' || this.studentContentStatus == '2') && event.content != '') {
            // this.guard = true;
        }
    }

    cfsGetDropdown(event, index, id, ans, val) {
        this.totalAns[index].given_answer[id].isSelected = ans.toString();
        document.getElementById(index + 'dropdown' + id).innerHTML = val;
        if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
            // this.guard = true;
        }
        // this.clickEvent();
    }

    splitMultiChoose(val, index) {
        const value = val.split(',');
        for (let i = 0; i < value.length; i++) {
            if (parseInt(value[i]) === parseInt(index)) {
                return true;
            }
        }
    }

    tryAgainButton() {
        document.getElementById('yourTarget').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start'
        });
        this.tryAgainButtonEnabled = true;
        this.startTimer();
    }

    otherlink() {
        this.modalRef = this.modalService.open(this.link);
    }

    backbutton() {
        // if (this.contentType == 'Assessment') {
        //     this.route.navigate(['/studentlogin/assessment']);
        // } else {
        //     this.route.navigate(['/studentlogin/assignment']);
        // }
    }

    checkDisableConditionForQns(item) {
        const particularObjectValue = item.question_type_id != '24' ? item : item.subQuestions[0];
        return (this.studentContentStatus != '1' && this.studentContentStatus != '2')
            || particularObjectValue.is_correct == 'false' || particularObjectValue.is_correct == 'true' || (particularObjectValue.is_correct == 'partially-completed' && !this.tryAgainButtonEnabled);
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

    getWorkSpaceValue(event, i) {
        if (event.content != '') {
            this.totalAns[i].student_roughdata = event.content;
        }
        if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
            // this.guard = true;
        }
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
        const studentAnswer = this.totalAns[i].question_id;
        const data = {
            platform: 'web',
            role_id: '5',
            user_id: this.studentId,
            school_id: this.schoolId,
            content_id: this.contentId,
            content_format: this.contentFormat,
            class_id: this.classId,
            student_id: this.studentId,
            answer_id: studentAnswer,
            suggestion_query: this.queries
        };
        this.student.submitQuery(data).subscribe((successData) => {
            this.submitQuerySuccess(successData, i, j);
        }, (error) => {
            console.error(error, 'submit_query');
        });
    }

    submitQuerySuccess(successData, id, index) {
        if (successData.IsSuccess) {
            console.log(this.totalAns[id], 'dsadas');
            this.totalAns[id].student_feedback = this.queries;
            this.queriesIndex = '';
            this.queries = '';
            this.toastr.success(successData.ResponseObject);
        }
    }

    checkQuestionId(item) {
        return item.question_type_id != '24' ? item : item.subQuestions[0];
    }

    numOfQuestionAnswered() {
        let questionAnswered = 0;
        if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
            this.totalAns.forEach((items) => {
                if (items.question_type_id != '24') {
                    if (items.is_correct == 'true' || items.is_correct == 'false') {
                        questionAnswered++;
                    }
                } else {
                    items.subQuestions.forEach((passageItems) => {
                        if (passageItems.is_correct == 'true' || passageItems.is_correct == 'false') {
                            questionAnswered++;
                        }
                    });
                }
            });
        } else {
            questionAnswered = this.totalAns.length;
        }
        return questionAnswered;
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


    serviceNeededOrNot(data) {
        const particularObjectValue = data.question_type_id != '24' ? data : data.subQuestions[0];
        return (particularObjectValue.is_correct == '' ||
            // tslint:disable-next-line:max-line-length
            (particularObjectValue.is_correct == 'partially-completed' && (particularObjectValue.no_of_attempt < this.maximumAttempt) && this.tryAgainButtonEnabled));
    }

    serviceNeededOrNotFinalSubmit(data) {
        const particularObjectValue = data.question_type_id != '24' ? data : data.subQuestions[0];
        return (particularObjectValue.is_correct == '' || particularObjectValue.is_correct == 'partially-completed');
    }

    checkCorrectAnswerOrNot(data, questionNeedToCheck) {

        console.log(data, 'data');
        let correctAnswer: any;

        if (['1', '2'].indexOf(data.question_type_id) > -1) {
            correctAnswer = data.answer.every((items, index) => {
                return !(items.correctActive == '1' && data.given_answer[index].isSelected == '');
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
                        question: item.options,
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
            role_id: '5',
            user_id: this.studentId,
            student_content_id: this.studentContentId,
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
                    console.log(checkAllQnsCorrectedOrNot, 'checkAllQnsCorrectedOrNot');
                    checkAllQnsCorrectedOrNot ? this.submitPopup() : this.saveAnswerForFewType(this.showQuestion, 'nextWithAutoGrade');
                }, 0);
            } else {
                this.saveAnswerForFewType(this.showQuestion, 'nextWithAutoGrade');
            }
        } else if (this.checkAutoGradeQns == '0' || this.checkAutoGradeQns == '1') {
            await this.updateForNonAutoGradedQns(particularObjectValue);
        } else {
            if (lastQuestion) {
                this.totalAns.every((items, index) => {
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

    submitPopup() {
        this.modalRef = this.modalService.open(this.submitAlert);
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
                        if (items.isSelected1.trim() != '') {
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

        // console.log(lastQuestion, 'lastQuestion');

        if (this.checkAutoGradeQns == '2' && this.serviceNeededOrNot(this.totalAns[this.showQuestion])) {
            document.getElementById('yourTarget').scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start'
            });
            this.saveAnswer('2', 'noExit', true, 'next');
        } else {
            const questionNumber = this.showQuestion;
            console.log(this.showQuestion, 'second');
            if (this.totalAns[questionNumber + 1]) {
                if (this.totalAns[questionNumber]?.question_type_id == 10 || this.totalAns[questionNumber].question_type_id == '20' ||
                    this.totalAns[questionNumber].question_type_id == '40' || this.totalAns[questionNumber].question_type_id == '41' ||
                    (this.totalAns[questionNumber].question_type_id == '24' && this.totalAns[questionNumber].subQuestions[0]?.question_type_id == '10')) {
                    this.saveAnswerForFewType(questionNumber);
                    console.log(this.totalAns[questionNumber], 'this.totalAns[questionNumber]');
                } else {
                    this.selectedQuestionList(this.totalAns[questionNumber + 1], questionNumber + 1);
                }
            } else {
                let checkWhetherOtherQuestionCorrectedOrNot = true;
                let particularIndex = 0;
                this.totalAns.every((items, index) => {
                    particularIndex = index;
                    const particularObjectValue = items.question_type_id != '24' ? items : items.subQuestions[0];
                    if (particularObjectValue.is_correct == '' || items.is_correct == 'partially-completed') {
                        checkWhetherOtherQuestionCorrectedOrNot = false;
                        return false;
                    }
                    return true;
                });

                if (!checkWhetherOtherQuestionCorrectedOrNot) {
                    this.selectedQuestionList(this.totalAns[particularIndex], particularIndex);
                } else {
                    // this.guard = false;
                    // this.route.navigate(['/studentlogin/' + this.contentType.toLowerCase()]);
                }
            }
        }
    }

    saveGraph(event, val, id) {
        this.graphBoardValue = event;
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
            platform: 'ios',
            role_id: '5',
            user_id: this.studentId,
            school_id: this.schoolId,
            content_id: this.contentId,
            content_format: this.contentFormat,
            class_id: this.classId,
            student_id: this.studentId,
            question_id: id.question_id,
            student_content_id: this.studentContentId,
            answer: [{correctAnswer: stringify(graph), correctActive: ''}],
            editor_answer: val,
            type: '1'
        };
        this.creator.graphAnswer(data).subscribe((successData) => {
                this.saveGraphSuccess(successData, '2');
            },
            (error) => {
                this.saveGraphFailure(error);
            });
    }

    saveGraphSuccess(successData, id, data?, JSONObject?) {
        if (id == '1') {
            this.closeGraph(this.graphId, this.graphIndex);
        }
        if (data) {
            data.given_answer = JSONObject.answer;
            this.graphEdited = false;
            console.log(this.graphEdited, 'graphEdited');
        }
    }

    saveGraphFailure(error) {
        console.log(error);
    }

    closeGraph(id, index) {
        this.totalAns[id].section[index].student_roughdata = this.totalAns[id].section[index].student_roughdata1;
        this.modalRef1.close();
    }


    async saveAnswer(id, route, loader, questionMove?) {

        for (let i = 0; i < this.totalAns.length; i++) {
            {
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
                }
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
        const data = {
            platform: 'web',
            role_id: '5',
            user_id: this.studentId,
            student_id: this.studentId,
            content_id: this.contentId,
            content_format: this.contentFormat,
            student_content_id: this.studentContentId,
            class_id: this.classId,
            overall_student_feedback: this.totalFeedBack,
            questions: this.totalAns,
            all_autograde: this.scratchQuestionData.all_autograde,
            laq_id: this.totalAns[this.showQuestion]?.question_type_id != '24' ?
                this.totalAns[this.showQuestion]?.question_id : this.totalAns[this.showQuestion]?.subQuestions[0]?.question_id,
            status: id == '4' ? '4' : !checkAllQuestionCorrectedOrNot ? '4' : id,
        };
        if (loader) {
            await this.student.submitAnswer(data).subscribe((successData) => {
                    this.submitAnswerSuccess(successData, data, route, loader, questionMove);
                },
                (error) => {
                    // this.commondata.showLoader(false);
                    this.submitAnswerFailure(error);
                });
        }

    }

    submitAnswerSuccess(successData, data, route, loader, questionMove) {
        if (successData.IsSuccess) {
            if (data.status != '4') {
                this.studentAnswerDetails(questionMove);
            }

            if (data.status == '4') {
                this.close();
                this.toastr.success(this.contentType + ' ' + 'Submitted');
            } else if (loader == true) {
                this.toastr.success(this.contentType + ' ' + 'Saved');
            }
            if (route == 'exit') {
                const formURLForExit = this.env.webhost + '/' + '#' + '/student-scratch/' + this.auth.getAccessToken() + '/' + this.studentId
                    + '/' + this.schoolId + '/' + this.contentId + '/' + this.contentFormat + '/' + this.classId + '/' + this.studentContentId + '/' + this.classContentId + '/' + this.studentContentStatus + '/' + 'list';
                console.log(formURLForExit, 'url');
                window.location.href = formURLForExit;
                // this.existScratchPage();
                // this.guard = false;
                // this.route.navigate(['/studentlogin/' + this.contentType.toLowerCase()]);
            }
        }
    }

    submitAnswerFailure(error) {
        console.log(error);
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

    selectedQuestionList(data, index, calledFrom?) {
        console.log(data, 'datas');
        this.pauseTimer();
        this.timeTaken = 0;
        this.correctAnswer = true;
        this.tryAgainButtonEnabled = false;
        this.showQuestion = index;
        const particularObjectValue = data.question_type_id != '24' ? data : data.subQuestions[0];
        if (this.studentContentStatus == '1' || this.studentContentStatus == '2') {
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
            document.getElementById('yourTarget').scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start'
            });
        }
        console.log(this.showQuestion, 'showQuestion');
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

    cfsgetGraphValue(event, index) {
        this.totalAns[index].given_answer[0].isSelected = event;
        this.graphEdited = true;
    }

    cfsGetGraghEditor(event, index) {
        this.totalAns[index].editor_key = event.content;
    }

    public onScroll(): void {
        const left = this.scrollContent.nativeElement.scrollLeft;
        const sWidth = this.scrollContent.nativeElement.scrollWidth;
        const oWidth = this.scrollContent.nativeElement.offsetWidth;
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
        const operators = {
            '+': (a, b) => {
                return a + b;
            },
            '-': (a, b) => {
                return a - b;
            },
        };
        const op = operators[operator];
        console.log(this.scrollContent, 'content');
        // this.scrollContent = document.getElementById('scrollContent');
        this.scrollContent.nativeElement.scrollTo(
            {
                left: op(this.scrollContent.nativeElement.scrollLeft, distance),
                behavior: 'smooth'
            });
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

    close() {
        this.modalRef?.close();
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



