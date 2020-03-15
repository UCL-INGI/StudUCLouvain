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

import {
  ActionSheetController,
  AlertController,
  IonRouterOutlet,
  MenuController,
  ModalController,
  NavController,
  Platform,
  PopoverController
} from '@ionic/angular';
import { CacheService } from 'ionic-cache';

import { Component, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../services/utils-services/user-service';
import { Wso2Service } from '../services/wso2-services/wso2-service';
import { Page } from "./entity/page";
import { SettingsProvider } from "../services/utils-services/settings-service";
import { NavigationExtras, Router } from "@angular/router";
import { UtilsService } from "../services/utils-services/utils-service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  selectedTheme: string;
  alertPresented: any;
  page: any;
  homePage;
  checked = false;
  campusPages: Array<Page>;
  studiePages: Array<Page>;
  toolPages: Array<Page>;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    private alertCtrl: AlertController,
    private router: Router,
    private user: UserService,
    public translateService: TranslateService,
    private wso2Service: Wso2Service,
    public cache: CacheService,
    private settings: SettingsProvider,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private nav: NavController,
    private utilsService: UtilsService
  ) {
    console.log('Startin App');
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.user.getStringData('campus');
    this.alertPresented = false;
    this.initializeApp();
    this.getPages();
    platform.ready().then(() => {
      translateService.setDefaultLang('fr');
      this.user.storage.get('lan').then(data => {
        translateService.use(data !== null ? data : 'fr');
      });
      cache.setDefaultTTL(60 * 60 * 2);
      cache.setOfflineInvalidate(false);
      // this.user.storage.set('first',null);
      this.user.storage.get('first').then((data) => {
        if (data === null) {
          this.user.storage.set('first', false);
          this.nav.navigateForward('/tutos');
        } else {
          this.nav.navigateForward('/');
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

    this.platform.backButton.subscribe(async () => {
      this.getElementToClose(this.actionSheetCtrl);
      this.getElementToClose(this.popoverCtrl);
      this.getElementToClose(this.modalCtrl);
      try {
        const element = await this.menu.getOpen();
        if (element) {
          this.menu.close();
        }
      } catch (error) {
        console.log(error);
      }
      this.confirmExitApp();
    });
  }

  async getElementToClose(element: any) {
    try {
      const elem = await element.getTop();
      if (elem) {
        elem.dismiss();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async confirmExitApp() {
    this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
      if (outlet && outlet.canGoBack()) {
        outlet.pop();
      } else {
        if (this.router.url === 'home') {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //  work in ionic 4
          } else {
            this.exitToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      }
    });
  }

  async exitToast() {
    this.alertPresented = true;
    const confirmAlert = await this.alertCtrl.create({
      header: 'Fermeture',
      message: 'Désirez-vous quitter l\'application ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => this.alertPresented = false
        },
        {
          text: 'Quitter',
          handler: () => navigator['app'].exitApp()
        }
      ]
    });
    await confirmAlert.present();
  }

  openRootPage(page) {
    this.menu.close();
    this.page = page;
    if (page.iosSchemaName != null && page.androidPackageName != null) {
      this.utilsService.launchExternalApp(page);
    } else {
      const navigationExtras: NavigationExtras = {
        state: {
          title: page.title,
        }
      };
      this.nav.navigateForward([page.component], navigationExtras);
    }
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
