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
import { NavController, NavParams, IonItemSliding, ToastController, AlertController, ModalController  } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../../services/utils-services/user-service';

import { Calendar } from '@ionic-native/calendar/ngx';

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

    console.log(this.schedule);
    console.log(new Date("2017-10-17"));
  }


  ngOnInit() {

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

  /*Add an activity (a session of the course) to the calendar of the smartphone*/
  addToCalendar(slidingItem : IonItemSliding, activity : any){
    let options:any = {
      firstReminderMinutes:15
    };
    let message:string;
    this.translateService.get('COURSE.MESSAGE').subscribe((res:string) => {message=res;});
    this.calendar.createEventWithOptions(activity.name +" : " + activity.type,
      activity.entitycode, null, new Date(activity.eventstarttime),
      new Date(activity.eventendtime), options).then(() => {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000
        }).then(toast => toast.present());
        slidingItem.close();
    });
      this.alert();
  }

    /*Create and display the alert that say that if a course is add to the calendar if this course is changed, the calendar doesn't take that in account*/
  alert(){
    let title:string;
    let message:string;
    this.translateService.get('COURSE.WARNING').subscribe((res:string) => {title=res;});
    this.translateService.get('COURSE.MESSAGE3').subscribe((res:string) => {message=res;});
         let disclaimerAlert = this.alertCtrl.create({
            header: title,
            message: message,
            buttons: [
                {
                    text: "OK",
                    handler: data => {
                    }
                }
            ]
        }).then(alert => alert.present());
  }


}
