/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

    UCLCampus is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    UCLCampus is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with UCLCampus.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { User } from '../app/entity/user';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Injectable()
export class AuthService {
  currentUser: User;
  username: String = "";
  password: String = "";
  readyToLogIn: Boolean = false;
  storage: SecureStorageObject;

  constructor(public platform: Platform, private iab : InAppBrowser, private secureStorage: SecureStorage) {
    platform.ready().then(() => {
      this.secureStorage.create('uclcampus').then((storage: SecureStorageObject) => {
        this.storage = storage;
        console.log('Storage is ready!');

        this.storage.get('loginData')
         .then(
           data => {
             console.log('data was '+ data);
             let {u,p} = JSON.parse(data);
             this.username = u;
             this.password = p;
           },
           error => {
             // do nothing - it just means it doesn't exist
             console.log(error);
           }
        );
      },
        error => console.log(error)
      );
    });
  }

  loginUCL(): Promise<any> {
    let entrypoint_uri = "https://uclouvain.be/Shibboleth.sso/Login";
    let redirect_uri = "https://idp.uclouvain.be/idp/profile/SAML2/Redirect/SSO";
    let endpoint_uri = "https://uclouvain.be/Shibboleth.sso/SAML2/POST";

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        let browserRef = this.iab.create(entrypoint_uri, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

        browserRef.on("loadstart").subscribe((event) => {
          console.log(event.type + " - " + event.url);

          if ((event.url).indexOf(endpoint_uri) === 0) {

            console.log("logged in");

            browserRef.executeScript({code: "localStorage.getItem('username');"}).then(username => this.username = username);
            browserRef.executeScript({code: "localStorage.getItem('password');"}).then(
              password => {
                this.password = password;
                this.storage.set('loginData', JSON.stringify({u:this.username, p:this.password})).then(
                    data => this.readyToLogIn = true,
                    error => console.log(error)
                );
            });
            browserRef.executeScript({code: "localStorage.clear()"});

            browserRef.close();
          }
        });

        browserRef.on("loadstop").subscribe((event) => {
          if ((event.url).indexOf(redirect_uri) === 0) {
            if(this.readyToLogIn) {
              console.log("Ready To Log In with : " + this.username + " - " + this.password);
              browserRef.executeScript({code: "document.getElementById('username').value='" + this.username + "';"});
              browserRef.executeScript({code: "document.getElementById('password').value='" + this.password + "';"});
              //browserRef.executeScript({code: "document.getElementsByName('_eventId_proceed')[0].click();"});
            } else {
              browserRef.executeScript({code: "document.getElementsByName('_eventId_proceed')[0].onclick = function() { var username = document.getElementById('username').value;localStorage.setItem('username', username);var password = document.getElementById('password').value;localStorage.setItem('password', password);};"});
            }
          }
        });

      } else {
        console.error("loadstart events are not being fired in browser.");
        reject(new Error("loadstart events are not being fired in browser."));
      }
    });
  }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "pass" && credentials.email === "email");
        this.currentUser = new User('Bob', 'bob@web.com');
        observer.next(access);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }


}
