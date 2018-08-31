/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
    This file is part of UCLCampus
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

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

import { Injectable} from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform, AlertController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

declare var Connection;

@Injectable()
export class ConnectivityService {
  onDevice: boolean;

  constructor(public platform: Platform, 
              private network: Network, 
              private translateService: TranslateService, 
              private alertCtrl: AlertController,
              private diagnostic: Diagnostic,
              private locationAccuracy: LocationAccuracy){
    this.onDevice = this.platform.is('cordova');
  }

  /*Check if there is a connexion*/
  isOnline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }
  /*pop up an alert to say to the user to connect him to the internet*/
  presentConnectionAlert() {
    let title:string;
    let message:string;
    let close:string;
    this.translateService.get('NET.TITLE').subscribe((res:string) => {title=res;});
    this.translateService.get('NET.CONNECT').subscribe((res:string) => {message=res;});
    this.translateService.get('NET.CLOSE').subscribe((res:string) => {close=res;});
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [close]
    });
    alert.present();
  }

  async isLocationEnabled() {
    let available:boolean;
    console.log("start test location");
    this.diagnostic.isLocationAvailable()
    .then((isAvailable) => {
      console.log("Location available");
      this.diagnostic.isLocationEnabled()
      .then((isAuthorized) => {
        console.log("Location authorized");
        available=true;
        return true;
      })
      .catch((error) => {
        console.log('Location is ' + error);
        available=false;
        return false;
      })
      
    })
    .catch((error) => {
      console.log('Location is ' + error);
      available = false;
      return false;
    })

    console.log("end test location");
    return available;
  }

  enableLocation():boolean{
    let enable:boolean = false;
    console.log("start enable");
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if(canRequest) {
        console.log("can request");
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            console.log('Request successful');
            enable=true;
          },
          error => console.log('Error requesting location permissions', error)
        );
      }

    })
    console.log("end enable");
    return enable;
  }
}
