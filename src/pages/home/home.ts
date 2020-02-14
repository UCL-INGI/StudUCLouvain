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
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Market } from '@ionic-native/market';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { MyApp } from '../../app/app.component';
import { UserService } from '../../providers/utils-services/user-service';
import { UtilsService } from '../../providers/utils-services/utils-service';
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
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    public market: Market,
    public loadingCtrl: LoadingController,
    public studentService: StudentService,
    public splashscreen: SplashScreen,
    private utilsService: UtilsService
  ) {
    if (this.navParams.get('title') !== undefined) {
      this.title = this.navParams.get('title');
    }
    this.app.setTitle(this.title);
    document.title = this.title;
    // this.userS.removeCampus('');
  }

  ionViewDidEnter() {
    this.app.setTitle(this.title);
    setTimeout(() => {
      this.splashscreen.hide();
    }, 1000);
  }

  updateCampus() {
    this.userS.addCampus(this.where);
  }

  changePage(page) {
    if (page.iosSchemaName != null && page.androidPackageName != null) {
      this.utilsService.launchExternalApp(page);
    } else {
      this.nav.push(page.component, { title: page.title });
    }
  }

  public openURL(url: string, fab: FabContainer) {
    this.iab.create(url, '_system');
    fab.close();
  }
  public openUCL(url: string) {
    this.iab.create(url, '_system');
  }

  languageChanged(event: string) {
    this.userS.storage.set('lan', event);
    this.translateService.use(event);
  }

  settings() {
    const { settings, message2, fr, check2, en, save, message, check }: {
      settings: any; message2: any; fr: any; check2: string; en: string; save: any; message: any; check: string;
    } = this.getSettingsData();
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
  }

  private getSettingsData() {
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
    return { settings, message2, fr, check2, en, save, message, check };
  }

  private getEmergencyText(page: string, name: string) {
    let text: string;
    this.translateService.get(page + '.' + name).subscribe((res: string) => {
      text = res;
    });
    return text;
  }

  emergency() {
    const close = this.getEmergencyText('HOME', 'CLOSE');
    const urg = this.getEmergencyText('HOME', 'URG');
    let msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9: string;
    const msgs = [msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9];
    for (let i = 0; i < msgs.length; i++) {
      const real_index = i + i;
      this.translateService.get('GUINDAILLE.HELP' + real_index).subscribe((res: string) => {
        msgs[i] = res;
      });
    }
    const out = this.getEmergencyText('GUINDAILLE', 'HELP18');
    const alert = this.alertCtrl.create({
      title: urg,
      message:
        this.getAlertEmergencyMsg(msg1, msg2, out, msg3, msg4, msg5, msg6, msg7, msg8, msg9),
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

  private getAlertEmergencyMsg(
    msg1: any, msg2: any, out: string, msg3: any, msg4: any, msg5: any, msg6: any, msg7: any, msg8: any, msg9: string
  ): string {
    return '<p> <strong>' +
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
      '<br>';
  }
}
