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

import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';

import { LibrariesService } from '../../providers/wso2-services/libraries-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';

import { LibraryItem } from '../../app/entity/libraryItem';

@IonicPage()
@Component({
  selector: 'page-libraries',
  templateUrl: 'libraries.html'
})
export class LibrariesPage {
  title: any;
  libraries: LibraryItem[];
  searching: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public libService : LibrariesService,
    public connService : ConnectivityService)
  {
    this.title = this.navParams.get('title');
    this.loadLibraries();

  }

  ionViewDidLoad() {
    //this.loadLibraries();
  }

  /*Reload the libraries if we refresh the page*/
  public doRefresh(refresher) {
    this.loadLibraries();
    refresher.complete();
  }

  /*Load libraries*/
  loadLibraries() {
    this.searching = true;
    //Check the connexion, if it's ok => load the data else go back to the previous page and pop an alert
    if(this.connService.isOnline()) {
      this.libService.loadLibraries().then(
        res => {
          let result:any = res;
          this.libraries = result.libraries;
          this.searching = false;
        }
      );
    } else {
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  /*Open the page with the details for the selectionned library*/
  goToLibDetails(lib: LibraryItem) {
    this.navCtrl.push('LibraryDetailsPage', { 'lib': lib});
  }
}
