import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ZoomService} from '../../service/zoom.service';
import {WindowState} from '@progress/kendo-angular-dialog';
import * as $ from 'jquery';

@Component({
    selector: 'app-embed-zoom',
    templateUrl: './embed-zoom.component.html',
    styleUrls: ['./embed-zoom.component.scss']
})
export class EmbedZoomComponent implements OnInit {

    meetNum = '87373543286';
    passcode = 'CsxB5k';
    show: boolean = false;
    public windowState: WindowState = 'default';
    public opened: boolean = true;
    modalClass: 'fade';
    public height = 200;

    // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
    startMeetingForm: any;
    subcription: Subscription;

    constructor(
        private zoomService: ZoomService) {
        this.subcription?.unsubscribe();
        this.subcription = new Subscription();
    }

    ngOnInit(): void {
        this.initFun();
        this.zoomService.initFun1();
        // this.onSubmit();
    }


    openModal(type) {
        console.log('s');
        this.modalClass = type;
    }

    initFun() {
        // tslint:disable-next-line:only-arrow-functions
        $(document).ready(function() {


            let $content, $modal, $apnData, $modalCon: any;

            $content = $('.min');

            //To fire modal
            // $(".mdlFire").click(function(e){
            //
            //   e.preventDefault();
            //
            //   var $id = $(this).attr("data-target");
            //   console.log($id ,'id')
            //   $($id).modal({backdrop: false, keyboard: false});
            //   // $($id).modal('show');
            //
            // });


            $('.modalMinimize').on('click', function() {

                $modalCon = $(this).closest('.mymodal').attr('id');

                $apnData = $(this).closest('.mymodal');

                $modal = '#' + $modalCon;

                $('.modal-backdrop').addClass('display-none');

                $($modal).toggleClass('min');

                if ($($modal).hasClass('min')) {

                    $('.minmaxCon').append($apnData);

                    $(this).find('i').toggleClass('fa-minus').toggleClass('fa-clone');

                } else {

                    $('.container').append($apnData);

                    $(this).find('i').toggleClass('fa-clone').toggleClass('fa-minus');

                };

            });

            $('button[data-dismiss=\'modal\']').click(function() {

                $(this).closest('.mymodal').removeClass('min');

                $('.container').removeClass($apnData);

                $(this).next('.modalMinimize').find('i').removeClass('fa fa-clone').addClass('fa fa-minus');

            });

        });

    }

    // ngOnDestroy() {
    //   this.subcription.unsubscribe();
    //
    // }
    public ngOnDestroy(): void {
        this.subcription.unsubscribe();
    }

    join() {
        // this.zoomService.initializeWebSDK();
        this.onSubmit();
    }

    //
    onSubmit() {

        if (true) {
            // let formValues = this.startMeetingForm.value;
            let signaturePaylod = {
                meetingNumber: this.meetNum,
                apiKey: 'y9tOyjXJQoicQHDWbp-L6g',
                apiSecret: '1xfC1XXYcViRGC7UKtfnqFFeEekZ4DDhDJ3D',
                role: '0'
            };
            this.subcription.add(this.zoomService.genrateSignature(signaturePaylod).subscribe((signature: string) => {
                    this.handleGenrateSignature(signature, '');
                })
            );
        }
    }

    private handleGenrateSignature(signature: string, formValues) {
        // let meetNum = '929 7941 4814';
        let meetingPayloads = {
            // meetingNumber: formValues.meetingNumber.replace(/\s/g, ""),
            meetingNumber: this.meetNum,
            passWord: this.passcode,
            signature: signature,
            userEmail: '',
            userName: 'sriramcrazy'
        };
        document.getElementById('zmmtg-root')!.style.display = 'block';
        const root = document.getElementById('zmmtg-root');
        root.style.position = 'inherit';
        document.getElementById('meetingSDKElement').append(root);
        // root.remove();

        this.zoomService.initializeWebSDK(meetingPayloads);
    }


    public openClose(isOpened: boolean) {
        this.opened = isOpened;
    }

    public onStateChange(e) {
        if (e === 'minimized') {
            this.height = 88;
        } else if (e === 'default') {
            this.height = 200;
        }
    }

}
