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
import { LibrariesService } from '../../providers/wso2-services/libraries-service';
import { LibraryDetailsPage } from './library-details/library-details';
import { LibraryItem } from '../../app/entity/libraryItem';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';

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
  title: any;
  librariesItems: LibraryItem[];
  libraries: LibraryItem[];
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


  public doRefresh(refresher) {
    this.loadLibraries();
    refresher.complete();
  }

  ionViewDidLoad() {
    this.loadLibraries();
  }

  loadLibraries() {
    this.searching = true;
    if(this.connService.isOnline()) {
      this.libService.loadLibraries().then(
        res => {
          let result:any = res;
          this.libraries = result.libraries.map(obj => {return obj});
          //this.libraries = result.libraries.map(lib => lib.name);
          this.searching = false;
        }
      );
    } else {
      this.searching = false;
      this.connService.presentConnectionAlert();
    }
  }

  goToLibDetails(lib: any) {
    this.navCtrl.push(LibraryDetailsPage, { 'lib': lib});
  }
}
