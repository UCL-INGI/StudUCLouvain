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
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SportItem } from '../../../app/entity/sportItem';
import { UserService } from '../../../providers/utils-services/user-service';

/*
  Generated class for the Details page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sports-details',
  templateUrl: 'sports-details.html'
})
export class SportsDetailsPage {
  sport: SportItem;

  constructor(public navCtrl: NavController,
    public user: UserService,
    public toastCtrl: ToastController,
    private navParams: NavParams) {
    this.sport = navParams.get('sport');
  }

  public openPage(url: string) {
    //InAppBrowser.open(url, '_blank');
    window.open(url, '_blank');
  }

  addFavorite(sport : SportItem){
    if(!this.user.hasFavoriteS(sport)){
      this.user.addFavoriteS(sport);
      let toast = this.toastCtrl.create({
        message: 'Favoris ajouté',
        duration: 3000
      });
      toast.present();
    }

  }

}
