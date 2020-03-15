import { throwError as observableThrowError } from 'rxjs';

import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { wso2HeaderStudent } from '../../app/variables-config';

/*
  Generated class for the Wso2ServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on services and Angular 2 DI.
*/
@Injectable()
export class Wso2Service {

  wso2ServiceBaseUrl = 'https://api.sgsi.ucl.ac.be:8243/';
  headers: HttpHeaders;
  private token = '';
  private tokenStudent = '';

  constructor(public http: HttpClient) {
    console.log("Starting WSO2 Provider");
    this.getToken().then(() => {
      this.headers = new HttpHeaders({'Authorization': this.token});
      this.headers.append('Accept', 'application/json');
      // this.options = new RequestOptions({ headers: headers });
    });
  }

  /*Load wso2 service*/
  load(url: string) {
    const finalUrl = this.wso2ServiceBaseUrl + url;
    const headers = {headers: this.headers};
    return this.http.get(finalUrl, headers);
  }

  /*Retrieves the token*/
  getToken() {
    const headers = new HttpHeaders({'Authorization': wso2HeaderStudent});
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // let body = "grant_type=client_credentials";
    const body = new HttpParams().set('grant_type', 'client_credentials');

    // this.optionsToken = new RequestOptions({headers: headers});

    const finalUrl = this.wso2ServiceBaseUrl + 'token';
    return new Promise((resolve, reject) => {
      this.http.post(finalUrl, body, {headers: headers}).subscribe(res => {
        this.token = 'Bearer ' + res['access_token'];
        resolve('OK');
      }, error => {
        console.log('Token error');
        reject(error);
      });
    });
  }

  /*Log in the user*/
  login(user: string, pass: string) {
    const headers = new HttpHeaders({'Authorization': wso2HeaderStudent});
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // let body = `grant_type=password&username=${user}&password=${pass}`;
    const body = new HttpParams().set('grant_type', 'password').set('username', user).set('password', pass);
    // this.optionsStudent = new RequestOptions({headers: headers});

    const finalUrl = this.wso2ServiceBaseUrl + 'token';

    return this.http.post(finalUrl, body, {headers: headers}).pipe(
      map(res => {
        this.tokenStudent = 'Bearer ' + res['access_token'];
        return 'OK';
      }),
      catchError((error: any) => observableThrowError(error)),);
  }

  /*Load the student*/
  loadStudent(url: string) {
    const headers = new HttpHeaders({'Authorization': this.tokenStudent});
    headers.append('Accept', 'application/json');
    // this.optionsStudent = new RequestOptions({ headers: headers });
    const finalUrl = this.wso2ServiceBaseUrl + url;
    return this.http.get(finalUrl, {headers: headers}).pipe(map(res => res));
  }

}
