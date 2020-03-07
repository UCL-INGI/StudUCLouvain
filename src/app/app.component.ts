/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
    This file is part of Stud.UCLouvain
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    Stud.UCLouvain is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Stud.UCLouvain is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Stud.UCLouvain.  If not, see <http://www.gnu.org/licenses/>.
*/

import { AlertController, IonicApp, MenuController, Nav, Platform } from 'ionic-angular';
import { CacheService } from 'ionic-cache';

import { Component, ViewChild } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Market } from '@ionic-native/market';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
import { UserService } from '../providers/utils-services/user-service';
import { Wso2Service } from '../providers/wso2-services/wso2-service';
import { Page } from "./entity/page";
import { SettingsProvider } from "../providers/utils-services/settings-service";

// declare var TestFairy: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  selectedTheme: string;
  rootPage = ''; // = 'HomePage';
  alertPresented: any;
  page: any;
  homePage;
  checked = false;
  campusPages: Array<Page>;
  studiePages: Array<Page>;
  toolPages: Array<Page>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public market: Market,
    private appAvailability: AppAvailability,
    private iab: InAppBrowser,
    private device: Device,
    private alertCtrl: AlertController,
    private user: UserService,
    public translateService: TranslateService,
    private ionicApp: IonicApp,
    private wso2Service: Wso2Service,
    public cache: CacheService,
    private settings: SettingsProvider
  ) {
    console.log('Startin App');
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.user.getStringData('campus');
    this.alertPresented = false;
    this.initializeApp();
    this.getPages();
    platform.ready().then(() => {
      this.wso2Service.getToken();
      translateService.setDefaultLang('fr');
      this.user.storage.get('lan').then(data => {
        translateService.use(data !== null ? data : 'fr');
      });
      cache.setDefaultTTL(60 * 60 * 2);
      cache.setOfflineInvalidate(false);
      // this.user.storage.set('first',null);
      this.user.storage.get('first').then(data => {
        if (data === null) {
          this.rootPage = 'TutoPage';
          this.user.storage.set('first', false);
        } else {
          this.rootPage = 'HomePage';
        }
      });
    });
  }

  getPagesSection(titles: Array<string>, components: Array<string>, icons: Array<string>) {
    const pages = [];
    for (let i = 0; i < titles.length; i++) {
      const is_rest_page = titles[i] === 'RESTAURANT';
      pages.push(new Page(
        'MENU.' + titles[i],
        components[i] + 'Page',
        './assets/img/' + icons[i] + '.png',
        is_rest_page ? 'id1156050719' : null,
        is_rest_page ? 'com.apptree.resto4u' : null,
        is_rest_page ? 'apptreeresto4u://' : null,
        is_rest_page ? 'https://uclouvain.be/fr/decouvrir/resto-u' : null
    ));
    }
    return pages;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });

    this.platform.registerBackButtonAction(() => {
      const activePortal =
        this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._toastPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
      }
      if (this.menu.isOpen()) {
        this.menu.close();
      }
      this.nav.length() === 1 ? this.confirmExitApp() : this.nav.pop();
    });
  }

  confirmExitApp() {
    if (this.nav.getActive().instance instanceof HomePage) {
      if (!this.alertPresented) {
        this.alertPresented = true;
        const confirmAlert = this.alertCtrl.create({
          title: 'Fermeture',
          message: 'Désirez-vous quitter l\'application ?',
          buttons: [
            {
              text: 'Annuler',
              handler: () => this.alertPresented = false
            },
            {
              text: 'Quitter',
              handler: () => this.platform.exitApp()
            }
          ]
        });
        confirmAlert.present();
      }
    } else {
      this.openRootPage(this.homePage);
    }
  }

  disclaimer() {
    const disclaimerAlert = this.alertCtrl.create({
      title: 'Avertissement',
      message:
        '<p>Version beta de l\'application Stud@UCLouvain.</p> ' +
        '<p>Cette version n\'est pas publique et est uniquement destinée à une phase de test.</p>',
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
    disclaimerAlert.present();
  }

  openRootPage(page) {
    const test = this.nav.getActive().instance;
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.page = page;
    if (!(test instanceof HomePage && page === this.homePage)) {
      if (page.iosSchemaName != null && page.androidPackageName != null) {
        this.launchExternalApp(
          page.iosSchemaName,
          page.androidPackageName,
          page.appUrl,
          page.httpUrl
        );
      } else if (page !== this.homePage) {
        if (this.nav.length() > 1) {
          this.nav.pop();
        }
        this.nav.push(page.component, {title: page.title});
      }
    }
  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string) {
    let app: string;
    let check: string;
    if (this.device.platform === 'iOS') {
      app = iosSchemaName;
      check = appUrl;
    } else if (this.device.platform === 'Android') {
      app = androidPackageName;
      check = app;
    } else {
      const browser = this.iab.create(httpUrl, '_system');
      browser.close();
    }
    this.appAvailability.check(check).then(() => {
        const browser = this.iab.create(appUrl, '_system');
        browser.close();
      },
      () =>  this.market.open(app)
    );
  }

  private getPages() {
    this.homePage = new Page(
      'MENU.HOME',
      'HomePage',
      './assets/img/home.png',
      null, null, null, null
    );

    const campusTitles = ['NEWS', 'EVENTS', 'SPORTS'];
    const campusComp = ['News', 'Events', 'Sports'];
    const campusIcon = ['news', 'event', 'sport'];
    this.campusPages = this.getPagesSection(campusTitles, campusComp, campusIcon);

    const studieTitles = ['STUDIES', 'LIBRARY', 'HELP'];
    const studieComp = ['Studies', 'Libraries', 'Support'];
    const studieIcon = ['études', 'biblio', 'support'];
    this.studiePages = this.getPagesSection(studieTitles, studieComp, studieIcon);

    const toolsTitles = ['PARTY', 'MAP', 'RESTAURANT', 'MOBILITY', 'PARAM', 'CREDITS'];
    const toolsComp = ['Guindaille', 'Map', 'Restaurant', 'Mobility', 'Param', 'Credit'];
    const toolsIcon = ['g2', 'cartes', 'resto', 'mobilité', 'setting', 'signature'];
    this.toolPages = this.getPagesSection(toolsTitles, toolsComp, toolsIcon);
  }
}
