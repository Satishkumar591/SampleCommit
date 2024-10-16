import { Injectable } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() {

  }




  // form Validation

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  nameValidate(event) {
    if (event.charCode !== 0) {
        const pattern = /[a-zA-Z ]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
          event.preventDefault();
        }
      }

  }
  titleCaseValidate(event) {
    if (event.charCode !== 0) {
      const inputChar = String.fromCharCode(event.charCode);
      const inputValue = event.target.value;
      const result = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    }

  }
  numberValidate(event) {
    if (event.charCode !== 0) {
      const pattern = /[0-9.!@#$%^&*()_+-?<>,]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  numberValidate1(event) {
    if (event.charCode !== 0) {
      const pattern = /[0-9.!@#$%^&*()_+-?<>,]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  dateValidation(event) {
    if (event.charCode !== 0) {
      const pattern = /[0-9-]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }

  idValidate(event) {
    if (event.charCode !== 0) {
      const pattern = /[a-zA-Z0-9 ]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }

}
