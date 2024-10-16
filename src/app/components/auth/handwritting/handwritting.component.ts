import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import {DomSanitizer} from '@angular/platform-browser';
import * as iink from 'iink-js';

@Component({
  selector: 'app-handwritting',
  templateUrl: './handwritting.component.html',
  styleUrls: ['./handwritting.component.scss']
})


export class HandwrittingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tref', {read: ElementRef}) domTextEditor: ElementRef;
  @ViewChild('mref', {read: ElementRef}) domMathEditor: ElementRef;
  @ViewChild('dref', {read: ElementRef}) domDiagramEditor: ElementRef;
  textEditor: any;
  mathEditor: any;
  diagramEditor: any;




  constructor(public sanitized: DomSanitizer) {
  }

  ngAfterViewInit(): void {
    const mathEditorElement = document.getElementById('mathEditor');
    const textEditorElement = document.getElementById('textEditor');
    // const resultElement = document.getElementById('result');
    // const undoElement = document.getElementById('undo');
    // const redoElement = document.getElementById('redo');
    // const clearElement = document.getElementById('clear');
    // const convertElement = document.getElementById('convert');
    // const convertElement = document.getElementById('convert');
    mathEditorElement.addEventListener('mouseup', (event) => {
      // console.log("india");
      console.log(event);
      // console.log(this.mathEditor.pointerDown());
      // console.log(this.mathEditor.pointerUp());
      // console.log(this.mathEditor.pointerMove());
      // convertElement.click();
    });

    textEditorElement.addEventListener('mouseup', (event) => {
      // console.log("india");
      console.log(event);
      // console.log(this.mathEditor.pointerDown());
      // console.log(this.mathEditor.pointerUp());
      // console.log(this.mathEditor.pointerMove());
      // convertElement.click();
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



    const drawingConfiguration = {
      recognitionParams: {
        type: 'DIAGRAM',
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
    }

    this.diagramEditor = iink.register(this.domDiagramEditor.nativeElement, drawingConfiguration);

   // this.mathEditor.import
    let b= '{\n' +
        '    "type": "Math",\n' +
        '        "expressions": [ {\n' +
        '      "type": "+",\n' +
        '      "id": "math/116",\n' +
        '      "items": [ {\n' +
        '        "type": "glyph",\n' +
        '        "timestamp": "2021-04-12 11:24:51.035000",\n' +
        '        "label": "+",\n' +
        '        "bounding-box": {\n' +
        '          "x": 82.3185959,\n' +
        '          "y": 50.5279579,\n' +
        '          "width": 11.2659531,\n' +
        '          "height": 11.2784424\n' +
        '        },\n' +
        '        "id": "00000d0001000700ff00"\n' +
        '      } ],\n' +
        '      "operands": [ {\n' +
        '        "type": "superscript",\n' +
        '        "id": "math/91",\n' +
        '        "operands": [ {\n' +
        '          "type": "symbol",\n' +
        '          "id": "math/64",\n' +
        '          "label": "a",\n' +
        '          "items": [ {\n' +
        '            "type": "glyph",\n' +
        '            "timestamp": "2021-04-12 11:24:47.239000",\n' +
        '            "label": "a",\n' +
        '            "bounding-box": {\n' +
        '              "x": 61.9124985,\n' +
        '              "y": 52.5638237,\n' +
        '              "width": 8.80542755,\n' +
        '              "height": 8.66803741\n' +
        '            },\n' +
        '            "id": "00000b0001000700ff00"\n' +
        '          } ]\n' +
        '        }, {\n' +
        '          "type": "number",\n' +
        '          "id": "math/90",\n' +
        '          "label": "2",\n' +
        '          "value": 2,\n' +
        '          "items": [ {\n' +
        '            "type": "glyph",\n' +
        '            "timestamp": "2021-04-12 11:24:49.552000",\n' +
        '            "label": "2",\n' +
        '            "bounding-box": {\n' +
        '              "x": 72.0143814,\n' +
        '              "y": 44.2355156,\n' +
        '              "width": 5.11838531,\n' +
        '              "height": 7.77875137\n' +
        '            },\n' +
        '            "id": "00000c0001000700ff00"\n' +
        '          } ]\n' +
        '        } ]\n' +
        '      }, {\n' +
        '        "type": "superscript",\n' +
        '        "id": "math/203",\n' +
        '        "operands": [ {\n' +
        '          "type": "symbol",\n' +
        '          "id": "math/184",\n' +
        '          "label": "y",\n' +
        '          "items": [ {\n' +
        '            "type": "glyph",\n' +
        '            "timestamp": "2021-04-12 11:24:53.106000",\n' +
        '            "label": "y",\n' +
        '            "bounding-box": {\n' +
        '              "x": 98.7703857,\n' +
        '              "y": 52.5638237,\n' +
        '              "width": 8.63056946,\n' +
        '              "height": 12.4025383\n' +
        '            },\n' +
        '            "id": "00000e0001000700ff00"\n' +
        '          } ]\n' +
        '        }, {\n' +
        '          "type": "number",\n' +
        '          "id": "math/202",\n' +
        '          "label": "2",\n' +
        '          "value": 2,\n' +
        '          "items": [ {\n' +
        '            "type": "glyph",\n' +
        '            "timestamp": "2021-04-12 11:24:55.099000",\n' +
        '            "label": "2",\n' +
        '            "bounding-box": {\n' +
        '              "x": 108.697411,\n' +
        '              "y": 44.2355156,\n' +
        '              "width": 5.11838531,\n' +
        '              "height": 7.77875137\n' +
        '            },\n' +
        '            "id": "00000f0001000700ff00"\n' +
        '          } ]\n' +
        '        } ]\n' +
        '      } ]\n' +
        '    } ],\n' +
        '        "id": "MainBlock",\n' +
        '        "version": "2"\n' +
        '  }'
    let a = '{\n' +
        ' "type": "Text",\n' +
        ' "label": "Tty",\n' +
        ' "words": [ {\n' +
        '   "label": "Tty",\n' +
        '   "candidates": [ "Tty", "Tity", "aty", "Xty", "Ity" ]\n' +
        '  } ],\n' +
        ' "version": "2",\n' +
        ' "id": "MainBlock"\n' +
        '}';
    console.log(a);
   // a = a.replace('\\n', '\n');
    // this.mathEditor.import_(b,"application/vnd.myscript.jiix");

   // this.textEditor.import_( a, 'application/vnd.myscript.jiix');
    // this.textEditor.import_("india", "text/plain");

  }



  ngOnDestroy(): void {
    this.textEditor.close();
    this.mathEditor.close();
    this.diagramEditor.close();
  }



  convertHW(type) {
    let a = '';
    if(type == 'text') {
      a = this.textEditor.export_();



    } else if (type == 'math') {
    //  a = this.mathEditor.export_('application/vnd.myscript.jiix');
      a = this.mathEditor.export_();

    } else if (type == 'diagram') {
      //  a = this.mathEditor.export_('application/vnd.myscript.jiix');
      a = this.mathEditor.export_();

    }
    console.log(a);
  }

  convert(type) {
    let a = '';
    if(type == 'text') {
      a = this.textEditor.convert();


    } else if (type == 'math') {
      a = this.mathEditor.convert();

    } else if (type == 'diagram') {
      a = this.diagramEditor.convert();

    }
    console.log(a);
  }

}

