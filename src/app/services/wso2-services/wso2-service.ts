
import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { wso2Header } from '../../app/variables-config';
import { wso2HeaderStudent } from '../../variables-config';
import { map, catchError } from 'rxjs/operators';

/*
  Generated class for the Wso2ServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable({ 
  providedIn: 'root' 
})
export class Wso2Service {

  wso2ServiceBaseUrl = 'https://api.sgsi.ucl.ac.be:8243/';

  private token:string ="";
  private tokenStudent:string = "";
  headers: HttpHeaders;

  constructor(public http: HttpClient) {
    this.getToken()
    .subscribe(
        data => {
              //console.log(this.token);
              this.headers = new HttpHeaders({'Authorization' : this.token});
              this.headers.append('Accept', 'application/json');
              //this.options = new RequestOptions({ headers: headers });
        });
  }

  /*Load wso2 service*/
  load(url: string) {
    //console.log(this.token);
    //console.log(this.token);
    let finalUrl = this.wso2ServiceBaseUrl + url;
    return  this.http.get(finalUrl, {headers: this.headers}).pipe(
      map(res => res),
      catchError((error) => {
        console.log(error.status);
        if(error.status === 401){
          console.log("ok");
          this.getToken();
          return this.load(url);
        }
        else{
          return observableThrowError(new Error(error.status));
        }
      })
    );
  }

  /*Retrieves the token*/
  getToken(){
    console.log("gettoken")
    let headers = new HttpHeaders({ 'Authorization': wso2HeaderStudent});
    headers.append('Content-Type','application/x-www-form-urlencoded');

    //let body = "grant_type=client_credentials";
    let body = new HttpParams().set('grant_type', 'client_credentials');

    //this.optionsToken = new RequestOptions({headers: headers});

    let finalUrl = this.wso2ServiceBaseUrl + 'token';
    //console.log(finalUrl);
    //console.log(this.optionsToken);
    return this.http.post(finalUrl, body, {headers: headers}).pipe(
      map(res => {
        this.token = "Bearer " + res['access_token'];
        //console.log(this.token);
        console.log("Token ok");

        return "OK";
      }),
      catchError((error:any) => {
          console.log('Token error');
          return observableThrowError(error)
    }));
  }

  /*Log in the user*/
  login(user : string, pass : string){
    let headers = new HttpHeaders({ 'Authorization': wso2HeaderStudent});
    headers.append('Content-Type','application/x-www-form-urlencoded');

    //let body = `grant_type=password&username=${user}&password=${pass}`;
    let body = new HttpParams().set('grant_type', 'password').set('username',user).set('password',pass);
    //this.optionsStudent = new RequestOptions({headers: headers});

    let finalUrl = this.wso2ServiceBaseUrl + 'token';

    return this.http.post(finalUrl,body, {headers: headers}).pipe(
        map(res => {
          this.tokenStudent = "Bearer " + res['access_token'];
          console.log("Login ok");
          return "OK";
        }),
        catchError((error:any) => { return observableThrowError(error)})
      );
  }

  /*Load the student*/
  loadStudent(url:string) {
    let headers = new HttpHeaders({'Authorization': this.tokenStudent});
    headers.append('Accept', 'application/json');
    //this.optionsStudent = new RequestOptions({ headers: headers });
    let finalUrl = this.wso2ServiceBaseUrl + url;
    //console.log(finalUrl);
    //console.log(this.tokenStudent);
    return  this.http.get(finalUrl, {headers: headers}).pipe(map(res => res));
  }

}
