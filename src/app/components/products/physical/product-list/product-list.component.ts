import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { categoryDB } from '../../../../shared/tables/category';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../../shared/service/auth.service';
import {CategoryService} from '../../../../shared/service/category.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProductService} from '../../../../shared/service/product.service';
import {ButtonViewComponent} from '../../../setting/settings-list/settings-list.component';
import {ViewCell} from 'ng2-smart-table';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @ViewChild('content') content;
  public closeResult: string;
  public products = [];
  public addCategoryForm: FormGroup;
  public editCategoryForm: FormGroup;


  constructor(private modalService: NgbModal, public authService: AuthService, public productService: ProductService, public formBuilder: FormBuilder) {
    this.getProductList();
    this.addCategoryForm = this.formBuilder.group({
      is_parent: [''],
      category_name: [''],
      description: [''],
      parent_category: [''],
      is_edit: ['0'],
      category_id: ['0']
    });
  }
  getProductList() {
    const data = {
      user_id: this.authService.getUserId(),
      platform: 'web',
      role_id: this.authService.getRoleId()
    };
    this.productService.getProductList(data).subscribe((successData) => {
          this.getProductListSuccess(successData);
        },
        (error) => {
          this.getProductListFailure(error);
        });
  }
  getProductListSuccess(successData) {
    console.log(successData);
    if (successData.IsSuccess) {
      this.products = successData.ResponseObject;
    }
  }
  getProductListFailure(error) {
    console.log(error);
  }
  updateProduct(details) {
    const data = {
      user_id: this.authService.getUserId(),
      platform: 'web',
      role_id: this.authService.getRoleId(),
      product_id: details.id,
      featured: details.featured
    };
    console.log(data, 'dayttttta');
    this.productService.updateProduct(data).subscribe((successData) => {
          this.updateProductSuccess(successData);
        },
        (error) => {
          this.updateProductFailure(error);
        });
  }
  updateProductSuccess(successData) {
    console.log(successData);
    if (successData.IsSuccess) {
      this.getProductList();
    }
  }
  updateProductFailure(error) {
    console.log(error);
  }
  // categoryEdit() {
  //   const data = {
  //     user_id: this.authService.getUserId(),
  //     platform: 'web',
  //     role_id: this.authService.getRoleId(),
  //     parent_category: this.addCategoryForm.controls.is_parent.value == 'yes' ? '0' : this.addCategoryForm.controls.parent_category.value,
  //     category_name: this.addCategoryForm.controls.category_name.value,
  //     status: '1',
  //     description: this.addCategoryForm.controls.description.value,
  //     category_id: this.addCategoryForm.controls.category_id.value
  //   };
  //   this.productService.categoryEdit(data).subscribe((successData) => {
  //         this.categoryEditSuccess(successData);
  //       },
  //       (error) => {
  //         this.categoryEditFailure(error);
  //       });
  // }
  // categoryEditSuccess(successData) {
  //   console.log(successData);
  //   if (successData.IsSuccess) {
  //     this.modalService.dismissAll('Cross click');
  //     this.getProductList();
  //   }
  // }
  // categoryEditFailure(error) {
  //   console.log(error);
  // }

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
    actions: false,
    // actions: {
    //   type: 'html',
    //   renderComponent: '<i class="fa fa-eye"></i>',
    //   position: 'right'
    // },
    columns: {
      category: {
        title: 'Category Name'
      },
      name: {
        title: 'Name'
      },
      description: {
        title: 'Description'
      },
      button: {
        title: 'Featured',
        type: 'custom',
        renderComponent: ButtonToggleComponent,
        onComponentInitFunction: (instance: any) =>  {
          instance.save.subscribe(row => {
            console.log(row, 'rowwww');
            this.updateProduct(row);
          });
        }
      }
      // parent_category_name: {
      //   editor: {
      //     type: 'list',
      //     config: {
      //       list: this.products
      //     },
      //   },
      //   title: 'Parent Category Name',
      // },
      // Teacher: {
      //   title: 'Category',
      // }
    },
  };

  ngOnInit() {
  }
  onEdit(event) {
    this.addCategoryForm = this.formBuilder.group({
      is_parent: event.data.parent_category == '0' ? 'yes' : 'no',
      category_name: event.data.category_name,
      description: event.data.description,
      parent_category: event.data.parent_category,
      is_edit: '1',
      category_id: event.data.category_id
    });
    this.open(this.content);
    // this.categoryEdit();
    // event.confirm.resolve();
    console.log(event);
  }

}
@Component({
  selector: 'button-toggle',
  template: `
         <div class="form-group">
            <!--<label class="mb-1">Featured</label><br>-->
            <label class="switch ml-2"><input type="checkbox" id="togBtn" [(ngModel)]="status" (change)="statusListing()"><div class="slider round"   ><!--ADDED HTML --><span class="on" >ON</span><span class="off" >OFF</span><!--END--></div></label>
         </div>
         <style>
         /*//toogle button on off*/
.switch {
  position: relative;
  display: inline-block;
  width: 90px;
  height: 34px;
}

.switch input {display:none;}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ca2222;
   -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
   -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2ab934;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
   -webkit-transform: translateX(55px);
   -ms-transform: translateX(55px);
  transform: translateX(55px);
}

/*------ ADDED CSS ---------*/
.on
{
  display: none;
}

.on, .off
{
  color: white;
  position: absolute;
  transform: translate(-50%,-50%);
  top: 50%;
  left: 50%;
  font-size: 10px;
  font-family: Verdana, sans-serif;
}

input:checked+ .slider .on
{display: block;}

input:checked + .slider .off
{display: none;}

/*--------- END --------*/

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;}
.btn-qooh-color{
  background: blue;
  color: #fff;
}

</style>
    `
})

export class ButtonToggleComponent implements ViewCell, OnInit {
  status: any;
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();
  constructor() {}
  ngOnInit() {
    console.log(this.rowData.featured, 'rowdataa');
    this.status = this.rowData.featured != '0';
    console.log(this.status, 'status');
  }
  statusListing() {
    this.rowData.featured = this.status ? '1' : '0';
    this.save.emit(this.rowData);
  }
}
