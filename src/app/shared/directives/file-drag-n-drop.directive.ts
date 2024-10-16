import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appFileDragNDrop]'
})
export class FileDragNDropDirective {

  @Output() public filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();
  //@Output() private filesInvalidEmiter : EventEmitter<File[]> = new EventEmitter();
  @HostBinding('style.background') public background = '#eee';
  @HostBinding('style.border') public borderStyle = '2px dashed';
  @HostBinding('style.border-color') public borderColor = '#696D7D';
  @HostBinding('style.border-radius') public borderRadius = '5px';

  constructor() {

  }

  @HostListener('dragover', ['$event']) public onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'lightgray';
    this.borderColor = 'cadetblue';
    this.borderStyle = '3px solid';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#696D7D';
    this.borderStyle = '2px dashed';
  }

  @HostListener('drop', ['$event']) public onDrop(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#696D7D';
    this.borderStyle = '2px dashed';
    let files = evt.dataTransfer.files;
    console.log(evt ,'eve');
    let valid_files : Array<File> = files;
    this.setEmitData(valid_files);

  }
  setEmitData(validfiles) {
    const reader = new FileReader();
    let finalData : any = [];
    validfiles.forEach(async (item , index) => {
      const res = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(item);
        reader.onload = () => {
          finalData.push({name : item.name , type: item.type, image: reader.result, size: item.size});
          resolve(reader.result);
        };
        reader.onerror = error => reject(error);
      });
      if (validfiles.length == finalData.length){
        this.filesChangeEmiter.emit(finalData);
      }
    });


  }
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
