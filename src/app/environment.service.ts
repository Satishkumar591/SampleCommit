import {HostListener, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {DeviceDetectorService} from 'ngx-device-detector';

export enum Environment {
    Prod = 'prod',
    ProdUat = 'prodUat',
    DevUat = 'devUat',
    Dev = 'dev',
    Local = 'local',
}

export class EnvProperties{
    env: Environment;
    apiHost: string;
    webHost: string;
    imgUrl: string;
    showStudent: boolean;
    version: string;
    envURL: string;
}
@Injectable({providedIn: 'root'})

export class EnvironmentService {
    public envProperties = new EnvProperties();
    public basePath: string;
    public mobileView = window.innerWidth <= 1100;
    public envRecieved = new BehaviorSubject<boolean>(false);

    get env(): Environment {
        return this.envProperties.env;
    }
    get apiHost(): string {
        return this.envProperties.apiHost !== '' && this.envProperties.apiHost !== 'undefined'
            && this.envProperties.apiHost !== undefined ? this.envProperties.apiHost : this.basePath;
    }
    get imgUrl(): string {
        return this.envProperties.imgUrl;
    }
    get webhost(): string {
        return this.envProperties.webHost;
    }

    public deviceType() {
        // console.log(window.innerWidth, this.deviceService.isTablet(), 'this.deviceService.isTablet()');
        return window.innerWidth <= 1180 || this.deviceService.isTablet();
    }

    get showStudent(): boolean {
        return this.envProperties.showStudent;
    }

    get version(): string {
        return this.envProperties.version;
    }
    constructor(private http: HttpClient, private deviceService: DeviceDetectorService) {
        console.log(this.envProperties , 'envPropertiess');
        this.envProperties.showStudent = true;
        this.envProperties.version = '0.0.32';
        this.envRecieved.asObservable();
        this.envRecieved.next(false);
    }

    init(): Promise<void> {
        return new Promise(resolve => {
            this.checkingHostType();
            resolve();
        });
    }

    async getBaseUrlApi(type, envType = ''){
        const data = {
            type
        };
        try {
            const response: any = await this.post('', data).toPromise();
            if (response.IsSuccess) {
                await this.assignEnvValue(response.ResponseObject, envType);
            }
        } catch (err) {
            await err;
        }
    }

    post(url, reqBody, option?: {}) {
        const json = JSON.stringify(reqBody);
        return this.http.post(url , json);
    }

    private checkingHostType(): void {
        const hostname = window && window.location && window.location.hostname;
        const pathname = window && window.location && window.location.pathname;
        // 2->testweb, 3->testadmin, 4->testuatweb, 5->testuatadmin, 6->liveuatweb, 7->liveuatadmin, 8->liveweb, 9-> liveadmin
        if (/^.*localhost.*/.test(hostname)) {
            this.envProperties.env = Environment.Local;
            this.basePath = 'https://dev.edquill.com' + '/rista/api/index.php/admin/common/getBuildUrl';
            this.getBaseUrlApi(2, 'local');// edquill local
            // this.getBaseUrlApi(15); // extra curricullum local
            // this.getBaseUrlApi(16); //safeteens local
        } else if ('dev.edquill.com/web/' === `${hostname}${pathname}`) {
            this.envProperties.env = Environment.Dev;
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.getBaseUrlApi(2);
        } else if ('test.edquill.com/web/' === `${hostname}${pathname}`) {
            this.envProperties.env = Environment.DevUat;
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.getBaseUrlApi(4);
        } else if ('edquill.com/webuat/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/uat/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.ProdUat;
            this.getBaseUrlApi(6);
        } else if ('edquill.com/web/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            // this.basePath = 'http://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.Prod;
            this.getBaseUrlApi(8);
        } else if ('edquill.com/webtest/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/test/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.ProdUat;
            this.getBaseUrlApi(12);
        }else if ('demo.edquill.com/web/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.ProdUat;
            this.getBaseUrlApi(18);
        }  else if ('safeteensonline.edquill.com/web/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.Prod;
            this.getBaseUrlApi(18);
        }else if ('xtracurriculum.edquill.com/web/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.Prod;
            this.getBaseUrlApi(17);
        } else if ('xtracurriculum.edquill.com/webtest/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/test/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.Prod;
            this.getBaseUrlApi(23);
        } else if ('edveda.edquill.com/web/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.Prod;
            this.getBaseUrlApi(17);
        } else if ('uniqprep.edquill.com/web/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.Prod;
            this.getBaseUrlApi(25);
        } else if ('staging.edquill.com/web/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.ProdUat;
            this.getBaseUrlApi(26);
        }else if ('elevenace.edquill.com/web/' === `${hostname}${pathname}`) {
            this.basePath = 'https://' + `${hostname}` + '/rista/api/index.php/admin/common/getBuildUrl';
            this.envProperties.env = Environment.Prod;
            this.getBaseUrlApi(17);
        }else {
            alert('Cannot find environment for host name');
            console.warn(`Cannot find environment for host name ${hostname}`);
            this.envProperties.env = Environment.Local;
            this.basePath = 'https://dev.edquill.com' + '/rista/api/index.php/admin/common/getBuildUrl';
            this.getBaseUrlApi(2);
        }
        console.log(this.mobileView, 'mobileView');
        console.log(this.mobileView, 'mobileView');
    }

    assignEnvValue(res, type){

        if (type == 'local') {
            // this.envProperties.env = Environment.Local;
            // this.envProperties.apiHost =  'https://test.edquill.com/rista/api/index.php/v1/';
            // this.envProperties.webHost = 'https://test.edquill.com/web';
            // this.envProperties.imgUrl = 'https://test.edquill.com/rista';
            this.envProperties.envURL = 'http://localhost:8211/';
            this.envProperties.apiHost =  'https://staging.edquill.com/rista/api/index.php/v1/';
            this.envProperties.webHost = 'https://staging.edquill.com/web';
            this.envProperties.imgUrl = 'https://staging.edquill.com/rista';
            // this.envProperties.apiHost =  'https://edquill.com/rista/api/index.php/v1/';
            // this.envProperties.webHost = 'https://edquill.com/web';
            // this.envProperties.imgUrl = 'https://edquill.com/rista';
            // this.envProperties.apiHost = res.apiHost;
            // this.envProperties.imgUrl = res.imgUrl;
            // this.envProperties.webHost = res.webHost;
        } else {

            const hostname = window && window.location && window.location.hostname;
            const pathname = window && window.location && window.location.pathname;
            this.envProperties.envURL = 'https://' + `${hostname}${pathname}`;
            console.log(this.envProperties.envURL, 'enVur');
            this.envProperties.apiHost = res.apiHost;
            this.envProperties.imgUrl = res.imgUrl;
            this.envProperties.webHost = res.webHost;
        }
        this.envRecieved.next(true);

    }

    @HostListener("window:resize", ['$event'])
    onResize(event?) {
        this.mobileView = event.target.innerWidth <= 1100;
    }
}

