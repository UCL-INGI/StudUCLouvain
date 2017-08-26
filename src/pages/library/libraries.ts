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
import { LibrariesService } from '../../providers/libraries-service';
import { LibraryDetailsPage } from '../library-details/library-details';
import { LibraryItem } from '../../app/entity/libraryItem';
import { ConnectivityService } from '../../providers/connectivity-service';

/*
  Generated class for the Library page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-libraries',
  templateUrl: 'libraries.html'
})
export class LibrariesPage {
  //TODO : change name to LibrariesPage
  title: any;
  libraries: Array<LibraryItem> = [];
  searching: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public libService : LibrariesService,
    public connService : ConnectivityService
  ) {
    this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    this.searching = true;
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
      this.connService.presentConnectionAlert();
    }
  }

  goToLibDetails(lib: LibraryItem) {
    this.navCtrl.push(LibraryDetailsPage, { 'lib': lib });
  }
}
