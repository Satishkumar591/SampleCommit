import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AssessmentSummaryComponent} from './assessment-summary/assessment-summary.component';
import {StudentGradeSummaryComponent} from './student-grade-summary/student-grade-summary.component';
import {GradeReportComponent} from './grade-report/grade-report.component';
import {MissedWorkReportComponent} from './missed-work-report/missed-work-report.component';
import {StudentPerformanceReportComponent} from './student-performance-report/student-performance-report.component';
import {ItemsReportComponent} from './items-report/items-report.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'assessment-summary',
                component: AssessmentSummaryComponent,
                data: {
                    title: 'Reports / Assessment Summary',
                    breadcrumb: 'Assessment Summary'
                }
            },
            {
                path: 'student-grade-summary',
                component: StudentGradeSummaryComponent,
                data: {
                    title: 'Reports / Student Grade Summary',
                    breadcrumb: 'Student Grade Summary'
                }
            },
            {
                path: 'grade-report',
                component: GradeReportComponent,
                data: {
                    title: 'Reports / Grade Report',
                    breadcrumb: 'Grade Report'
                }
            },
            {
                path: 'missed-work-report',
                component: MissedWorkReportComponent,
                data: {
                    title: 'Reports / Student Work Report',
                    breadcrumb: 'Student Work Report'
                }
            },
            {
                path: 'student-performance-report',
                component: StudentPerformanceReportComponent,
                data: {
                    title: 'Reports / Student Performance Report',
                    breadcrumb: 'Student Performance Report'
                }
            },
            {
                path: 'items-report',
                component: ItemsReportComponent,
                data: {
                    title: 'Reports / Items Report',
                    breadcrumb: 'Items Report'
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule {
}
