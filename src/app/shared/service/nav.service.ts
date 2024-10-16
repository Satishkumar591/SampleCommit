import {Injectable, HostListener, Inject} from '@angular/core';
import {BehaviorSubject, Observable, Subscriber} from 'rxjs';
import {WINDOW} from './windows.service';
import {AuthService} from './auth.service';
import {LoginService} from './login.service';
import {CommonService} from './common.service';
import {NewsubjectService} from './newsubject.service';

// Menu
export interface Menu {
    path?: string;
    title?: string;
    icon?: string;
    imgePath?: string;
    type?: string;
    badgeType?: string;
    badgeValue?: string;
    active?: boolean;
    bookmark?: boolean;
    children?: Menu[];
}

@Injectable({
    providedIn: 'root'
})

export class NavService {
    public roleId: any;
    public permission: any;
    public screenWidth: any;
    public items: any;
    public AllMENUITEMS: any;
    public MENUITEMS: Menu[];
    public collapseSidebar: boolean = false;
    public allowNav: any;
    public permissionList: any;

    constructor(@Inject(WINDOW) private window, public auth: AuthService, public login: LoginService, public newSubject: NewsubjectService,
                public common: CommonService) {

        // this.roleId = this.auth.getRoleId();
        this.login.homeList.subscribe((res: any) => {
            if (res != '') {
                this.roleId = res;
            }
            if (res == '') {
                this.roleId = this.auth.getRoleId();
            }
            if (this.roleId == '2' || this.roleId == 2) {
                this.roleId = '2';
                if (this.roleId === '2') {
                    this.newSubject.navUpdate.subscribe((params) => {
                        this.permissionList = JSON.parse(this.auth.getSessionData('rista_data1'));
                        console.log(this.permissionList, 'this.permissionList');
                        this.AllMENUITEMS = {
                            path: '/dashboard/default',
                            title: 'Dashboard',
                            icon: 'grid',
                            imgePath: 'assets/images/mob-side-icon/home.png',
                            type: 'link',
                            badgeType: 'primary',
                            active: false
                        };

                        this.MENUITEMS = [
                            // {
                            // 	path: '/dashboard/default', title: 'Dashboard', icon: 'grid', imgePath: 'assets/images/mob-side-icon/home.png', type: 'link', badgeType: 'primary', active: false
                            // },
                            // {
                            // 	path: '/home/list-home', title: 'Home', icon: 'home', imgePath: 'assets/images/mob-side-icon/home.png', type: 'link', badgeType: 'primary', active: false
                            // },
                            {
                                path: '/schedule/schedule-page/',
                                title: 'Schedule',
                                icon: 'home',
                                imgePath: 'assets/images/mob-side-icon/holiday.png',
                                type: 'link',
                                active: false
                            },
                            {
                                title: 'Class',
                                icon: 'book',
                                imgePath: 'assets/images/mob-side-icon/classess.png',
                                path: '/class/list-class',
                                type: 'link',
                                active: false
                            },
                            // {
                            // 	title: 'Students', icon: 'smile', imgePath: 'assets/images/mob-side-icon/student.png', path: '/student/list-student', type: 'link', active: false
                            // },
                            // {
                            // 	title: 'Teachers', icon: 'users', imgePath: 'assets/images/mob-side-icon/teacher.png', path: '/Teacher/list-Teacher', type: 'link', active: false
                            // },
                            // {
                            // 	title: 'Content-Creator', icon: 'user-plus', imgePath: 'assets/images/mob-side-icon/student.png', path: '/Content-Creator/list-Content', type: 'link', active: false
                            // },
                            {
                                title: 'Content Library',
                                icon: 'book-open',
                                imgePath: 'assets/images/mob-side-icon/content-repository.png',
                                path: '/repository/content-home',
                                type: 'link',
                                active: false
                            },
                            // {
                            //     title: 'Passage',
                            //     icon: 'book-open',
                            //     imgePath: 'assets/images/mob-side-icon/content-repository.png',
                            //     path: '/content-text-resource/passage',
                            //     type: 'link',
                            //     active: false
                            // },
                            {
                                title: 'Users',
                                icon: 'users',
                                imgePath: 'assets/images/mob-side-icon/content-repository.png',
                                path: '/users/user-list',
                                type: 'link',
                                active: false
                            },
                            // {
                            //     title: 'score Detection',
                            //     icon: 'users',
                            //     imgePath: 'assets/images/mob-side-icon/content-repository.png',
                            //     path: '/score/score-detection',
                            //     type: 'link',
                            //     active: false
                            // },
                            // {
                            // 	title: 'Content Folder', icon: 'folder-plus', imgePath: 'assets/images/mob-side-icon/classroom.png', path: '/classroom/list-classroom', type: 'link', active: false
                            // },
                            // {
                            // 	title: 'Inbox', icon: 'mail', imgePath: 'assets/images/mob-side-icon/classess.png', path: '/mailbox/inbox', type: 'link', active: false,
                            // },
                            // {
                            // title: 'Class', icon: 'book', type: 'sub', active: false, children: [
                            // {
                            // 	title: 'Classes', icon: 'book', imgePath: 'assets/images/mob-side-icon/classess.png', path: '/class/list-class', type: 'link', active: false
                            // },
                            // {
                            // 	path: '/schedule/schedule-page/', title: 'Schedule', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/holiday.png', type: 'link', active: false
                            // },
                            // {
                            // 	path: '/schedule/daily-schedule/', title: 'Daily Schedule', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/holiday.png', type: 'link', active: false
                            // },
                            // {
                            // 	path: '/student/upgrade', title: 'Upgrade', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/assignment-correction.png', type: 'link',  active: false
                            // }
                            // ]
                            // },
                            // {
                            // 	title: 'Curriculum', icon: 'archive', type: 'sub', active: false, children: [
                            // {
                            // 	title: 'Books', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/books.png', path: '/Books/list-Books', type: 'link', active: false
                            // },
                            // {
                            // 	title: 'Content Folder', icon: 'folder-plus', imgePath: 'assets/images/mob-side-icon/classroom.png', path: '/classroom/list-classroom', type: 'link', active: false
                            // },
                            // {
                            // 	title: 'Content Library', icon: 'book-open', imgePath: 'assets/images/mob-side-icon/content-repository.png', path: '/repository/content-home', type: 'link', active: false
                            // },
                            // ]
                            // },
                            {
                                title: 'Grading', icon: 'shield', type: 'sub', active: false, children: [
                                    {
                                        path: '/student-content/list-content/new',
                                        title: 'Student-Work',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/assignment-correction.png',
                                        type: 'link',
                                        active: false
                                    },
                                    {
                                        path: '/assessment-correction/list-correction',
                                        title: 'Assessment-Correction',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/assessment-correction.png',
                                        type: 'link',
                                        active: false
                                    },
                                    {
                                        path: '/assignment-correction/list-correction',
                                        title: 'Assignment-Correction',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/assignment-correction.png',
                                        type: 'link',
                                        active: false
                                    }
                                ]
                            },
                            // {
                            // 	title: 'Users', icon: 'users', type: 'sub', active: false, children: [
                            // 		{
                            // 			title: 'Student', icon: 'smile', imgePath: 'assets/images/mob-side-icon/student.png', path: '/student/list-student', type: 'link', active: false
                            // 		},
                            // 		{
                            // 			title: 'Teacher', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/teacher.png', path: '/Teacher/list-Teacher', type: 'link', active: false
                            // 		},
                            // 		{
                            // 			title: 'Content-Creator', icon: 'user-plus', imgePath: 'assets/images/mob-side-icon/student.png', path: '/Content-Creator/list-Content', type: 'link', active: false
                            // 		},
                            // 	]
                            // },
                            // {
                            // 	title: 'Static Data', icon: 'bar-chart-2', type: 'sub', active: false, children: [
                            // 		{
                            // 			title: 'Grade', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/student.png', path: '/grade/list-grade', type: 'link', active: false
                            // 		},
                            // 		{
                            // 			title: 'Subject', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/subject.png', path: '/subject/list-subject', type: 'link', active: false
                            // 		},
                            // 		{
                            // 			title: 'Holidays', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/holiday.png', path: '/leaves/add-holiday', type: 'link', active: false
                            // 		}
                            // 	]
                            // },
                            {
                                title: 'Reports', icon: 'pie-chart', type: 'sub', active: false, children: [
                                    {
                                        title: 'Class Report',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/class-report.png',
                                        path: '/report/assessment-summary',
                                        type: 'link',
                                        active: false
                                    },
                                    {
                                        title: 'Grade Report',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/student-report.png',
                                        path: '/report/grade-report',
                                        type: 'link',
                                        active: false
                                    },
                                    // {
                                    // 	title: 'Student Performance Report', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/classReport.png', path: '/report/student-performance-report', type: 'link', active: false
                                    // },
                                    // {
                                    // 	title: 'Student Report', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/studentReport.png', path: '/report/student-grade-summary', type: 'link', active: false
                                    // }
                                ],
                            },
                            {
                                title: 'Settings', icon: 'settings', type: 'sub', active: false, children: [
                                    {
                                        title: 'General',
                                        icon: 'settings',
                                        imgePath: 'assets/images/mob-side-icon/classess.png',
                                        path: '/settings/list-Settings',
                                        type: 'link',
                                        active: false,
                                    },
                                    {
                                        title: 'Grade',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/student.png',
                                        path: '/grade/list-grade',
                                        type: 'link',
                                        active: false
                                    },
                                    {
                                        title: 'Subject',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/subject.png',
                                        path: '/subject/list-subject',
                                        type: 'link',
                                        active: false
                                    },
                                    {
                                        title: 'Holidays',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/holiday.png',
                                        path: '/leaves/add-holiday',
                                        type: 'link',
                                        active: false
                                    }
                                ]
                            },
                            // {
                            //     title: 'Download Approval', icon: 'user-check', imgePath: 'assets/images/mob-side-icon/classess.png', path: '/request-corporate/download-request', type: 'link', active: false,
                            // },
                            // {
                            // 	title: 'Corporate Access', icon: 'gitlab', imgePath: 'assets/images/mob-side-icon/classess.png', path: '/request-corporate/request', type: 'link', active: false,
                            // },
                        ];
                        if (this.permissionList.allow_dashboard == '1') {
                            this.MENUITEMS.unshift(this.AllMENUITEMS);
                        }
                        this.items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
                    });

                    // if(this)
                }
            } else if (this.roleId == 4 || this.roleId == '4') {
                this.roleId = '4';
                this.newSubject.navUpdate.subscribe((params) => {
                    this.permissionList = JSON.parse(this.auth.getSessionData('rista_data1'));
                    if (this.roleId === '4') {
                        // this.AllMENUITEMS = [
                        // 	{
                        // 		path: '/repository/content-home',
                        // 		title: 'Content Library',
                        // 		icon: 'book-open',
                        // 		imgePath: 'assets/images/mob-side-icon/content-repository.png',
                        // 		type: 'link',
                        // 		active: false
                        // 	},
                        // 	{
                        // 		path: '/Books/list-Books', title: 'Books', icon: 'book', imgePath: 'assets/images/mob-side-icon/books.png', type: 'link', active: false
                        // 	},
                        // 	{
                        // 		path: '/Content-Creator/list-Content',
                        // 		title: 'Content-Creator',
                        // 		icon: 'user-plus',
                        // 		imgePath: 'assets/images/mob-side-icon/student.png',
                        // 		type: 'link',
                        // 		active: false
                        // 	},
                        // 	{
                        // 		path: '/student/list-student',
                        // 		title: 'Student',
                        // 		icon: 'smile',
                        // 		imgePath: 'assets/images/mob-side-icon/student.png',
                        // 		type: 'link',
                        // 		active: false
                        // 	},
                        // 	{
                        // 		title: 'Content Folder',
                        // 		icon: 'folder-plus',
                        // 		path: '/classroom/list-classroom',
                        // 		imgePath: 'assets/images/mob-side-icon/classroom.png',
                        // 		type: 'link',
                        // 		active: false
                        // 	},
                        // 	{
                        // 		path: '/subject/list-subject', title: 'Subject', icon: 'book', imgePath: 'assets/images/mob-side-icon/subject.png', type: 'link', active: false
                        // 	},
                        // 	{
                        // 		title: 'Grade', icon: 'clipboard', path: '/grade/list-grade', imgePath: 'assets/images/mob-side-icon/graduated.png', type: 'link', active: false
                        // 	},
                        // ];
                        // this.MENUITEMS = [
                        // 	{
                        // 		path: '/home/list-home',
                        // 		title: 'Home',
                        // 		icon: 'home',
                        // 		imgePath: 'assets/images/mob-side-icon/home.png',
                        // 		type: 'link',
                        // 		badgeType: 'primary',
                        // 		active: false
                        // 	},
                        // 	{
                        // 		title: 'Class', icon: 'book', type: 'sub', active: false, children: [
                        // 			{
                        // 				path: '/class/list-class', title: 'Classes', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/classess.png', type: 'link', active: false
                        // 			},
                        // 			{
                        // 				path: '/schedule/schedule-page/', title: 'My Schedule', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/holiday.png', type: 'link', active: false
                        // 			},
                        // 		]
                        // 	},
                        // 	{
                        // 		title: 'Curriculum', icon: 'archive', type: 'sub', active: false, children: [
                        // 		]
                        // 	},
                        // 	{
                        // 		title: 'Grading', icon: 'shield', type: 'sub', active: false, children: [
                        // 			{
                        // 				path: '/assessment-correction/list-correction', title: 'Assessment-Correction', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/assessment-correction.png', type: 'link',  active: false
                        // 			},
                        // 			{
                        // 				path: '/assignment-correction/list-correction', title: 'Assignment-Correction', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/assignment-correction.png', type: 'link',  active: false
                        // 			},
                        // 			{
                        // 				path: '/student-content/list-content/new', title: 'Student-Work', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/assignment-correction.png', type: 'link',  active: false
                        // 			}
                        // 		]
                        // 	},
                        // 	{
                        // 		title: 'Users', icon: 'users', type: 'sub', active: false, children: [
                        // 		]
                        // 	},
                        // 	{
                        // 		title: 'Static Data', icon: 'bar-chart-2', type: 'sub', active: false, children: [
                        // 			{
                        // 				title: 'Holidays', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/holiday.png', path: '/leaves/add-holiday', type: 'link', active: false
                        // 			}
                        // 		]
                        // 	},
                        // 	{
                        // 		title: 'Reports', icon: 'pie-chart', type: 'sub', active: false, children: [
                        // 			{
                        // 				title: 'Class Report', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/class-report.png', path: '/report/assessment-summary', type: 'link', active: false
                        // 			},
                        // 			// {
                        // 			// 	title: 'Missed Work Report', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/classReport.png', path: '/report/missed-work-report', type: 'link', active: false
                        // 			// },
                        // 		]
                        // 	},
                        // ];
                        this.MENUITEMS = [
                            {
                                path: '/schedule/schedule-page/',
                                title: 'My Schedule',
                                icon: 'home',
                                imgePath: 'assets/images/mob-side-icon/home.png',
                                type: 'link',
                                badgeType: 'primary',
                                active: false
                            },
                            // {
                            // 		path: '/home/list-home',
                            // 		title: 'Dashboard',
                            // 		icon: 'grid',
                            // 		imgePath: 'assets/images/mob-side-icon/home.png',
                            // 		type: 'link',
                            // 		badgeType: 'primary',
                            // 		active: false
                            // },
                            {
                                path: '/class/list-class',
                                title: 'Class',
                                icon: 'book',
                                imgePath: 'assets/images/mob-side-icon/home.png',
                                type: 'link',
                                badgeType: 'primary',
                                active: false
                            },
                            // {
                            // 	title: 'Class', icon: 'book', type: 'sub', active: false, children: [
                            // 		{
                            // 			path: '/class/list-class', title: 'Classes', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/classess.png', type: 'link', active: false
                            // 		},
                            // 		{
                            // 			path: '/schedule/schedule-page/', title: 'My Schedule', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/holiday.png', type: 'link', active: false
                            // 		},
                            // 	]
                            // },
                            {
                                path: '/repository/content-home',
                                title: 'Content Library',
                                icon: 'book-open',
                                imgePath: 'assets/images/mob-side-icon/content-repository.png',
                                type: 'link',
                                active: false
                            },
                            // {
                            // 	title: 'Content Folder',
                            // 	icon: 'folder-plus',
                            // 	path: '/classroom/list-classroom',
                            // 	imgePath: 'assets/images/mob-side-icon/classroom.png',
                            // 	type: 'link',
                            // 	active: false
                            // },
                            // {
                            // 	title: 'Curriculum', icon: 'archive', type: 'sub', active: false, children: [
                            // 	]
                            // },
                            {
                                title: 'Class Report',
                                icon: 'clipboard',
                                imgePath: 'assets/images/mob-side-icon/class-report.png',
                                path: '/report/assessment-summary',
                                type: 'link',
                                active: false
                            },
                            {
                                title: 'Grading', icon: 'shield', type: 'sub', active: false, children: [
                                    {
                                        path: '/student-content/list-content/new',
                                        title: 'Student-Work',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/assignment-correction.png',
                                        type: 'link',
                                        active: false
                                    }, {
                                        path: '/assessment-correction/list-correction',
                                        title: 'Assessment-Correction',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/assessment-correction.png',
                                        type: 'link',
                                        active: false
                                    },
                                    {
                                        path: '/assignment-correction/list-correction',
                                        title: 'Assignment-Correction',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/assignment-correction.png',
                                        type: 'link',
                                        active: false
                                    }
                                ]
                            },
                            // {
                            // 	title: 'Users', icon: 'users', type: 'sub', active: false, children: [
                            // 	]
                            // },
                            {
                                title: 'Settings', icon: 'settings', type: 'sub', active: false, children: [
                                    {
                                        title: 'Holidays',
                                        icon: 'clipboard',
                                        imgePath: 'assets/images/mob-side-icon/holiday.png',
                                        path: '/leaves/add-holiday',
                                        type: 'link',
                                        active: false
                                    },
                                    {
                                        path: '/subject/list-subject',
                                        title: 'Subject',
                                        icon: 'book',
                                        imgePath: 'assets/images/mob-side-icon/subject.png',
                                        type: 'link',
                                        active: false
                                    },
                                    {
                                        title: 'Grade',
                                        icon: 'clipboard',
                                        path: '/grade/list-grade',
                                        imgePath: 'assets/images/mob-side-icon/graduated.png',
                                        type: 'link',
                                        active: false
                                    },
                                ]
                            },
                        ];
                        //backend group name must equal to navigation title

                        // if (this.permissionList['individual_teacher'] == '1') {
                        // 	for (let i = 0; i < this.AllMENUITEMS.length; i++) {
                        // 		if ((this.AllMENUITEMS[i].title != 'Content-Creator') && (this.AllMENUITEMS[i].title != 'Content Folder')) {
                        // 			if (this.AllMENUITEMS[i].title == 'Student'){
                        // 				this.MENUITEMS[4].children.unshift(this.AllMENUITEMS[i]);
                        // 			}else if (this.AllMENUITEMS[i].title == 'Subject' || this.AllMENUITEMS[i].title == 'Grade'){
                        // 				this.MENUITEMS[5].children.unshift(this.AllMENUITEMS[i]);
                        // 			}else if (this.AllMENUITEMS[i].title == 'Books' || this.AllMENUITEMS[i].title == 'Content Library'  || this.AllMENUITEMS[i].title == 'Class'){
                        // 				this.MENUITEMS[2].children.unshift(this.AllMENUITEMS[i]);
                        // 			}
                        // 		}
                        // 	}
                        // }
                        // else {
                        for (let i = 0; i < this.permissionList.permissions.length; i++) {
                            if (!this.permissionList.permissions[i].allowNav) {
                                for (let j = 0; j < this.MENUITEMS.length; j++) {
                                    if ((this.permissionList.permissions[i].group_name == 'Grade' || this.permissionList.permissions[i].group_name == 'Subject') && this.MENUITEMS[j].title == 'Settings') {
                                        for (let k = 0; k < this.MENUITEMS[j].children.length; k++) {
                                            if (this.permissionList.permissions[i].group_name == this.MENUITEMS[j].children[k].title) {
                                                this.MENUITEMS[j].children.splice(k, 1);
                                            }
                                        }
                                    } else {
                                        if (this.permissionList.permissions[i].group_name != 'Class' && (this.permissionList.permissions[i].group_name == this.MENUITEMS[j].title)) {
                                            this.MENUITEMS.splice(j, 1);
                                        }
                                    }
                                    // }
                                    // 		for (let j = 0; j < this.AllMENUITEMS.length; j++) {
                                    // 			if (this.permissionList.permissions[i].group_name == this.AllMENUITEMS[j].title) {
                                    // // 	title: 'Class', icon: 'book', type: 'sub', active: false, children: [
                                    // // 		{
                                    // // 			path: '/class/list-class', title: 'Classes', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/classess.png', type: 'link', active: false
                                    // // 		},
                                    // // 		{
                                    // // 			path: '/schedule/schedule-page/', title: 'My Schedule', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/holiday.png', type: 'link', active: false
                                    // // 		},
                                    // // 	]
                                    // // },
                                    // 				if (this.permissionList.permissions[i].group_id == '1' || this.permissionList.permissions[i].group_id == '2'){
                                    // 					if (this.permissionList.permissions[i].group_id == '2') {
                                    // 						if (this.permissionList.permissions[0].allowNav) {
                                    // 							this.MENUITEMS[4].children.splice(1, 0, this.AllMENUITEMS[j]);
                                    // 						} else {
                                    // 							this.MENUITEMS[4].children.unshift(this.AllMENUITEMS[j]);
                                    // 						}
                                    // 					} else {
                                    // 						this.MENUITEMS[4].children.unshift(this.AllMENUITEMS[j]);
                                    // 					}
                                    // 				}else if (this.permissionList.permissions[i].group_id == '3'){
                                    // 					 if (this.permissionList.permissions[2].allowNav) {
                                    // 						this.MENUITEMS[5].children.unshift(this.AllMENUITEMS[j]);
                                    // 					}
                                    // 				}else if (this.permissionList.permissions[i].group_id == '4' || this.permissionList.permissions[i].group_id == '5' || this.permissionList.permissions[i].group_id == '6'){
                                    // 					if (this.permissionList.permissions[i].group_id == '5') {
                                    // 						if (this.permissionList.permissions[3].allowNav) {
                                    // 							this.MENUITEMS[2].children.splice(1, 0, this.AllMENUITEMS[j]);
                                    // 						} else {
                                    // 							this.MENUITEMS[2].children.unshift(this.AllMENUITEMS[j]);
                                    // 						}
                                    // 					}else if (this.permissionList.permissions[i].group_id == '6') {
                                    // 						if (this.permissionList.permissions[5].allowNav) {
                                    // 							this.MENUITEMS[2].children.splice(1, 0, this.AllMENUITEMS[j]);
                                    // 						} else {
                                    // 							this.MENUITEMS[2].children.unshift(this.AllMENUITEMS[j]);
                                    // 						}
                                    // 					} else {
                                    // 						this.MENUITEMS[2].children.unshift(this.AllMENUITEMS[j]);
                                    // 					}
                                    // 				}
                                    // 			}
                                    // 		}
                                }
                            } else if (this.permissionList.permissions[i].allowNav && (this.permissionList.permissions[i].group_name == 'Students' || this.permissionList.permissions[i].group_name == 'Content-Creator')) {
                                const user = {
                                    title: 'Users',
                                    icon: 'users',
                                    imgePath: 'assets/images/mob-side-icon/content-repository.png',
                                    path: '/users/user-list',
                                    type: 'link',
                                    active: false
                                };
                                if (this.MENUITEMS[2].title != 'Users') {
                                    this.MENUITEMS.splice(2, 0, user);
                                }
                            }
                        }
                        // for (let i = 0; i < this.MENUITEMS.length; i++) {
                        // 	if (this.MENUITEMS[i].title == 'Curriculum') {
                        // 		if (this.MENUITEMS[i].children.length == 0) {
                        // 			this.MENUITEMS.splice(i, 1);
                        // 		}
                        // 	} else if (this.MENUITEMS[i].title == 'Users') {
                        // 		if (this.MENUITEMS[i].children.length == 0) {
                        // 			this.MENUITEMS.splice(i, 1);
                        // 		}
                        // 	}
                        // }
                    }
                    this.onResize();
                    if (this.screenWidth < 991) {
                        this.collapseSidebar = true;
                    }
                    this.items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
                });
            } else if (this.roleId == 3 || this.roleId == '3') {
                this.roleId = '3';
                if (this.roleId === '3') {
                    this.MENUITEMS = [
                        {
                            path: '/repository/content-home',
                            title: 'Home',
                            icon: 'home',
                            imgePath: 'assets/images/mob-side-icon/home.png',
                            type: 'link',
                            badgeType: 'primary',
                            active: false
                        }
                    ];
                    this.items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
                }
            } else if (this.roleId == 5 || this.roleId == '5') {
                this.roleId = '5';
                if (this.roleId === '5') {
                    this.MENUITEMS = [
                        {
                            path: '/studentlogin/list-home',
                            title: 'Home',
                            icon: 'home',
                            imgePath: 'assets/images/mob-side-icon/home.png',
                            type: 'link',
                            badgeType: 'primary',
                            active: true
                        },
                        {
                            path: '/studentlogin/list-class',
                            title: 'Class',
                            icon: 'book',
                            imgePath: 'assets/images/mob-side-icon/classess.png',
                            type: 'link',
                            active: false
                        },
                        {
                            path: '/schedule/daily-schedule',
                            title: 'Schedule',
                            icon: 'clipboard',
                            imgePath: 'assets/images/mob-side-icon/schedule.png',
                            type: 'link',
                            active: false
                        },
                        // {
                        // 	path: '/studentlogin/repository', title: 'My Content', icon: 'award', imgePath: 'assets/images/mob-side-icon/classess.png', type: 'link', active: false
                        // },
                        // {
                        // 	path: '/studentlogin/content-folder', title: 'My Folder', icon: 'archive', imgePath: 'assets/images/mob-side-icon/classess.png', type: 'link', active: false
                        // },
                        {
                            path: '/studentlogin/resource',
                            title: 'Resource',
                            icon: 'globe',
                            imgePath: 'assets/images/mob-side-icon/books.png',
                            type: 'link',
                            active: false
                        },
                        {
                            path: '/studentlogin/assessment',
                            title: 'Assessment',
                            icon: 'layers',
                            imgePath: 'assets/images/mob-side-icon/assessment-correction.png',
                            type: 'link',
                            active: false
                        },
                        {
                            path: '/studentlogin/assignment',
                            title: 'Assignment',
                            icon: 'at-sign',
                            imgePath: 'assets/images/mob-side-icon/assignment-correction.png',
                            type: 'link',
                            active: false
                        },
                        {
                            path: '/studentlogin/reports',
                            title: 'Reportcard',
                            icon: 'pie-chart',
                            imgePath: 'assets/images/mob-side-icon/report_card.png',
                            type: 'link',
                            active: false
                        },
                        // {
                        // 	path: '/studentlogin/enrollclass', title: 'Enroll Class', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/student-report.png', type: 'link', active: false
                        // }
                    ];
                    this.items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
                }
            } else if (this.roleId == '6' || this.roleId == 6) {
                this.roleId = '6';
                if (this.roleId === '6') {
                    this.MENUITEMS = [
                        {
                            path: '/dashboard/default',
                            title: 'Dashboard',
                            icon: 'grid',
                            imgePath: 'assets/images/mob-side-icon/home.png',
                            type: 'link',
                            badgeType: 'primary',
                            active: false
                        },
                        // {
                        //     path: '/home/list-home', title: 'Home', icon: 'home', imgePath: 'assets/images/mob-side-icon/home.png', type: 'link', badgeType: 'primary', active: false
                        // },
                        // {
                        // 	path: '/schedule/my-schedule/', title: 'Home', icon: 'home', imgePath: 'assets/images/mob-side-icon/holiday.png', type: 'link', active: false
                        // },
                        {
                            title: 'Class',
                            icon: 'book',
                            imgePath: 'assets/images/mob-side-icon/classess.png',
                            path: '/class/list-class',
                            type: 'link',
                            active: false
                        },
                        // {
                        // 	title: 'Class', icon: 'book', type: 'sub', active: false, children: [
                        // 		{
                        // 			title: 'Classes', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/classess.png', path: '/class/list-class', type: 'link', active: false
                        // 		},
                        // 		{
                        // 			path: '/schedule/my-schedule/', title: 'Schedule', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/holiday.png', type: 'link', active: false
                        // 		},
                        // 	]
                        // },


                        {
                            title: 'Users',
                            icon: 'users',
                            imgePath: 'assets/images/mob-side-icon/content-repository.png',
                            path: '/users/user-list',
                            type: 'link',
                            active: false
                        },
                        // {
                        //     title: 'Users', icon: 'users', type: 'sub', active: false, children: [
                        // 		{
                        // 			title: 'Admin' , icon: 'clipboard' , path: '/admin/list-admin' , type: 'link' , active: false
                        // 		},
                        //         {
                        //             title: 'Student', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/student.png', path: '/student/list-student', type: 'link', active: false
                        //         },
                        //         {
                        //             title: 'Teacher', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/teacher.png', path: '/Teacher/list-Teacher', type: 'link', active: false
                        //         },
                        //         {
                        //             title: 'Content-Creator', icon: 'user-plus', imgePath: 'assets/images/mob-side-icon/student.png', path: '/Content-Creator/list-Content', type: 'link', active: false
                        //         },
                        //         // {
                        //         //     title: 'Institution', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/home.png', path: '/School/list-School', type: 'link', active: false
                        //         // }
                        //     ]
                        // },
                        // {
                        // 	title: 'Admin' , icon: 'clipboard' , path: '/admin/list-admin' , type: 'link' , active: false
                        // },
                        // {
                        // 	title: 'Students', icon: 'smile', imgePath: 'assets/images/mob-side-icon/student.png', path: '/student/list-student', type: 'link', active: false
                        // },
                        // {
                        // 	title: 'Teachers', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/teacher.png', path: '/Teacher/list-Teacher', type: 'link', active: false
                        // },
                        // {
                        // 	title: 'Content-Creator', icon: 'user-plus', imgePath: 'assets/images/mob-side-icon/student.png', path: '/Content-Creator/list-Content', type: 'link', active: false
                        // },
                        {
                            title: 'Institution',
                            icon: 'clipboard',
                            imgePath: 'assets/images/mob-side-icon/home.png',
                            path: '/School/list-School',
                            type: 'link',
                            active: false
                        },
                        {
                            title: 'Content Library',
                            icon: 'book-open',
                            imgePath: 'assets/images/mob-side-icon/content-repository.png',
                            path: '/repository/content-home',
                            type: 'link',
                            active: false
                        },
                        // {
                        // 	title: 'Content Folder', icon: 'folder-plus', imgePath: 'assets/images/mob-side-icon/classroom.png', path: '/classroom/list-classroom', type: 'link', active: false
                        // },
                        // {
                        //     title: 'Curriculum', icon: 'archive', type: 'sub', active: false, children: [
                        //         // {
                        //         //     title: 'Books', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/books.png', path: '/Books/list-Books', type: 'link', active: false
                        //         // },
                        // 		{
                        // 			title: 'Content Folder', icon: 'folder-plus', imgePath: 'assets/images/mob-side-icon/classroom.png', path: '/classroom/list-classroom', type: 'link', active: false
                        // 		},
                        //         {
                        //             title: 'Content Library', icon: 'book-open', imgePath: 'assets/images/mob-side-icon/content-repository.png', path: '/repository/content-home', type: 'link', active: false
                        //         },
                        //     ]
                        // },
                        // {
                        // 	title: 'Grading', icon: 'shield', type: 'sub', active: false, children: [
                        // 		{
                        // 			path: '/assessment-correction/list-correction', title: 'Assessment-Correction', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/assessment-correction.png', type: 'link',  active: false
                        // 		},
                        // 		{
                        // 			path: '/assignment-correction/list-correction', title: 'Assignment-Correction', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/assignment-correction.png', type: 'link',  active: false
                        // 		}
                        // 	]
                        // },

                        {
                            title: 'Reports', icon: 'pie-chart', type: 'sub', active: false, children: [
                                {
                                    title: 'Class Report',
                                    icon: 'clipboard',
                                    imgePath: 'assets/images/mob-side-icon/class-report.png',
                                    path: '/report/assessment-summary',
                                    type: 'link',
                                    active: false
                                },
                                {
                                    title: 'Grade Report',
                                    icon: 'clipboard',
                                    imgePath: 'assets/images/mob-side-icon/student-report.png',
                                    path: '/report/grade-report',
                                    type: 'link',
                                    active: false
                                },
                                // {
                                // 	title: 'Missed Work Report', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/classReport.png', path: '/report/missed-work-report', type: 'link', active: false
                                // },
                                // {
                                // 	title: 'Student Performance Report', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/classReport.png', path: '/report/student-performance-report', type: 'link', active: false
                                // },
                                // {
                                // 	title: 'Student Report', icon: 'clipboard', imgePath: 'assets/images/mob-side-icon/studentReport.png', path: '/report/student-grade-summary', type: 'link', active: false
                                // }
                            ],

                        },
                        {
                            title: 'Settings', icon: 'settings', type: 'sub', active: false, children: [
                                {
                                    title: 'General',
                                    icon: 'settings',
                                    imgePath: 'assets/images/mob-side-icon/classess.png',
                                    path: '/settings/list-Settings',
                                    type: 'link',
                                    active: false,
                                },
                                {
                                    title: 'Grade',
                                    icon: 'clipboard',
                                    imgePath: 'assets/images/mob-side-icon/student.png',
                                    path: '/grade/list-grade',
                                    type: 'link',
                                    active: false
                                },
                                {
                                    title: 'Subject',
                                    icon: 'clipboard',
                                    imgePath: 'assets/images/mob-side-icon/subject.png',
                                    path: '/subject/list-subject',
                                    type: 'link',
                                    active: false
                                },
                                {
                                    title: 'Holidays',
                                    icon: 'clipboard',
                                    imgePath: 'assets/images/mob-side-icon/holiday.png',
                                    path: '/leaves/add-holiday',
                                    type: 'link',
                                    active: false
                                }
                            ]
                        },
                        {
                            title: 'Pending Approval',
                            icon: 'clipboard',
                            imgePath: 'assets/images/mob-side-icon/classess.png',
                            path: '/request-corporate/request',
                            type: 'link',
                            active: false,
                        },
                    ];
                }
                this.items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
            } else if (this.roleId == '7' || this.roleId == 7) {
                this.roleId = '7';
                if (this.roleId === '7') {
                    this.MENUITEMS = [
                        {
                            path: '/student-content/list-content/old',
                            title: 'Home',
                            icon: 'home',
                            imgePath: 'assets/images/mob-side-icon/home.png',
                            type: 'link',
                            badgeType: 'primary',
                            active: false
                        },
                    ];
                }
                this.items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
            }
        });


///Admin//////////////////
        // tslint:disable-next-line:triple-equals

//// Content Creator//////////
        // tslint:disable-next-line:triple-equals


        // Array
    }

    init(id) {

    }

    // Windows width
    @HostListener("window:resize", ['$event'])
    onResize(event?) {
        this.screenWidth = window.innerWidth;
    }


}
