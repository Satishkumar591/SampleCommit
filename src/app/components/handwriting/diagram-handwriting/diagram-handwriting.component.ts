import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import {DomSanitizer} from '@angular/platform-browser';
import * as iink from 'iink-js';

@Component({
  selector: 'app-diagram-handwriting',
  templateUrl: './diagram-handwriting.component.html',
  styleUrls: ['./diagram-handwriting.component.scss']
})


export class DiagramHandwritingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dref', {read: ElementRef}) domDiagramEditor: ElementRef;
  diagramEditor: any;


  constructor(public sanitized: DomSanitizer) {
  }

  ngAfterViewInit(): void {
    const diagramEditorElement = document.getElementById('diagramEditor');
    const convertElement = document.getElementById('convert');
    diagramEditorElement.addEventListener('mouseup', (event) => {
    console.log(event);
    convertElement.click();
    });


    const  diagramConfiguration = {
      recognitionParams: {
        type: 'MATH',
        protocol: 'WEBSOCKET',
        apiVersion: 'V4',
        server: {
          scheme: 'https',
          host: 'cloud.myscript.com',
          applicationKey: 'd6a78d44-82c3-4612-815b-07949e1888eb',
          hmacKey: '5cb563c4-8079-4487-8be4-d12a9af40bbd',
        }
      }
    };
    this.diagramEditor = iink.register(this.domDiagramEditor.nativeElement, diagramConfiguration);

  }

  ngOnDestroy(): void {
    this.diagramEditor.close();
  }

  convertHW() {
    let a = '';
    a = this.diagramEditor.export_();
    console.log(a);
  }

  convert() {
    let a = '';
    a = this.diagramEditor.convert();
    console.log(a);
  }

}

