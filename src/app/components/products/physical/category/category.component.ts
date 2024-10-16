import {Component, OnInit, ViewChild} from '@angular/core';
import { categoryDB } from '../../../../shared/tables/category';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../../shared/service/auth.service';
import {CategoryService} from '../../../../shared/service/category.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild('content') content;
  public closeResult: string;
  public categories = [];
  public addCategoryForm: FormGroup;
  public editCategoryForm: FormGroup;


  constructor(private modalService: NgbModal, public authService: AuthService, public categoryService: CategoryService, public formBuilder: FormBuilder) {
    this.getCategoryList();
    this.addCategoryForm = this.formBuilder.group({
      is_parent: [''],
      category_name: [''],
      description: [''],
      parent_category: [''],
      is_edit: ['0'],
      category_id: ['0']
    });
  }
  getCategoryList() {
    const data = {
      user_id: this.authService.getUserId(),
      platform: 'web',
      role_id: this.authService.getRoleId()
    };
    this.categoryService.getCategoryList(data).subscribe((successData) => {
          this.getCategoryListSuccess(successData);
        },
        (error) => {
          this.getCategoryListFailure(error);
        });
  }
  getCategoryListSuccess(successData) {
    console.log(successData);
    if (successData.IsSuccess) {
      this.categories = successData.ResponseObject;
    }
  }
  getCategoryListFailure(error) {
    console.log(error);
  }
  categoryAdd() {
    const data = {
      user_id: this.authService.getUserId(),
      platform: 'web',
      role_id: this.authService.getRoleId(),
      parent_category: this.addCategoryForm.controls.is_parent.value == 'yes' ? '0' : this.addCategoryForm.controls.parent_category.value,
      category_name: this.addCategoryForm.controls.category_name.value,
      status: '1',
      description: this.addCategoryForm.controls.description.value
    };
    console.log(data, 'dayttttta');
    this.categoryService.categoryAdd(data).subscribe((successData) => {
          this.categoryAddSuccess(successData);
        },
        (error) => {
          this.categoryAddFailure(error);
        });
  }
  categoryAddSuccess(successData) {
    console.log(successData);
    if (successData.IsSuccess) {
      this.modalService.dismissAll('Cross click');
      this.getCategoryList();
    }
  }
  categoryAddFailure(error) {
    console.log(error);
  }
  categoryEdit() {
    const data = {
      user_id: this.authService.getUserId(),
      platform: 'web',
      role_id: this.authService.getRoleId(),
      parent_category: this.addCategoryForm.controls.is_parent.value == 'yes' ? '0' : this.addCategoryForm.controls.parent_category.value,
      category_name: this.addCategoryForm.controls.category_name.value,
      status: '1',
      description: this.addCategoryForm.controls.description.value,
      category_id: this.addCategoryForm.controls.category_id.value
    };
    this.categoryService.categoryEdit(data).subscribe((successData) => {
          this.categoryEditSuccess(successData);
        },
        (error) => {
          this.categoryEditFailure(error);
        });
  }
  categoryEditSuccess(successData) {
    console.log(successData);
    if (successData.IsSuccess) {
        this.modalService.dismissAll('Cross click');
        this.getCategoryList();
    }
  }
  categoryEditFailure(error) {
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
      position: 'right'
    },
    columns: {
      category_name: {
        title: 'Category Name'
      },
      description: {
        title: 'Description'
      },
      parent_category_name: {
        editor: {
          type: 'list',
          config: {
            list: this.categories
          },
        },
        title: 'Parent Category Name',
      },
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
