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
import { TranslateService } from '@ngx-translate/core';
import { IonicPage } from 'ionic-angular';

import { UserService } from '../../../providers/utils-services/user-service';

import { EventItem } from '../../../app/entity/eventItem';

@IonicPage()
@Component({
  selector: 'page-events-details',
  templateUrl: 'events-details.html'
})
export class EventsDetailsPage {
  event: EventItem;

  constructor(public navCtrl: NavController,
    public user: UserService,
    private translateService: TranslateService,
    public toastCtrl: ToastController,
    private navParams: NavParams) {
    this.event = navParams.get('event');
  }

  public openPage(url: string) {
    window.open(url, '_blank');
  }

  addFavorite(event : EventItem){
    let message:string;
    this.translateService.get('EVENTS.MESSAGEFAV2').subscribe((res:string) => {message=res;});

    if(!this.user.hasFavorite(event.guid)){
      this.user.addFavorite(event.guid);
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
    }

  }

}
