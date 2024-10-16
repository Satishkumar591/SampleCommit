import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {ContentdetailService} from '../../../shared/service/contentdetail.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-passage',
    templateUrl: './passage.component.html',
    styleUrls: ['./passage.component.scss']
})
export class PassageComponent implements OnInit {

    private modalRef: NgbModalRef;
    public passageForm: FormGroup;
    public type = 'Add';
    public passageDetails: any;
    public schoolListDetails: any;
    public editorValue: any = '';
    public listPassageDetails = [];
    public addORUpdate = true;

    @ViewChild('deletePassageConfirmation') deletePassageConfirmation: TemplateRef<any>;
    @ViewChild('viewPassage') viewPassage: TemplateRef<any>;
    @ViewChild('passageAddOrEdit') passageAddOrEdit: TemplateRef<any>;


    constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public auth: AuthService, public content: ContentdetailService,
                public toastr: ToastrService) {
        this.formSetValue();
        this.passageDetails = {title: '', passage: ''};
        if (this.auth.getSessionData('rista-roleid') == '4') {
            this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.addORUpdate = this.schoolListDetails.permissions[4].permission[0].status == 1;
        } else {
            this.addORUpdate = true;
        }
    }

    ngOnInit(): void {
        this.passageCREDService('list');
    }

    addOrEditPassage(type, event) {
        console.log(event, 'dsadas');
        this.type = type;
        if (type == 'edit') {
            this.passageDetails = event;
            this.passageForm.controls.title.patchValue(event.title);
            this.passageForm.controls.passageEditor.patchValue(event.passage);
            this.editorValue = event.passage;
        } else {
            this.formSetValue();
        }
        this.modalRef = this.modalService.open(this.passageAddOrEdit, {size: 'xl', backdrop: 'static'});
    }

    getEditorValue(event) {
        console.log(event, 'event');
        this.editorValue = event.editor;
        this.passageForm.controls.passageEditor.patchValue(event.content);
    }

    openModel(event, type) {
        this.passageDetails = event;
        this.modalRef = this.modalService.open(type == 'delete' ? this.deletePassageConfirmation : this.viewPassage,
            {size: type == 'delete' ? 'md' : 'xl'});
    }

    passageCREDService(type) {

        console.log(this.passageForm.valid, 'validData');
        if ((type == 'add' || type == 'edit') && !this.passageForm.valid) {
            this.toastr.error('Kindly Fill all the fields');
            return false;
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id')
        };

        if (type == 'add' || type == 'edit') {
            data['title'] = this.passageForm.controls.title.value;
            data['passage'] = this.passageForm.controls.passageEditor.value;
            data['status'] = '1';
            type == 'edit' ? data['passage_id'] = this.passageDetails.passage_id : '';
        } else if (type == 'delete') {
            data['passage_id'] = this.passageDetails.passage_id;
        }

        this.content.passageAllService(data, type).subscribe((successData) => {
                this.passageCREDSuccess(successData, type);
            },
            (error) => {
                console.error(error, 'error');
            });
    }

    passageCREDSuccess(successData, type) {
        console.log(successData, type, 'successData');
        if (successData.IsSuccess) {
            if (type == 'list') {
                this.listPassageDetails = successData.ResponseObject;
            } else {
                this.toastr.success(successData.ResponseObject);
                this.passageCREDService('list');
                this.modalRef.close();
            }
        }
    }

    close() {
        this.modalRef.close();
    }

    formSetValue() {
        this.passageForm = this.formBuilder.group({
            title: ['', Validators.required],
            passageEditor: ['', Validators.required]
        });
        this.editorValue != '' ? this.editorValue.setContent('') : '';
    }

}
