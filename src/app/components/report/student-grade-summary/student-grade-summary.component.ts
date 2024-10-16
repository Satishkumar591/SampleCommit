import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {TitleCasePipe} from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from 'ng-apexcharts';
import {ReportService} from '../../../shared/service/report.service';
import {AuthService} from '../../../shared/service/auth.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-student-grade-summary',
  templateUrl: './student-grade-summary.component.html',
  styleUrls: ['./student-grade-summary.component.scss']
})
export class StudentGradeSummaryComponent implements OnInit {
  public studentForm: FormGroup;
  public classDetails: any;
  public assessmentShow = false;
  public assessmentReportShow = false;
  public assessmentDetails: any;
  public studentDetails: any;
  public studentGradeDetails: any;
  public message: any = 'Please Select one Class List.';
  // public selectTab: any;
  public listData: any;
  public chartOptions: any;
  public csv: any;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  constructor(public commondata: CommonDataService, public firstcaps: TitleCasePipe, private formBuilder: FormBuilder, public report: ReportService, public auth: AuthService, public toastr: ToastrService) {
    // this.selectTab = 'student';
    this.studentForm = this.formBuilder.group({
      class: null,
      student: '',
      assessment: ''
    });
  }
  public settings = {
    hideSubHeader: false,
    actions: false,
    columns: {
      student_name: {
        title: 'Student Name',
      },
      student_average_score: {
        title: 'Avg. Student Score(%)',
      },
      assigned: {
        title: 'Assigned',
      },
      graded: {
        title: 'Graded'
      },
      absent: {
        title: 'Absent'
      },
      min_score: {
        title: 'Min. Score'
      },
      max_score: {
        title: 'Max. Score'
      },
      average_score: {
        title: 'Avg. Score'
      }
    }
  };
  ngOnInit() {
    this.classReport();
  }
  // selectTabFunction(type){
  //   this.selectTab = type;
  // }
  viewDetail(event) {}
  classReport() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id')
    };
    this.report.classReport(data).subscribe( (successData) => {
          this.classReportSuccess(successData);
        },
        (error) => {
          this.classReportFailure(error);
        });
  }

  classReportSuccess(successData) {
    if (successData.IsSuccess) {
      this.classDetails = successData.ResponseObject;
    }
  }
  classReportFailure(error) {
  }
  assessmentReport() {
    if (this.studentForm.get('class').value != null) {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        class_id: this.studentForm.get('class').value
      };
      this.report.assessmentReport(data).subscribe( (successData) => {
            this.assessmentReportSuccess(successData);
          },
          (error) => {
            this.assessmentReportFailure(error);
          });
    }else{
      this.message = 'Class Id should not be empty';
      this.assessmentShow = false;
      this.assessmentReportShow = false;
    }
  }
  assessmentReportSuccess(successData) {
    if (successData.IsSuccess) {
      this.assessmentDetails = successData.ResponseObject;
      const selected = this.assessmentDetails.map(item => item.content_id);
      const value = this.studentForm.get('assessment').patchValue(selected);
      this.studentReport();
    }
  }
  assessmentReportFailure(error) {
  }
  studentReport() {
    if (this.studentForm.get('class').value != null) {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        class_id: this.studentForm.get('class').value
      };
      this.report.studentDetailReport(data).subscribe( (successData) => {
            this.studentReportSuccess(successData);
          },
          (error) => {
            this.studentReportFailure(error);
          });
    }else{
      this.message = 'Class Id should not be empty';
      this.assessmentShow = false;
      this.assessmentReportShow = false;
    }}

  studentReportSuccess(successData) {
    if (successData.IsSuccess) {
      this.studentDetails = successData.ResponseObject;
      const selected = this.studentDetails.map(item => item.student_id);
      const value = this.studentForm.get('student').patchValue(selected);
      this.assessmentShow = true;
      this.studentGradeReport();
    }
  }
  studentReportFailure(error) {
  }
  studentGradeReport() {
    if (this.studentForm.get('student').value != ''){
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        class_id: this.studentForm.get('class').value,
        content_id: this.studentForm.get('assessment').value,
        student_id: this.studentForm.get('student').value
      };
      this.report.studentGradeSummaryReport(data).subscribe( (successData) => {
            this.studentGradeReportSuccess(successData);
          },
          (error) => {
            this.studentGradeReportFailure(error);
          });
    }else {
      this.message = 'Please check your student list is empty';
      this.assessmentReportShow = false;
    }
  }

  studentGradeReportSuccess(successData) {
    if (successData.IsSuccess) {

      this.chartOptions = {
        series: [
          {
            name: "Master(90% and above)",
            data: []
          },
          {
            name: "Excellent(80% - 89.99%)",
            data: []
          },
          {
            name: "Proficient(70% - 79.99%)",
            data: []
          },
          {
            name: "Average(50% - 69.99%)",
            data: []
          },
          {
            name: "Below Average(less than 50%)",
            data: []
          }
        ],
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          type: "category",
          categories: []
        },
        legend: {
          position: "right",
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      };

      if (successData.ResponseObject != 'No Records found') {
        const details = successData.ResponseObject;
        this.studentGradeDetails = details.chart;
        this.listData = details.studentList;
        this.assessmentReportShow = true;
        const categoriesList = [];
        for (let i = 0; i < this.studentGradeDetails.length; i++){
          let datalist = this.studentGradeDetails[i].data;
          let dataBelow = datalist.filter(function (val) {
            return Number(val) <= 50;
          });
          let dataAverage   = datalist.filter(function (val) {
            return Number(val) >= 50 && Number(val) <= 70;
          });
          let dataProficient  = datalist.filter(function (val) {
            return Number(val) >= 70 && Number(val) <= 80;
          });
          let dataExcellent = datalist.filter(function (val) {
            return Number(val) >= 80 && Number(val) <= 90;
          });
          let dataMaster = datalist.filter(function (val) {
            return Number(val) >= 90;
          });
          this.chartOptions.xaxis.categories.push(this.studentGradeDetails[i].name == null ? '' : this.studentGradeDetails[i].name);
          dataMaster.forEach(val => {
            this.chartOptions.series[0]['data'].push(val + '%');
          });
          dataExcellent.forEach(val => {
            this.chartOptions.series[1]['data'].push(val + '%');
          });
          dataProficient.forEach(val => {
            this.chartOptions.series[2]['data'].push(val + '%');
          });
          dataAverage.forEach(val => {
            this.chartOptions.series[3]['data'].push(val + '%');
          });
          dataBelow.forEach(val => {
            this.chartOptions.series[4]['data'].push(val + '%');
          });
        }
      } else {
        this.assessmentReportShow = false;
        this.message = 'No Records found';
      }
    }
  }
  studentGradeReportFailure(error) {
  }
  downloadExcelData(){
    // let fileName = `EnergyData_${this.downloadDate}.csv`;
    // let fileName = `transaction_${this.form.controls.fromDate.value}-${this.form.controls.toDate.value}.csv`;
    let requiredColumnNames = [
        'Student Name',
        'Avg. Student Score(%)',
        'Assigned',
        'Graded',
        'Absent',
        'Min. Score',
        'Max. Score',
        'Avg. Score'
    ];
    let columnNames = requiredColumnNames;
    let header = columnNames.join(',');
    this.csv = header;
    this.csv += '\r\n';
    for (let i = 0; i < this.listData.length; i++) {
      this.csv += [
        this.listData[i].student_name,
        this.listData[i].average_student_score,
        this.listData[i].assigned,
        this.listData[i].graded,
        this.listData[i].absent,
        this.listData[i].min_score,
        this.listData[i].max_score,
        this.listData[i].average_score,
      ].join(',');
      this.csv += '\r\n';
    }

    var blob = new Blob([this.csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');

    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student-grade-summary-Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  assessmentPrint(): void {
    let printContents, popupWin;
    printContents = document.getElementById('assessmentPrint').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
                <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          <style>
          @media print {    
          body{
          font-family: 'Roboto', sans-serif;
          }
          .card-body{
          display: none;
          }
          .form-group {
           display: none;
          }
          .group-btn {
           display: none;
          }
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
