/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
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
import { NavController, NavParams, ItemSliding, ToastController, AlertController, ModalController  } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { StudentService } from '../../../providers/wso2-services/student-service';
import { UserService } from '../../../providers/utils-services/user-service';

import { Course } from '../../../app/entity/course';
import { Activity } from '../../../app/entity/activity'
import { Calendar } from '@ionic-native/calendar';

@IonicPage()
@Component({
  selector: 'page-hebdo',
  templateUrl: 'hebdo.html'
})

export class HebdoPage {
  schedule : Array<any> = this.navParams.get('schedule');
  shownGroup = null;

  constructor(public navCtrl: NavController,
              private calendar: Calendar,
              public toastCtrl: ToastController,
              public userS:UserService,
              public modalCtrl: ModalController,
              private alertCtrl : AlertController,
              private translateService: TranslateService,
              public navParams:NavParams)
  {
    function compare(a,b) {
      if (parseInt(a.date.substr(0,2)) < parseInt(b.date.substr(0,2)))
        return -1;
      if (parseInt(a.date.substr(0,2)) > parseInt(b.date.substr(0,2)))
        return 1;
      return 0;
    }
    this.schedule = this.schedule.sort(compare)
    console.log(this.schedule);
  }

  /*Display the available sessions for a course*/
  ionViewDidLoad() {

  }

  /*Display or close the group of sports for one day*/
  toggleGroup(group) {
      if (this.isGroupShown(group)) {
          this.shownGroup = null;
      } else {
          this.shownGroup = group;
      }
  }

  /*Check if the list is shown or not*/
  isGroupShown(group) {
      return this.shownGroup === group;
  }


}
