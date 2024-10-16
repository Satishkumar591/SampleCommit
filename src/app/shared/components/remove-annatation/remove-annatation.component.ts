import {ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, AfterContentInit} from '@angular/core';

@Component({
  selector: 'app-remove-annatation',
  templateUrl: './remove-annatation.component.html',
  styleUrls: ['./remove-annatation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoveAnnatationComponent implements OnInit , AfterContentInit {

  @Input() items: Array<any>;
  @Output() removeItem = new EventEmitter<any>();
  @Output() hoverremoveItem = new EventEmitter<any>();
  @Output() hoverleaveremoveItem = new EventEmitter<any>();
  @Output() undoDeleteAnnatation = new EventEmitter<any>();
  @Output() openDeleteDialog = new EventEmitter<any>();


  constructor() {

  }

  ngOnInit(): void {


  }
  ngAfterContentInit(): void {
    // this.items = this.items.sort((a, b) =>
    //     a.rect.y2 -  b.rect.y2
    //
    // );
  }

  deleteItem(item){
    this.removeItem.emit(item);
  }
  openDelete(){
    this.openDeleteDialog.emit(true);
  }

  undoDeleteItem(item){

    this.undoDeleteAnnatation.emit(item);
  }

  hoverRemoveItem(item){

    this.hoverremoveItem.emit(item);
  }

  mouseLeaveremoveItem(item){
    this.hoverleaveremoveItem.emit(item);
  }

}
