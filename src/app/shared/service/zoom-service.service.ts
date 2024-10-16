import {Injectable, NgZone, OnInit} from '@angular/core';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import {CommonService} from './common.service';
import {AuthService} from './auth.service';
import {ZoomMtg} from '@zoomus/websdk';
import {BehaviorSubject, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoomServiceService {
  constructor(public zone: NgZone , public auth: AuthService,
              public common: CommonService) {
    ZoomServiceService.me = this;
  }
  public static me: ZoomServiceService;
  client: any;
  meetNum: string;
  passcode: string;
  zoomSignature: string;
  apiKey: string;
  apiSecret: string;
  storage: any;
  public showZoom = new BehaviorSubject<any>('');
  cast = this.showZoom.asObservable();

  getSignatureData(classData) {
    console.log(classData, 'class');
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      class_id: classData.class_id,
      school_id: this.auth.getSessionData('rista-school_id')
    };
    this.common.getSignature(data).subscribe((successData: any) => {
          if (successData.IsSuccess) {
            //
            this.startMeeting(successData.ResponseObject);
          }
        },
        (error) => {


          console.log(error , 'err');
        });
  }

  startMeeting(signatureResponce){
    // this.meetNum = '85769364669';
    // this.passcode = '2vCK9Z';
    this.meetNum = signatureResponce.meeting_id.replace(/\s/g, '');
    this.passcode = signatureResponce.passcode;
    // this.apiKey = btoa(btoa(btoa(btoa(signatureResponce.zoom_apiKey))));
    // this.apiSecret =  btoa(btoa(btoa(btoa(signatureResponce.zoom_apiSecret))));
    this.apiKey = signatureResponce.zoom_apiKey;
    this.apiSecret =  signatureResponce.zoom_apiSecret;
    this.zoomSignature = signatureResponce.zoomSignature;
    this.zone.runOutsideAngular(() => {
      const meetingSDKElement = document.getElementById('meetingSDKElement');
      const meetingSDKChatElement = document.getElementById('meetingSDKChatElement');
      this.client = null;
      this.client = ZoomMtgEmbedded.createClient();
      this.client.init({
        viewLayout: 'gallery',
        debug: true,
        crossOriginIsolated: true,
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        customize: {
          video: {
            popper: {
              disableDraggable: false,
              viewLayout: 'gallery'
            }
          },
          chat: {
            popper: {
              disableDraggable: false,
              anchorElement: meetingSDKChatElement,
              placement: 'left'
            },
          }
        }
      });
      this.zoomJoin(signatureResponce);
    });

  }

  initZoomMeeting(list) {
    this.getSignatureData(list);
  }
  zoomJoin(signatureResponce) {
    const signaturePaylod = {
      meetingNumber: this.meetNum.replace(/\s/g, ''),
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      role: signatureResponce.role.toString() // 1 for host 0 for participants
      // role: '1' //1 for host 0 for participants
    };
    // this.genrateSignature(signaturePaylod).subscribe((signature: string) => {
    //   this.zoomSignature = signature;
    //   console.log(signature)
    // this.meetNum = '965 5494 6883';
    // this.passcode = '218070';

    this.storage = JSON.stringify(localStorage);

    this.client.join({
        apiKey: this.apiKey,
        signature: this.zoomSignature,
        meetingNumber: this.meetNum.replace(/\s/g, ''),
        password: this.passcode,
        userName:  signatureResponce.user_name
      }).then((succ) => {
        console.log(succ , 'suc');
      // document.getElementsByName('react-draggable-dragged')[0].style.zIndex = '11';

      this.observeEvent();

        // const dialog = this.FindByAttributeValue('role', 'dialog' , 'DIV');
        // console.log(dialog , 'dial');
        // if (dialog) {
        //   dialog.style.zIndex = '10';
        // }
        // if (document.getElementById('meetingSDKElement').childElementCount > 1){
        this.manualClickGalleryView();
        // this.setZindexProperty();
        // this.refreshAlert();
        // }else{
        //   this.client.leaveMeeting();
        //   this.setSessionData();
        // }
      }).catch(async (err) => {
        console.log(await err , 'errr');
        if (err.reason === 'Duplicated join operation' || err.errorCode === 3008 || err.errorCode === 3707 || err.errorCode === 3000) {
          // this.setSessionData();
          // if (this?.client.getCurrentMeetingInfo().isInMeeting){
          //   console.log(err ,'errred');
          //   this.client.endMeeting();
          // }
        }
        // if (await dialog){

          document.addEventListener('click' , () => {
            console.log('btn clickedddd');

            setTimeout(() => {
              const dialog = this.FindByAttributeValue('role', 'presentation' , 'DIV');
              console.log(dialog , 'dialog')
              if (dialog === undefined || dialog === 'undefined'){
                this.client?.endMeeting();
                this.setSessionData();
              }
            },600);

          });
        // }
     });
    // });
  }
  setZindexProperty() {
   const element =  document.getElementById('meetingSDKElement');
   // element.addEventListener('click' )
   element.addEventListener('mousedown', (event) => {
      // let name = event.key;
      // let code = event.code;
      // Alert the key name and key code on keydown
      console.log(`Key pressed down`);
    }, false);
   element.addEventListener('mouseup', (event) => {
      // let name = event.key;
      // let code = event.code;
      // Alert the key name and key code on keydown
      console.log(`Key pressed up`);
    }, false);
  }

  refreshAlert(){
    // window.addEventListener('beforeunload',  (e  ) => {
    //   console.log('yesss in ')
    //   console.log(ZoomServiceService.me.client.getCurrentMeetingInfo().isInMeeting , 'yesss in')
    //   if (ZoomServiceService.me.client.getCurrentMeetingInfo().isInMeeting) {
    //     return "If you reload this page, your Meet will be Closed";
    //   } else {
    //     //Don't return anything
    //   }
    // });
    window.addEventListener('beforeunload',  (e) => {
      const confirmationMessage = '\o/';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
  }

  setSessionData(){
    this.storage = JSON.parse(this.storage);
    console.log(this.storage , 'in');
    setTimeout(() => {
      console.log(this.storage , 'storage');
      const keys = Object.keys(this.storage);
      let count = 0 ;
      keys.forEach((key, index) => {
        count ++;
        localStorage.setItem(key , this.storage[key]);
        console.log(`${key}: ${this.storage[key]}`);
        if (keys.length == count){
          // this.showZoom.next(true);
          // window.removeEventListener("beforeunload",(e) => {
          //   e.preventDefault();
          //   e.returnValue = '';
          // });
          this.client?.endMeeting();
          window.location.reload();
        }
      });
      // this.checkCallBacks();
      //
    } , 700);
  }

  observeEvent() {
    // const targetNode = document.body;
    const targetNode = document.getElementById('meetingSDKElement');
    const config = { childList: true, subtree: true };

    const callback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        console.log('ennnn')
        // document.getElementsByName('react-draggable-dragged').style.zIndex = '11';
        if (mutation.type === 'childList') {
          // Elements have changed
          const root = document.getElementById('meetingSDKElement');
          // let firstChild = content.firstChild.nodeName;
          console.log(root , 'root[0]?.className');
          console.log(root.children[0] , 'root[0]?');
          console.log(root.children[0].childElementCount , 'root[0]?.childElementCount');
          if (root.children[0]?.childElementCount === 0) {
            console.log('else');
            this.setSessionData();
          }else{
            this.setToolTipZindex();
          }
          console.log(mutation , 'hello');
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
  }

  manualClickGalleryView() {

    const ele  = this.FindByAttributeValue('title' , 'Gallery View' , 'BUTTON');
    ele?.click();
    // this.checkCallBacks();
  }

  setToolTipZindex(){
    const tooltip =  document.getElementById('transition-popper');
    console.log(tooltip , 'tip');
    if (tooltip) {
      tooltip.style.zIndex = '10';
      const endMeetingAll = this.FindEndBtnElement('SPAN' , 'End Meeting for All');
      const leaveMettingBtn = this.FindEndBtnElement('SPAN' , 'Leave Meeting');
      endMeetingAll?.addEventListener('click', (event) => {
        tooltip.style.zIndex = '0';
        console.log(event , 'event endMeetingAll');
        document.getElementById('meetingSDKElement').style.zIndex = '5';
        console.log('hellllo');
        this.setSessionData();
      });
      leaveMettingBtn?.addEventListener('click', (event) => {
        console.log(event , 'event leaveMettingBtn');
        tooltip.style.zIndex = '0';
        document.getElementById('meetingSDKElement').style.zIndex = '5';
        this.setSessionData();
      });
    }
    const dialog = this.FindByAttributeValue('role', 'dialog' , 'DIV');
    console.log(dialog , 'dial');
    if (dialog) {
      dialog.style.zIndex = '10';
    }

  }
  checkCallBacks(){
    // document.getElementById('meetingSDKElement').style.zIndex = '9999';
    console.log(this?.client.getCurrentMeetingInfo() , 'this.client.getCurrentMeetingInfo()');
    const ele  = this.FindByAttributeValue('title' , 'Leave' , 'BUTTON');
    console.log(ele, 'ele');

    ele?.addEventListener('click', ($event) => {
      setTimeout( () => {
        console.log($event , 's');
        document.getElementById('meetingSDKElement').style.zIndex = '5';
        const tooltip =  document.getElementById('transition-popper');
        // const tooltip  = this.FindByAttributeValue('role' , 'tooltip' , 'DIV');
        const endMeetingAll = this.FindEndBtnElement('SPAN' , 'End Meeting for All');
        const leaveMettingBtn = this.FindEndBtnElement('SPAN' , 'Leave Meeting');
        console.log(tooltip , 'tooltip');
        if (tooltip) {
          tooltip.style.zIndex = '10';
        }

        console.log(endMeetingAll , 'endMeetingAll');
        console.log(leaveMettingBtn , 'leaveMettingBtn');
        endMeetingAll?.addEventListener('click', (event) => {
          tooltip.style.zIndex = '0';
          console.log(event , 'event endMeetingAll');
          document.getElementById('meetingSDKElement').style.zIndex = '5';
          console.log('hellllo');
          this.setSessionData();
        });
        leaveMettingBtn?.addEventListener('click', (event) => {
          console.log(event , 'event leaveMettingBtn');
          tooltip.style.zIndex = '0';
          document.getElementById('meetingSDKElement').style.zIndex = '5';
          this.setSessionData();
        });
        this.checkPopOverVisbile();
      }, 400);
    });
  }
  checkPopOverVisbile(){
    const checkClickEvent: any = document.addEventListener('click' , () => {
      console.log('clicked');
      const leaveMettingBtn = this.FindEndBtnElement('SPAN' , 'Leave Meeting');
      console.log(leaveMettingBtn , 'leaveMettingBtn');
      if (leaveMettingBtn == undefined || leaveMettingBtn == 'undefined'){
        document.removeEventListener('click', () => {console.log('click removed'); });
        document.getElementById('meetingSDKElement').style.zIndex = '5';
        this.checkCallBacks();
        // document.getElementById('meetingSDKElement').style.zIndex = '9999';
      }
    });
  }
  // genrateSignature(signatureModel: any): any {
  //   let signature: any;
  //   this.zone.runOutsideAngular(() => {
  //     signature = ZoomMtg.generateSignature({
  //       meetingNumber: signatureModel.meetingNumber.replace(/\s/g, ""),
  //       apiKey: signatureModel.apiKey,
  //       apiSecret: signatureModel.apiSecret,
  //       role: signatureModel.role
  //     });
  //   });
  //   return of(signature);
  // }

  FindByAttributeValue(attribute, value, elementtype)    {
    elementtype = elementtype || '*';
    const All = document.getElementsByTagName(elementtype);
    for (let i = 0; i < All.length; i++)       {
      if (All[i].getAttribute(attribute) == value) { return All[i]; }
    }
  }
  FindEndBtnElement(elementtype , text) {
    // End Meeting for All
    elementtype = elementtype || '*';
    const All = document.getElementsByTagName(elementtype);
    for (let i = 0; i < All.length; i++)       {
      // console.log(All[i].innerText , 'All[i].innerHtml')
      if (All[i].innerText == text) { return All[i]; }
    }
  }
}
