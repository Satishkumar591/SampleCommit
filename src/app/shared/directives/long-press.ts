import {
    Directive,
    Output,
    EventEmitter,
    HostBinding,
    HostListener
} from '@angular/core';

@Directive({
    selector: '[long-press]'
})
export class LongPress {
    pressing: boolean;
    longPressing: boolean;
    timeout: any;
    interval: number;

    @Output()
    onLongPress = new EventEmitter();

    @Output()
    onLongPressing = new EventEmitter();
    @Output()
    mouseDown = new EventEmitter();
    @Output()
    mouseUp = new EventEmitter();

    @HostBinding('class.press')
    get press() { return this.pressing; }

    @HostBinding('class.longpress')
    get longPress() { return this.longPressing; }

    @HostListener('touchstart', ['$event'])
    @HostListener('mousedown', ['$event'])
    onMouseDown(event) {
        this.pressing = true;
        this.longPressing = false;
        this.mouseDown.emit(event);
        this.timeout = setTimeout(() => {
            this.longPressing = true;
            this.onLongPress.emit(event);
            // this.interval = setInterval(() => {
            //     this.onLongPressing.emit(event);
            // }, 50);
        }, 500);
    }

    @HostListener('touchend', ['$event'])
    @HostListener('mouseup', ['$event'])
    @HostListener('mouseleave', ['$event'])
    endPress(event) {
        clearTimeout(this.timeout);
        this.mouseUp.emit(event);
        this.longPressing = false;
        this.pressing = false;
    }
}
