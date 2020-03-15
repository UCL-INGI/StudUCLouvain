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
import {
  AlertController,
  IonItemSliding,
  IonList,
  LoadingController,
  NavController,
  ToastController
} from '@ionic/angular';

import { Injectable } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Market } from '@ionic-native/market/ngx';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from './user-service';
import { Page } from "../../app/entity/page";
import { NavigationExtras } from "@angular/router";
import * as xml2js from 'xml2js';

@Injectable()
export class UtilsService {
  loading: any;
  shownGroup = null;

  constructor(
    private loadingCtrl: LoadingController,
    private device: Device,
    private appAvailability: AppAvailability,
    private iab: InAppBrowser,
    private market: Market,
    private translateService: TranslateService,
    public alertCtrl: AlertController,
    public user: UserService,
    public toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    console.log("Starting Utils Provider");
  }

  async presentLoading() {
    if (!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message: 'Please wait...'
      });
      return await this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  launchExternalApp(page) {
    let app: string;
    let check: string;
    if (this.device.platform === 'iOS') {
      app = page.iosSchemaName;
      check = page.appUrl;
    } else if (this.device.platform === 'Android') {
      app = page.androidPackageName;
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

  getLanguageAlertInputs(check2) {
    const type: any = "radio";
    return [
      {
        name: 'radioFr',
        type: type,
        label: this.getText('HOME', 'FR'),
        value: 'fr',
        checked: check2 === 'fr' || check2 === undefined
      },
      {
        name: 'radioEn',
        type: type,
        label: this.getText('HOME', 'EN'),
        value: 'en',
        checked: check2 === 'en'
      }
    ];
  }

  getText(page: string, name: string) {
    let text = '';
    this.translateService.get(page + '.' + name).subscribe((res: string) => {
      text = res;
    });
    return text;
  }

  getTexts(page: string, keys: Array<string>) {
    let values = [];
    this.translateService.get(keys.map(key => page + '.' + key)).subscribe((translations: any) => {
      Object.keys(translations).forEach(key => {
        values.push(translations[key]);
      });
    });
    return values;
  }

  async removeFavorite(list: IonList, itemData: any, title: string, isSport: boolean) {
    const page = isSport ? 'SPORTS' : 'EVENTS';
    const number = isSport ? 2 : 3;
    const alert = await this.alertCtrl.create({
      header: title,
      message: this.getText(page, 'MESSAGEFAV' + number),
      buttons: [
        {
          text: this.getText(page, 'CANCEL')
        },
        {
          text: this.getText(page, 'DEL'),
          handler: () => {
            list.closeSlidingItems();
            this.user.removeFavorite(itemData.guid, isSport ? 'listSports' : 'listEvents');
          }
        }
      ]
    });
    return await alert.present();
  }

  async favoriteAdded(list: IonList, page: string) {
    const key = page === 'EVENTS' ? 'MESSAGEFAV2' : 'FAVADD';
    const toast = await this.toastCtrl.create({
      message: this.getText(page, key),
      duration: 3000
    });
    list.closeSlidingItems();
    return await toast.present();
  }

  addFavorite(list: IonList, itemData: any, page: string) {
    const isSport = page === 'SPORTS';
    const hasFav = isSport ? this.user.hasFavoriteS(itemData.guid) : this.user.hasFavorite(itemData.guid);
    if (hasFav) {
      const message = this.getText(page, 'MESSAGEFAV');
      this.removeFavorite(list, itemData, message, isSport);
    } else {
      this.user.addFavorite(itemData.guid, isSport ? 'listSports' : 'listEvents');
      this.favoriteAdded(list, page);
    }
  }

  getPageObject(
    component,
    title: string = component.toUpperCase(),
    iosSchemaName?: string, androidPackageName?: string, appUrl?: string, httpUrl?: string
  ) {
    return new Page(
      'MENU.' + title,
      component + 'Page',
      null,
      iosSchemaName ? iosSchemaName : null,
      androidPackageName ? androidPackageName : null,
      appUrl ? appUrl : null,
      httpUrl ? httpUrl : null
    );
  }

  goToDetail(item: any, page: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        items: item
      }
    };
    // FIXME: Improve
    this.navCtrl.navigateForward([page], navigationExtras);
  }

  async presentToast(message: string, slidingItem?: IonItemSliding) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle'
    });
    if (slidingItem !== undefined) {
      await slidingItem.close();
    }
    return await toast.present();
  }

  convertXmlToJson(data: string): Object {
    return xml2js.parseString(data, {explicitArray: false}, (error, result) => {
      if (error) {
        throw new Error(error);
      }
      return result;
    });
  }

}
