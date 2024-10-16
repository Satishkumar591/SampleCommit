import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from "@angular/common";
import {NewsubjectService} from "../service/newsubject.service";

@Pipe({
  name: 'customDateFormat',
  pure: false
})
export class CustomDateFormatPipe implements PipeTransform {


  DEFAULT_DATE_FORMAT: any = 'medium';
  constructor(private datePipe: DatePipe , public newSubject: NewsubjectService) {
    this.DEFAULT_DATE_FORMAT = 'medium';
    this.newSubject.globalDateFormat.subscribe((value) => {
      this.DEFAULT_DATE_FORMAT = value;
    });
  }
  transform(value: any, args?: any): any {
      const format = this.newSubject.dateFormat.value ?  this.newSubject.dateFormat.value : localStorage.getItem('currentFormat');
      return this.datePipe.transform(value, format);
  }

}
