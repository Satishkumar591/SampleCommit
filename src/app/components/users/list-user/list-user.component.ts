import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CategoryService} from '../../../shared/service/category.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
    selector: 'app-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
    page = 'Student';
    public schoolid = '';
    public teacherschool: any;
    public allowStudent = true;
    public allowAdmin = true;
    public allowContent = true;

    constructor(public category: CategoryService, public config: NgbModalConfig, public confi: ConfigurationService, private newSubject: NewsubjectService, public auth: AuthService, public commondata: CommonDataService, public route: Router) {
        // if (this.schoolStatus.length != 0) {
        this.newSubject.schoolChange.subscribe(params => {
            if (params != '') {
                if (this.route.url.includes('user-list')) {
                    this.init();
                }
            } else {
              this.init();
            }
        });
        // }
        if (this.auth.getSessionData('UsersRedirection')) {
            this.page = this.auth.getSessionData('UsersRedirection');
            this.auth.removeSessionData('UsersRedirection');
        }
    }

    ngOnInit() {

    }

    init() {
        if (this.auth.getRoleId() == '4') {
            this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.allowStudent = this.teacherschool.permissions[0].allowNav;
            this.allowContent = this.teacherschool.permissions[1].allowNav;
            this.page = this.allowStudent ? 'Student' : 'Creator';
            this.allowAdmin = false;
        } else if (this.auth.getRoleId() == '6') {
            this.allowAdmin = true;
            this.allowContent = true;
            this.allowStudent = true;
            this.page = 'Admin';
        } else {
            this.allowAdmin = this.auth.getRoleId() != '2';
            this.page = this.auth.getRoleId() != '2' ? 'Admin' : 'Student';
            this.allowContent = true;
            this.allowStudent = true;
        }
        this.schoolid = this.auth.getSessionData('rista-school_id');
    }
}

