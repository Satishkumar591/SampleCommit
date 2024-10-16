import { Routes } from '@angular/router';

export const content: Routes = [
   {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: {
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: 'School',
    loadChildren: () => import('../../components/School/School.module').then(m => m.SchoolModule),
    data: {
      breadcrumb: 'Institution'
    }
  },
  {
    path: 'users',
    loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule),
    data: {
      breadcrumb: 'Users'
    }
  },
  {
    path: 'Content-Creator',
    loadChildren: () => import('../../components/Content-Creator/Content.module').then(m => m.ContentModule),
    data: {
      breadcrumb: 'Content-Creator'
    }
  },
  {
    path: 'home',
    loadChildren: () => import('../../components/home/home.module').then(m => m.HomeModule),
    data: {
      breadcrumb: 'Home'
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('../../components/admin/admin.module').then(m => m.AdminModule),
    data: {
      breadcrumb: 'Admin'
    }
  },
  {
    path: 'classes',
    loadChildren: () => import('../../components/classes/classes.module').then(m => m.ClassesModule),
    data: {
      breadcrumb: 'Classes'
    }
  },
  {
    path: 'assessment-correction',
    loadChildren: () => import('../../components/correction/correction.module').then(m => m.AssessmentCorrectionModule),
    data: {
      breadcrumb: 'Correction'
    }
  },
  {
    path: 'assignment-correction',
    loadChildren: () => import('../../components/assignment-correction/correction.module').then(m => m.AssignmentCorrectionModule),
    data: {
      breadcrumb: 'Correction'
    }
  },
  {
    path: 'Teacher',
    loadChildren: () => import('../../components/Teacher/Teacher.module').then(m => m.TeacherModule),
    data: {
      breadcrumb: 'Teacher'
    }
  },
  {
    path: 'student',
    loadChildren: () => import('../../components/student/student.module').then(m => m.StudentModule),
    data: {
      breadcrumb: 'student'
    }
  },
  {
    path: 'class',
    loadChildren: () => import('../../components/class/class.module').then(m => m.ClassModule),
    data: {
      breadcrumb: 'class'
    }
  },
  {
    path: 'Books',
    loadChildren: () => import('../../components/Books/Books.module').then(m => m.BooksModule),
    data: {
      breadcrumb: 'Books'
    }
  },
  {
    path: 'grade',
    loadChildren: () => import('../../components/grade/grade.module').then(m => m.GradeModule),
    data: {
      breadcrumb: 'Grade'
    }
  },
  {
    path: 'subject',
    loadChildren: () => import('../../components/subject/subject.module').then(m => m.SubjectModule),
    data: {
      breadcrumb: 'Subject'
    }
  },
  {
    path: 'classroom',
    loadChildren: () => import('../../components/classroom/classroom.module').then(m => m.ClassroomModule),
    data: {
      breadcrumb: 'Content Folder'
    }
  },
  {
    path: 'repository',
    loadChildren: () => import('../../components/repository/repositery.module').then(m => m.ContentModule),
    data: {
      breadcrumb: 'Content Library'
    }
  },
  {
    path: 'content-text-resource',
    loadChildren: () => import('../../components/content-text-resource/content-text-resource.module').then(m => m.ContentTextResourceModule),
    data: {
      breadcrumb: 'Content Text Resource'
    }
  },
  {
    path: 'settings',
    loadChildren: () => import('../../components/setting/setting.module').then(m => m.SettingModule),
    data: {
      breadcrumb: 'Settings'
    }
  },
  {
    path: 'leaves',
    loadChildren: () => import('../../components/leaves/leaves.module').then(m => m.LeavesModule),
    data: {
      breadcrumb: 'Holidays'
    }
  },
  {
    path: 'report',
    loadChildren: () => import('../../components/report/report.module').then(m => m.ReportModule),
    data: {
      breadcrumb: 'Report Card'
    }
  },
  {
    path: 'handwriting',
    loadChildren: () => import('../../components/handwriting/handwriting.module').then(m => m.HandwritingModule),
    data: {
      breadcrumb: ''
    }
  },
  {
    path: 'schedule',
    loadChildren: () => import('../../components/schedule/schedule.module').then(m => m.ScheduleModule),
    data: {
      breadcrumb: ''
    }
  },
  {
    path: 'studentlogin',
    loadChildren: () => import('../../components/studentlogin/studentlogin.module').then(m => m.StudentloginModule),
    data: {
      breadcrumb: 'Student'
    }
  },
  {
    path: 'student-content',
    loadChildren: () => import('../../components/student-content/student-content.module').then(m => m.StudentContentModule),
    data: {
      breadcrumb: 'Student-Work'
    }
  },
  {
    path: 'settings',
    loadChildren: () => import('../../components/settingsList/settingList.module').then(m => m.SettingListModule),
    data: {
      breadcrumb: 'Settings'
    }
  },
  {
    path: 'request-corporate',
    loadChildren: () => import('../../components/request-corporate/request-corporate.module').then(m => m.RequestCorporateModule),
    data: {
      breadcrumb: 'Request Corporate'
    }
  },
  {
    path: 'mailbox',
    loadChildren: () => import('../../components/mailbox/mailbox.module').then(m => m.MailboxModule),
    data: {
      breadcrumb: 'Mailbox'
    }
  },
  {
    path: 'grader',
    loadChildren: () => import('../../components/grader/grader.module').then(m => m.GraderModule),
    data: {
      breadcrumb: 'Student Work'
    }
  },
  {
    path: 'score',
    loadChildren: () => import('../../components/score-detection/score-detection.module').then(m => m.ScoreDetectionModule),
    data: {
      breadcrumb: 'Score Details'
    }
  },
];
