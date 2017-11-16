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

import { Component, ViewChild } from '@angular/core';
import { NavParams, App, Nav, MenuController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
//import { Market } from '@ionic-native/market';
import { AppAvailability } from '@ionic-native/app-availability';
import { UserService } from '../../providers/utils-services/user-service';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';

import { NewsPage } from '../news/news';

@Component({
  selector: 'page-homeC',
  templateUrl: 'homeC.html',
})
export class HomePage {
  @ViewChild('Nav') nav: Nav;
  //rootPage = HomePage;
  title:string = "Accueil";
  shownGroup = null;
  where = "";
  myApp : MyApp;


  newsPage = { title: 'Actualités', component: NewsPage, icon: 'paper',
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null };


  constructor(public navParams: NavParams,
              private iab: InAppBrowser,
              public app: App,
              public menu: MenuController,
              private device: Device,
  //            public market: Market,
              private appAvailability : AppAvailability,
              public storage:Storage,
              public userS:UserService)
  {
      if(this.navParams.get('title') !== undefined) {
        this.title = this.navParams.get('title');
      }
      this.app.setTitle(this.title);
  }

  update(){
    this.userS.addCampus(this.where);
  }

  changePage(page) {
    this.nav.push(page);
  }
  openRootPage(page) {
    // close the menu when clicking a link from the menu
    //this.menu.close();
    if(page.iosSchemaName != null && page.androidPackageName != null){
      this.myApp.launchExternalApp(page.iosSchemaName, page.androidPackageName, page.appUrl, page.httpUrl);
    }
    this.nav.setRoot(page.component, {title: page.title});

  }

    launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string) {
    let app: string;
    let storeUrl:string;
    if (this.device.platform === 'iOS') {
      app = iosSchemaName;
      storeUrl=httpUrl;
    } else if (this.device.platform === 'Android') {
      app = androidPackageName;
      storeUrl= 'market://details?id='+ app;
    } else {
      const browser = this.iab.create(httpUrl, '_system');
      browser.close();
    }
    this.appAvailability.check(app).then(
      () => { // success callback
        const browser = this.iab.create(appUrl, '_system');
        browser.close();
      },
      () => { // error callback
      //  this.market.open(app);
      }
    );
  }
}
