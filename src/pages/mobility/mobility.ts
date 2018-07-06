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

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Market } from '@ionic-native/market';
import { TranslateService } from '@ngx-translate/core';

import { CarpoolingPage } from './carpooling/carpooling';
import { BusPage } from './bus/bus';
import { TrainPage } from './train/train';


@Component({
  selector: 'page-mobility',
  templateUrl: 'mobility.html'
})

export class MobilityPage {
  public title: any;
  carpoolingPage;
  busPage;
  trainPage;
  constructor(public nav: NavController,
              public market: Market,
              public navParams: NavParams,
              private iab: InAppBrowser,
              private appAvailability: AppAvailability,
              private device: Device,
              private translateService: TranslateService) 
  {
    this.title = this.navParams.get('title');
    let titlecar:string;
    this.translateService.get('MOBI.COVOIT').subscribe((res:string) => {titlecar=res;});

    this.carpoolingPage = { title: titlecar, component: CarpoolingPage,
                            iosSchemaName: 'net.commuty.mobile',
                            androidPackageName: 'net.commuty.mobile',
                            appUrl: 'commutynet://', httpUrl: 'https://app.commuty.net/sign-in' };
    this.busPage = { title: 'NextRide', component: BusPage,
                            iosSchemaName: 'be.thomashermine.prochainbus',
                            androidPackageName: 'be.thomashermine.prochainbus',
                            appUrl: 'nextride://', httpUrl: 'https://nextride.be/timetables' };
    this.trainPage = { title: 'SNCB', component: TrainPage,
                            iosSchemaName: 'de.hafas.android.sncbnmbs',
                            androidPackageName: 'de.hafas.android.sncbnmbs',
                            appUrl: 'geo://', httpUrl: 'http://www.belgianrail.be/fr/service-clientele/outils-voyage.aspx' };
  }

  launchExternalApp(page:any) {
    let app: string;
    let storeUrl:string;
    if (this.device.platform === 'iOS') {
      app = page.iosSchemaName;
      storeUrl=page.httpUrl;
    } else if (this.device.platform === 'Android') {
      app = page.androidPackageName;
      storeUrl= 'market://details?id='+ app;
    } else {
      const browser = this.iab.create(page.httpUrl, '_system');
      browser.close();
    }
    this.appAvailability.check(app).then(
      () => { // success callback
        const browser = this.iab.create(page.appUrl, '_system');
        browser.close();
      },
      () => { // error callback
        this.market.open(app);
      }
    );
    this.nav.push(page.component, {title: page.title});
  }
}
