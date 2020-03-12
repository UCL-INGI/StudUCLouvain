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

import { NavController, NavParams, Platform } from '@ionic/angular';
import { CacheService } from 'ionic-cache';

import { Component } from '@angular/core';

import { LibraryItem } from '../../app/entity/libraryItem';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { LibrariesService } from '../../providers/wso2-services/libraries-service';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'page-libraries',
  templateUrl: 'libraries.html'
})
export class LibrariesPage {
  title: any;
  libraries: LibraryItem[];
  searching = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public libService: LibrariesService,
    public connService: ConnectivityService,
    private cache: CacheService
  ) {
    this.title = this.navParams.get('title');
    this.cachedOrNot();
  }

  public doRefresh(refresher) {
    if (this.connService.isOnline()) {
      this.cache.removeItem('cache-libraries');
      this.loadLibraries('cache-libraries');
    } else {
      this.connService.presentConnectionAlert();
    }
    refresher.complete();
  }

  /*Load libraries*/
  loadLibraries(key?) {
    this.searching = true;
    // Check the connexion, if it's ok => load the data else go back to the previous page and pop an alert
    if (this.connService.isOnline()) {
      this.libService.loadLibraries().then(res => {
        const result: any = res;
        this.libraries = result.libraries;
        if (key) {
          this.cache.saveItem(key, this.libraries);
        }
        this.searching = false;
      });
    } else {
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  goToLibDetails(lib: LibraryItem) {
    const navigationExtras: NavigationExtras = {
      state: {
        items: lib
      }
    };
    this.navCtrl.navigateForward(['LibraryDetailsPage'], navigationExtras);
  }

  async cachedOrNot() {
    // this.cache.removeItem('cache-event');
    const key = 'cache-libraries';
    await this.cache
      .getItem(key)
      .then(data => {
        // this.presentLoading();
        this.libraries = data;
        this.searching = false;
      })
      .catch(() => {
        console.log('Oh no! My data is expired or doesn\'t exist!');
        this.loadLibraries(key);
      });
  }
}
