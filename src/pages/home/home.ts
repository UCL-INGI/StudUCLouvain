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

import {
    AlertController, App, Content, FabContainer, IonicPage, LoadingController, NavController,
    NavParams
} from 'ionic-angular';

import { Component, ViewChild } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Market } from '@ionic-native/market';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { MyApp } from '../../app/app.component';
import { UserService } from '../../providers/utils-services/user-service';
import { StudentService } from '../../providers/wso2-services/student-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('home') content: Content;

  title = 'Stud.UCLouvain';
  shownGroup = null;
  where = '';
  myApp: MyApp;

  /*Create an object Page for each feature of our application display in the home page*/

  libraryPage = {
    title: 'MENU.LIBRARY',
    component: 'LibrariesPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  newsPage = {
    title: 'MENU.NEWS',
    component: 'NewsPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  eventPage = {
    title: 'MENU.EVENTS',
    component: 'EventsPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  sportPage = {
    title: 'MENU.SPORTS',
    component: 'SportsPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  studiesPage = {
    title: 'MENU.STUDIES',
    component: 'StudiesPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  helpDeskPage = {
    title: 'MENU.HELP',
    component: 'SupportPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  mapPage = {
    title: 'MENU.MAP',
    component: 'MapPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  guindaillePage = {
    title: 'MENU.PARTY',
    component: 'GuindaillePage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  paramPage = {
    title: 'MENU.PARAM',
    component: 'ParamPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  restoPage = {
    title: 'MENU.RESTAURANT',
    component: 'RestaurantPage',
    iosSchemaName: 'id1156050719',
    androidPackageName: 'com.apptree.resto4u',
    appUrl: 'apptreeresto4u://',
    httpUrl: 'https://uclouvain.be/fr/decouvrir/resto-u'
  };

  mobilityPage = {
    title: 'MENU.MOBILITY',
    component: 'MobilityPage',
    iosSchemaName: null,
    androidPackageName: null,
    appUrl: null,
    httpUrl: null
  };

  constructor(
    public navParams: NavParams,
    public app: App,
    public userS: UserService,
    public nav: NavController,
    private iab: InAppBrowser,
    private appAvailability: AppAvailability,
    private device: Device,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    public market: Market,
    public loadingCtrl: LoadingController,
    public studentService: StudentService,
    public splashscreen: SplashScreen
  ) {
    if (this.navParams.get('title') !== undefined) {
      this.title = this.navParams.get('title');
    }
    this.app.setTitle(this.title);
    document.title = this.title;
    // this.resize();
    // this.userS.removeCampus('');
  }

  /*Set the title*/
  ionViewDidEnter() {
    this.app.setTitle(this.title);
    setTimeout(() => {
      this.splashscreen.hide();
    }, 1000);
    // this.resize();
  }

  /*Update the public variable campus for the user*/
  updateCampus() {
    this.userS.addCampus(this.where);
    // this.resize();
  }

  /*Change page when click on a page of the home of launchExternalApp if it's the resto U*/
  changePage(page) {
    if (page.iosSchemaName != null && page.androidPackageName != null) {
      this.launchExternalApp(page);
    } else {
      this.nav.push(page.component, { title: page.title });
    }
  }

  /*launch external application*/
  launchExternalApp(page) {
    let app: string;
    // let storeUrl:string;
    let check: string;
    if (this.device.platform === 'iOS') {
      app = page.iosSchemaName;
      // storeUrl=page.httpUrl;
      check = page.appUrl;
    } else if (this.device.platform === 'Android') {
      app = page.androidPackageName;
      // storeUrl= 'market://details?id='+ app;
      check = app;
    } else {
      const browser = this.iab.create(page.httpUrl, '_system');
      browser.close();
    }
    this.appAvailability.check(check).then(
      () => {
        const browser = this.iab.create(page.appUrl, '_system');
        browser.close();
      },
      () => {
        this.market.open(app);
      }
    );
  }

  /*Open the URL for the social media of the UCL*/
  public openURL(url: string, fab: FabContainer) {
    this.iab.create(url, '_system');
    fab.close();
  }
  public openUCL(url: string) {
    this.iab.create(url, '_system');
  }

  /*If the user change the language of the app, tranlate the text and change the public variable*/
  languageChanged(event: string) {
    this.userS.storage.set('lan', event);
    this.translateService.use(event);
  }

  /*Create an alert to allow the user to change the parameters of the application (language and campus)*/
  settings() {
    const check = this.userS.campus;
    const check2 = this.translateService.currentLang;
    let settings, message, save, message2, fr, en: string;
    this.translateService.get('HOME.SETTINGS').subscribe((res: string) => {
      settings = res;
    });
    this.translateService.get('HOME.MESSAGE').subscribe((res: string) => {
      message = res;
    });
    this.translateService.get('HOME.SAVE').subscribe((res: string) => {
      save = res;
    });
    this.translateService.get('HOME.MESSAGE2').subscribe((res: string) => {
      message2 = res;
    });
    this.translateService.get('HOME.FR').subscribe((res: string) => {
      fr = res;
    });
    this.translateService.get('HOME.EN').subscribe((res: string) => {
      en = res;
    });

    const settingsAlert = this.alertCtrl.create({
      title: settings,
      message: message,
      inputs: [
        {
          type: 'radio',
          label: 'Louvain-la-Neuve',
          value: 'LLN',
          checked: check === 'LLN'
        },
        {
          type: 'radio',
          label: 'Woluwe',
          value: 'Woluwe',
          checked: check === 'Woluwe'
        },
        {
          type: 'radio',
          label: 'Mons',
          value: 'Mons',
          checked: check === 'Mons'
        }
      ],
      buttons: [
        {
          text: save,
          handler: data => {
            this.userS.addCampus(data);
            languageAlert.present();
          }
        }
      ]
    });
    settingsAlert.present();

    const languageAlert = this.alertCtrl.create({
      title: settings,
      message: message2,
      inputs: [
        {
          type: 'radio',
          label: fr,
          value: 'fr',
          checked: check2 === 'fr'
        },
        {
          type: 'radio',
          label: en,
          value: 'en',
          checked: check2 === 'en'
        }
      ],
      buttons: [
        {
          text: save,
          handler: data => {
            this.languageChanged(data);
          }
        }
      ]
    });
  }

  /*action when click on the floating urgency button, display the text to help the user in an alert*/
  emergency() {
    let close: string;
    this.translateService.get('HOME.CLOSE').subscribe((res: string) => {
      close = res;
    });
    let urg: string;
    this.translateService.get('HOME.URG').subscribe((res: string) => {
      urg = res;
    });
    let msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9: string;
    this.translateService.get('GUINDAILLE.HELP1').subscribe((res: string) => {
      msg1 = res;
    });
    this.translateService.get('GUINDAILLE.HELP2').subscribe((res: string) => {
      msg2 = res;
    });
    this.translateService.get('GUINDAILLE.HELP3').subscribe((res: string) => {
      msg3 = res;
    });
    this.translateService.get('GUINDAILLE.HELP4').subscribe((res: string) => {
      msg4 = res;
    });
    this.translateService.get('GUINDAILLE.HELP5').subscribe((res: string) => {
      msg5 = res;
    });
    this.translateService.get('GUINDAILLE.HELP6').subscribe((res: string) => {
      msg6 = res;
    });
    this.translateService.get('GUINDAILLE.HELP7').subscribe((res: string) => {
      msg7 = res;
    });
    this.translateService.get('GUINDAILLE.HELP8').subscribe((res: string) => {
      msg8 = res;
    });
    this.translateService.get('GUINDAILLE.HELP9').subscribe((res: string) => {
      msg9 = res;
    });
    let out: string;
    this.translateService.get('GUINDAILLE.HELP18').subscribe((res: string) => {
      out = res;
    });
    const alert = this.alertCtrl.create({
      title: urg,
      message:
        '<p> <strong>' +
        msg1 +
        '</strong>: <br><font size="+1"><a href="tel:010 47 22 22">010 47 22 22</a></font> </p> <p><strong>' +
        msg2 +
        '</strong>: <br><font size="+1"><a href="tel:010 47 24 24">010 47 24 24</a></font> <br>ou<br> <font size="+1"><a href="tel:02 764 93 93">02 764 93 93</a></font> <br>(Woluwe - St Gilles - Tournai)<br> ou <br><font size="+1"><a href="tel:065 32 35 55">065 32 35 55</a></font> (Mons)</p> <p><strong>Contact:</strong> <a href="mailto:security@uclouvain.be">security@uclouvain.be</a></p> <p><strong>' +
        out +
        ':</strong> <font size="+1"><a href="tel:112">112</a></font></p>  <p> <br>' +
        msg3 +
        ' <br><br> <strong>' +
        msg4 +
        '</strong> ' +
        msg5 +
        '<br> <strong>' +
        msg6 +
        '</strong> ' +
        msg7 +
        '<br> <strong>' +
        msg8 +
        '</strong> ' +
        msg9 +
        '<br>',
      cssClass: 'emergency',
      buttons: [
        {
          text: close,
          handler: data => { }
        }
      ]
    });
    alert.present();
  }
}
