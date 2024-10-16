import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
    oncallback(e: any) {
        jQuery.ajax({url: 'https://sandbox.forte.net/checkout/v1/js', dataType: 'json'});

    }
}
