import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter, Input} from '@angular/core';
import * as $ from 'jquery';
import * as iink from 'iink-js';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {of} from "rxjs";
import {resolve} from "q";
import {async} from "@angular/core/testing";

@Component({
  selector: 'app-text-handwriting',
  templateUrl: './text-handwriting.component.html',
  styleUrls: ['./text-handwriting.component.scss']
})


export class TextHandwritingComponent implements AfterViewInit, OnDestroy {
   @ViewChild('tref', {read: ElementRef}) domTextEditor: ElementRef;
    @Output() emitTextHandwriting = new EventEmitter<any>();
    @Input() editorTextHandwritingValue: any;
  textEditor: any;
  exportValue: any;


  constructor(public commondata: CommonDataService) {
  }

  ngAfterViewInit(): void {
    this.commondata.showLoader(false);
    const textEditorElement = document.getElementById('textEditor');
    const convertElement = document.getElementById('convert');
    textEditorElement.addEventListener('mouseup', (event) => {
      // console.log(event);
      convertElement.click();
    });
    textEditorElement.addEventListener('touchend', (event) => {
          convertElement.click();
      });

    const textConfiguration = {
      recognitionParams: {
        type: 'TEXT',
        protocol: 'WEBSOCKET',
        apiVersion: 'V4',
        server: {
          scheme: 'https',
          host: 'webdemoapi.myscript.com',
          applicationKey: 'd6a78d44-82c3-4612-815b-07949e1888eb',
          hmacKey: '5cb563c4-8079-4487-8be4-d12a9af40bbd',
          websocket: {
            pingEnabled: false,
            autoReconnect: true
          }
        },
      }
    };

    this.textEditor = iink.register(this.domTextEditor.nativeElement, textConfiguration);
    console.log(this.editorTextHandwritingValue, 'dddddrrrttt');
    this.textEditor.import_(this.editorTextHandwritingValue['text/plain'], "text/plain");
  }

  ngOnDestroy(): void {
    this.textEditor.close();
  }

  convertHW() {
    let a = '';
    a = this.textEditor.export_();
    console.log(a);
  }

   async convert() {
    let a: any = '';
    let b: any = '';
    ///we can remove the below code
    a = this.textEditor.convert();
    console.log(a ,'aaaa')
     // closed
    b = await this.textEditor.convert();
    console.log(b ,'bbb');
    //method1
    this.emitTextHandwriting.emit(b.res.exports);

    ///previous code need to  remove
    // a.then( (v) => {
    //         b = v.res.export;
    //         this.exportValue = v.res.exports;
    //         return v.res.exports;
    //       })
    //       .catch( (error) => {
    //         return error;
    //       })
    // setTimeout(() => {
    //     this.emitTextHandwriting.emit(this.exportValue);
    // } ,2000);
  }

}

