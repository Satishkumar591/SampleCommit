import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(v:any ): SafeHtml {
        // this.clickEvent();
        return this._sanitizer.bypassSecurityTrustHtml(v);
    }

    // clickEvent(){
    //     setTimeout( () =>{
    //         document.getElementById('myDiv').click();
    //     } , 1000);
    // }
}
