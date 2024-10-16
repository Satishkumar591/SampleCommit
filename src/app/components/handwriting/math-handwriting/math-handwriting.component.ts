import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter, Input} from '@angular/core';
import * as $ from 'jquery';
import {DomSanitizer} from '@angular/platform-browser';
import * as iink from 'iink-js';
import {async} from "@angular/core/testing";

@Component({
  selector: 'app-math-handwriting',
  templateUrl: './math-handwriting.component.html',
  styleUrls: ['./math-handwriting.component.scss']
})


export class MathHandwritingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mref', {read: ElementRef}) domMathEditor: ElementRef;
  @Output() emitMathHandwriting = new EventEmitter<any>();
  @Input() editorMathHandwritingValue: any;
  mathEditor: any;
  exportValue: any;


  constructor(public sanitized: DomSanitizer) {
  }

  ngAfterViewInit(): void {
    const mathEditorElement = document.getElementById('mathEditor');
    const convertElement = document.getElementById('convert');
    // mathEditorElement.addEventListener('mouseup', (event) => {
    // console.log(event);
    // convertElement.click();
    // });


    const  mathConfiguration = {
      recognitionParams: {
        type: 'MATH',
        protocol: 'WEBSOCKET',
        apiVersion: 'V4',
        server: {
          scheme: 'https',
          host: 'cloud.myscript.com',
          applicationKey: 'd6a78d44-82c3-4612-815b-07949e1888eb',
          hmacKey: '5cb563c4-8079-4487-8be4-d12a9af40bbd',
        },
        iink: {
          math: {
            mimeTypes: ['application/x-latex', 'application/vnd.myscript.jiix', 'application/mathml+xml']
          },
          export: {
            jiix: {
              strokes : true
            }
          }
        }
      }
    };
    this.mathEditor = iink.register(this.domMathEditor.nativeElement, mathConfiguration);
    this.mathEditor.import_(this.editorMathHandwritingValue['application/vnd.myscript.jiix'],"application/vnd.myscript.jiix");

  }

  ngOnDestroy(): void {
    this.mathEditor.close();
  }

  convertHW() {
    let a = '';
    a = this.mathEditor.export_();
    console.log(a);
  }

  convert() {
    let a: any = '';
    let b: any = '';
    a = this.mathEditor.convert();
    async(a.then( (v) => {
      b = v.res.export;
      this.exportValue = v.res.exports;
      return v.res.exports;
    })
        .catch( (error) => {
          return error;
        }))
    setTimeout(() => {
      this.emitMathHandwriting.emit(this.exportValue);
    } ,2000);
  }

}

