import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { wso2Header } from '../../app/variables-config';

/*
  Generated class for the Wso2ServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Wso2Service {

  wso2ServiceBaseUrl = 'https://api.sgsi.ucl.ac.be:8243/';
  //wso2ServiceBaseUrl = 'https://esb-test.sipr.ucl.ac.be:8248/';
  options: RequestOptions;

  constructor(public http: Http) {
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', wso2Header);
    this.options = new RequestOptions({ headers: headers });
  }

  load(url: string) {
    let finalUrl = this.wso2ServiceBaseUrl + url;
    return  this.http.get(finalUrl, this.options).map(res => res.json());
  }


}
