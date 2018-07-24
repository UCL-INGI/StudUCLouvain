import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
//import { wso2Header } from '../../app/variables-config';
import { wso2HeaderStudent } from '../../app/variables-config';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

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
  private token:string ="";
  private tokenStudent:string = "";
  private optionsStudent : RequestOptions;
  private optionsToken : RequestOptions;


  constructor(public http: Http) {

    this.getToken()
    .subscribe(
        data => {
              //console.log(this.token);
              let headers = new Headers({ 'Accept': 'application/json' });
              headers.append('Authorization', this.token);
              this.options = new RequestOptions({ headers: headers });
        });

  }



  load(url: string) {

    //console.log(this.token);
    let finalUrl = this.wso2ServiceBaseUrl + url;
    return  this.http.get(finalUrl, this.options).map(res => res.json());
  }

  getToken(){
    let headers = new Headers({ 'Authorization': wso2HeaderStudent});
    headers.append('Content-Type','application/x-www-form-urlencoded');

    let body = `grant_type=client_credentials`;

    this.optionsToken = new RequestOptions({headers: headers});

    let finalUrl = this.wso2ServiceBaseUrl + 'token';
    //console.log(finalUrl);
    //console.log(this.optionsToken);
    return this.http.post(finalUrl,body, this.optionsToken)
      .map(res => {
        //console.log(res);
        this.token = "Bearer " + res.json().access_token;
        console.log('Token ok');
        return "OK";
      })
      .catch((error:any) => { 
console.log('Token error');
return Observable.throw(error)});
  }


   login(user : string, pass : string){

    let headers = new Headers({ 'Authorization': wso2HeaderStudent});
    headers.append('Content-Type','application/x-www-form-urlencoded');

    let body = `grant_type=password&username=${user}&password=${pass}`;

    this.optionsStudent = new RequestOptions({headers: headers});

    let finalUrl = this.wso2ServiceBaseUrl + 'token';

    return this.http.post(finalUrl,body, this.optionsStudent)
      .map(res => {
        //console.log(res);
        this.tokenStudent = "Bearer " + res.json().access_token;
        console.log("Login ok");
        return "OK";
      })
      .catch((error:any) => { return Observable.throw(error)});
  }

  loadStudent(url:string) {
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', this.tokenStudent);
    this.optionsStudent = new RequestOptions({ headers: headers });
    let finalUrl = this.wso2ServiceBaseUrl + url;
    //console.log(finalUrl);
    //console.log(this.tokenStudent);
    return  this.http.get(finalUrl, this.optionsStudent).map(res => res.json());
  }

}
