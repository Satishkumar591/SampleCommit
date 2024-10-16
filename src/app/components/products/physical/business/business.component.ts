import {Component, OnInit, ViewChild} from '@angular/core';
import { categoryDB } from '../../../../shared/tables/category';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../../shared/service/auth.service';
import {CategoryService} from '../../../../shared/service/category.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShopService} from '../../../../shared/service/shop.service';
import {LocalDataSource} from 'ng2-smart-table';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  @ViewChild('shop') content;
  public closeResult: string;
  public shopList: LocalDataSource;
  public tempShopList: LocalDataSource;
  public shopForm: FormGroup;
  public business_id: any;


  constructor(private modalService: NgbModal, public authService: AuthService, public shopService: ShopService, public formBuilder: FormBuilder) {
    this.getBusinessList();
  }
  getBusinessList() {
    const data = {
      user_id: this.authService.getUserId(),
      platform: 'web',
      role_id: this.authService.getRoleId()
    };
    this.shopService.getBusiness(data).subscribe((successData) => {
          this.getBusinessSuccess(successData);
        },
        (error) => {
          this.getBusinessListFailure(error);
        });
  }
  getBusinessSuccess(successData) {
    console.log(successData);
    if (successData.IsSuccess) {
      this.shopList = new LocalDataSource(successData.ResponseObject);
      this.tempShopList = new LocalDataSource(successData.ResponseObject);
    }
  }
  getBusinessListFailure(error) {
    console.log(error);
  }

  open(content) {
      console.log(content, 'contentcontent');
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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


  public settings = {
    hideSubHeader: true,
    mode: 'external',
    edit: {
      confirmSave: false,
    },
    actions: {
      delete: false,
      position: 'right',
    },
    columns: {
      name: {
        title: 'Business Name'
      },
      contact_person: {
        title: 'Contact Person'
      },
      mobile: {
        title: 'Mobile'
      },
      email: {
        title: 'Email'
      },
      status: {
            title: 'Status',
          valuePrepareFunction : (status) => {if (status == '0') { return 'Inactive'; } else {  return 'Active'; }}

      }
      // parent_category_name: {
      //   editor: {
      //     type: 'list',
      //     config: {
      //       list: this.shopList
      //     },
      //   },
      //   title: 'Parent Category Name',
      // },
      // Teacher: {
      //   title: 'Category',
      // }
    },
  };
  onSearch(query) {
    if (query != '') {
      this.shopList.setFilter([
        // fields we want to include in the search
        {
          field: 'name',
          search: query
        },
        {
          field: 'contact_person',
          search: query
        },
        {
          field: 'mobile',
          search: query
        },
        {
          field: 'email',
          search: query
        },
        {
          field: 'status',
          search: query
        }
      ], false);
    } else {
      this.shopList = this.tempShopList;
    }

    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }

  ngOnInit() {
  }
  onEdit(event) {
    this.shopForm = this.formBuilder.group({
      name: [{value: event.data.name, disabled: true}],
      contact_person: [{value: event.data.contact_person, disabled: true}],
      email: [{value: event.data.email, disabled: true}],
      mobile: [{value: event.data.mobile, disabled: true}],
      tax_id: [{value: event.data.tax_id, disabled: true}],
      address1: [{value: event.data.address1, disabled: true}],
      city: [{value: event.data.city, disabled: true}],
      zipcode: [{value: event.data.zipcode, disabled: true}],
      status: [event.data.status, Validators.required]
    });
    this.business_id = event.data.business_id;
    this.open(this.content);
    // this.categoryEdit();
    // event.confirm.resolve();
    console.log(event);
  }
  updateBusiness() {
    const data = {
      user_id: this.authService.getUserId(),
      platform: 'web',
      role_id: this.authService.getRoleId(),
      business_id: this.business_id,
      status: this.shopForm.controls.status.value
    };
    this.shopService.updateBusinessStatus(data).subscribe((successData) => {
          this.updateBusinessSuccess(successData);
        },
        (error) => {
          this.updateBusinessFailure(error);
        });
  }
  updateBusinessSuccess(successData) {
    console.log(successData);
    if (successData.IsSuccess) {
      this.modalService.dismissAll('Cross click');
      this.getBusinessList();
    }
  }
  updateBusinessFailure(error) {
    console.log(error);
  }

}
