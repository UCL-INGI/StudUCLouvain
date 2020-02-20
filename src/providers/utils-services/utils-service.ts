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
import {AlertController, ItemSliding, Loading, LoadingController, ToastController} from 'ionic-angular';

import {Injectable} from '@angular/core';
import {AppAvailability} from '@ionic-native/app-availability';
import {Device} from '@ionic-native/device';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {Market} from '@ionic-native/market';
import {TranslateService} from '@ngx-translate/core';

import {UserService} from './user-service';

@Injectable()
export class UtilsService {
  loading: Loading;
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
  ) {
  }

  presentLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
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

  getLanguageAlertInputs(fr, en, check2) {
    return [
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
    ];
  }

  getText(page: string, name: string) {
    let text: string;
    this.translateService.get(page + '.' + name).subscribe((res: string) => {
      text = res;
    });
    return text;
  }

  removeFavorite(slidingItem: ItemSliding, itemData: any, title: string, isSport: boolean) {
    const page = isSport ? 'SPORTS' : 'EVENTS';
    const number = isSport ? 2 : 3;
    const message = this.getText(page, 'MESSAGEFAV' + number);
    const cancel = this.getText(page, 'CANCEL');
    const delet = this.getText(page, 'DEL');
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: cancel
        },
        {
          text: delet,
          handler: () => {
            slidingItem.close();
            this.user.removeFavorite(itemData.guid, isSport ? 'listSports' : 'listEvents');
          }
        }
      ]
    });
    alert.present();
  }

  favoriteAdded(slidingItem: ItemSliding, page: string) {
    const key = page === 'EVENTS' ? 'MESSAGEFAV2' : 'FAVADD';
    const message = this.getText(page, key);
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
    slidingItem.close();
  }

  addFavorite(slidingItem: ItemSliding, itemData: any, page: string) {
    const isSport = page === 'SPORTS';
    const hasFav = isSport ? this.user.hasFavoriteS(itemData.guid) : this.user.hasFavorite(itemData.guid);
    if (hasFav) {
      const message = this.getText(page, 'MESSAGEFAV');
      this.removeFavorite(slidingItem, itemData, message, isSport);
    } else {
      this.user.addFavorite(itemData.guid, isSport ? 'listSports' : 'listEvents');
      this.favoriteAdded(slidingItem, page);
    }
  }
}
