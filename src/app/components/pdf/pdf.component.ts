import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import * as Popper from 'popper.js/dist/umd/popper.js';

import * as $ from 'jquery';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent   {

public rectElem: any;
  rect: Rectangle = { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 };
  lastMousePosition: Position = { x: 0, y: 0 };
  canvasPosition: Position = { x: 0, y: 0 };
  mousePosition: Position = { x: 0, y: 0 };
  mouseDownFlag: boolean = false;
  pagePosition: Position = { x: 0, y: 0 };
  show: boolean = false

  cnv;
  pdfBody;
  ctx;
  element = null;
  dataPageNumber: number;

  areaInfo: AreaInfo[] = [];
    indexOfPage: number = 1;
    showPopup: boolean = false;
    listRectangleId: string = '';

  constructor(public sanitized: DomSanitizer) {
    this.areaInfo = [
      {
        "rectangleId": "rectangle-1",
        "pageNumber": 1,
        "rect": {
          "height": 127,
          "width": 646,
          "x1": 60.5,
          "x2": 706.5,
          "y1": 257,
          "y2": 384
        },
        "isDelete": false
      },
      {
        "rectangleId": "rectangle-2",
        "pageNumber": 3,
        "rect": {
          "height": 141,
          "width": 636,
          "x1": 66.921875,
          "x2": 702.921875,
          "y1": 226,
          "y2": 367
        },
        "isDelete": false
      }
      ];

      // this.areaInfo = [];
  }

    mouseEvent(event) {

    if (!this.showPopup) {

        if (event.type === 'mousemove') {
            this.mousePosition = {
                x: event.clientX - this.pagePosition.x,
                y: event.clientY - this.pagePosition.y
            };

            if (this.mouseDownFlag) {
                let width = this.mousePosition.x - this.lastMousePosition.x;
                let height = this.mousePosition.y - this.lastMousePosition.y;
                this.rect = {
                    x1: this.lastMousePosition.x,
                    y1: this.lastMousePosition.y,
                    x2: this.mousePosition.x,
                    y2: this.mousePosition.y,
                    width: width,
                    height: height
                };

                if (this.element != null) {
                    this.element.style.width = width + 'px';
                    this.element.style.height = height + 'px';
                    if (this.rect.width > 0 && this.rect.height > 0) {
                        document.getElementsByTagName('svg')[this.dataPageNumber - 1].appendChild(this.element);
                    }
                }
            }
        }

        if (event.type === 'mousedown') {
            this.mouseDownFlag = true;
            let path = this.composedPath(event.target);
            let eventPath = path.find(p => p.className == 'page');

            if (typeof eventPath !== 'undefined') {
                this.dataPageNumber = parseInt(eventPath.getAttribute('data-page-number')); // get id of page
                let toDrawRectangle = document.getElementsByTagName('svg');
                let pageOffset = toDrawRectangle[this.dataPageNumber - 1].getBoundingClientRect();
                this.pagePosition = {
                    x: pageOffset.left,
                    y: pageOffset.top
                };

                this.lastMousePosition = {
                    x: event.clientX - this.pagePosition.x,
                    y: event.clientY - this.pagePosition.y
                }

                let rectId = document.getElementsByTagName('rect').length + 1;
                this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                //this.element.className = 'rectangle';
                this.element.id = 'rectangle-' + rectId;
                //this.element.style.position = 'absolute';
                this.element.setAttribute("stroke-width", "2");
                this.element.setAttribute("stroke", "red");
                this.element.setAttribute("fill", "transparent");
                this.element.setAttribute( "x", this.lastMousePosition.x);
                this.element.setAttribute("y", this.lastMousePosition.y);
                //this.element.style.left = this.lastMousePosition.x + 'px';
                //this.element.style.top = this.lastMousePosition.y + 'px';
            }
        }

        if (event.type === 'mouseup') {
            this.mouseDownFlag = false;

            if (this.rect.height > 0 && this.rect.width > 0) {
                let popper = document.querySelector('.js-popper');
                new Popper(this.element, popper, {
                    placement: 'top-end'
                });
                this.showPopup = true;
            }
        }
    }
    }


  // added new div with rects when pages rendered

  pageRendered(event) {

    let elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //elem.className = 'to-draw-rectangle';
    elem.style.position = 'absolute';
    elem.style.left = 0 + 'px';
    elem.style.top = 0 + 'px';
    elem.style.right = 0 + 'px';
    elem.style.bottom = 0 + 'px';
    elem.style.cursor = 'crosshair';
    elem.style.width = 100 + '%';
    elem.style.height = 100 + '%';
    // elem.style.background = 'red';
    // elem.style.opacity = '0.4';
    let path = this.composedPath(event.source.div);


    path.find(p => p.className == 'page').appendChild(elem);



    $('.textLayer').addClass('disable-textLayer');

    this.rectElem = this.areaInfo.find(f => f.pageNumber === this.indexOfPage);

    if (typeof this.rectElem !== 'undefined') {
      let rectId = document.getElementsByTagName('rect').length + 1;
      let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      //rect.className = 'rectangle';
      rect.id = 'rectangle-' + rectId;
      //rect.style.position = 'absolute';
      rect.setAttribute("stroke-width", "2");
      rect.setAttribute("stroke", "red");
      rect.setAttribute("fill", "transparent");
      rect.setAttribute( "x", this.rectElem.rect.x1);
      rect.setAttribute("y", this.rectElem.rect.y1);
      // rect.style.left = this.rectElem.rect.x1 + 'px';
      // rect.style.top = this.rectElem.rect.y1 + 'px';
      rect.style.width = this.rectElem.rect.width + 'px';
      rect.style.height = this.rectElem.rect.height + 'px';

      //get to-draw-rectangle div and add rectangle
      path.find(p => p.className == 'page').children[2].appendChild(rect);
    }
    this.indexOfPage++;

  }

  composedPath(el) {
    let path = [];
    while (el) {
      path.push(el);
      if (el.tagName === 'HTML') {
        path.push(document);
        path.push(window);
        return path;
      }
      el = el.parentElement;
    }
  }


  getStyle() {
    if (this.showPopup) {
      return "block";
    } else {
      return "none";
    }
  }

  save() {
      let path = document.getElementById(this.element.id);

      if (path) {
          this.areaInfo.push({
              rectangleId: this.element.id,
              pageNumber: this.dataPageNumber,
              rect: this.rect,
              isDelete: false
          });
          this.showPopup = false;
          this.rect = {x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0};
      }
  }

  cancel() {
    let rectId = this.element.getAttribute('id');
    $('#' + rectId).remove();
    this.showPopup = false;
    this.rect = { x1: 0, y1: 0, x2: 0, y2: 0,  width: 0, height: 0 };
  }

  delete(list: AreaInfo) {
    document.getElementById(list.rectangleId).remove();
    this.areaInfo.find(f => f.rectangleId === list.rectangleId).isDelete = true;
    this.areaInfo = this.areaInfo.filter(f => f.isDelete === false);
  }


  moveTo(list: AreaInfo) {
    if (this.listRectangleId != '') {
      if (document.getElementById(this.listRectangleId)) {
        document.getElementById(this.listRectangleId).style.background = 'transparent';
        document.getElementById(this.listRectangleId).style.opacity = '1';
      }
    }
    if (this.listRectangleId !== list.rectangleId) {
      document.getElementById(list.rectangleId).scrollIntoView({ block: 'start', behavior: 'smooth' });
      document.getElementById(list.rectangleId).style.background = 'red';
      document.getElementById(list.rectangleId).style.opacity = '0.4';
      this.listRectangleId = list.rectangleId;
    }
  }

}

interface Position {
  x: number;
  y: number;
}

interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

interface AreaInfo {
  rectangleId: string;
  pageNumber: number;
  rect: Rectangle;
  isDelete?: boolean;
}