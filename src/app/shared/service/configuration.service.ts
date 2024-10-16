import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import {EnvironmentService} from '../../environment.service';

declare let numeral: any;

@Injectable(
    {
      providedIn: 'root'
    }
)
export class ConfigurationService {

  apiHost: string = environment.apiHost;
  webHost: string = environment.webHost;
  imgUrl: string = environment.imgUrl;
  studCheck: boolean = environment.showStudent;
  // paytmUrl: string = environment.paytmUrl;
  host: string;
  webhost: string;
  imgurl: string;
  apihost: string;
  paytmTranscationUrl: string;
  datasetPath: string;
  floatFormat = '0,0.000';
  percentFormat = '0.000%';
  intFormat = '0,0';

  constructor(public envService: EnvironmentService) {
    this.webhost = this.webHost;
    this.imgurl = this.imgUrl;
    this.apihost = this.apiHost;
    // this.paytmTranscationUrl = this.paytmUrl;
  }

  getStudentPermissoin(){
    return this.studCheck
  }
    getHost() {
        return this.envService.apiHost;
    }
    getwebHost() {
        return this.envService.webhost;
    }
    getimgUrl() {
    return this.envService.imgUrl;
    }
}
