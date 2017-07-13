/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

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

/*
  Generated class for the Library page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {
  //TODO : change name to LibrariesPage
  title: any;
  libraries: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public libService : LibrariesService) {
    this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    this.libService.loadLibraries().then(
      res => {
        this.libraries = res;
      }
    );
  }

  goToLibDetails(id: any) {
    this.navCtrl.push(LibraryDetailsPage, { 'id': id });
  }
}
