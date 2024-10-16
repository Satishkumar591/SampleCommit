import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-remove-student-annotation',
  templateUrl: './remove-student-annotation.component.html',
  styleUrls: ['./remove-student-annotation.component.scss']
})
export class RemoveStudentAnnotationComponent implements OnInit {

  @Input() items: Array<any>;
  @Output() removeItem = new EventEmitter<any>();
  @Output() hoverremoveItem = new EventEmitter<any>();
  @Output() hoverleaveremoveItem = new EventEmitter<any>();
  @Output() undoDeleteAnnatation = new EventEmitter<any>();
  @Output() openDeleteDialog = new EventEmitter<any>();


  constructor() {

    console.log(this.items ,'in onlint')

  }

  ngOnInit(): void {


  }
  ngAfterContentInit(): void {
    console.log(this.items , 'itemmss');
    // this.items = this.items.sort((a, b) =>
    //     a.rect.y2 -  b.rect.y2
    //
    // );
  }

  deleteItem(item){
    console.log(item , 'item');
    this.removeItem.emit(item);
  }
  openDelete(){
    this.openDeleteDialog.emit(true)
  }

  undoDeleteItem(item){
    console.log(item , 'item');

    this.undoDeleteAnnatation.emit(item);
  }

  hoverRemoveItem(item){
    console.log(item , 'itemmmmmmm')
    item.userSelect = !item.userSelect;
    console.log(this.items , 'itemmss');
    if (item.userSelect){
      this.hoverremoveItem.emit(item);

    }else{

      this.hoverleaveremoveItem.emit(item);
    }
  }

  mouseLeaveremoveItem(item){
    this.hoverleaveremoveItem.emit(item);
  }

}
