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

import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform, AlertController } from 'ionic-angular';

declare var Connection;

@Injectable()
export class ConnectivityService {

  onDevice: boolean;

  constructor(public platform: Platform, private network: Network, private alertCtrl: AlertController){
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  presentConnectionAlert() {
    let alert = this.alertCtrl.create({
      title: 'Connexion Internet',
      subTitle: 'Connectez-vous à Internet pour utiliser la fonction demandée...',
      buttons: ['Fermer']
    });
    alert.present();
  }
}
