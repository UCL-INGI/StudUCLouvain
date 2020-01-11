/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
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

import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-credit',
  templateUrl: 'credit.html',
})

export class CreditPage {
  title: any;
  shownGroup = null;
  version;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public modalCtrl: ModalController, 
              private iab: InAppBrowser,
              private appVersion: AppVersion) 
  {
    this.title = this.navParams.get('title');
    this.appVersion.getVersionNumber().then(version => {
      this.version = version;
      console.log(this.version);
    });
    console.log(this.version);
  }

  public openURL(url: string) {
    this.iab.create(url, '_system','location=yes');
  }
}
