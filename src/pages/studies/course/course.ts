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
import { NavController, NavParams, ItemSliding, ToastController  }
  from 'ionic-angular';
import { CourseService }
  from '../../../providers/studies-services/course-service';
import { Course } from '../../../app/entity/course'
import { Activity } from '../../../app/entity/activity'
import { Calendar } from '@ionic-native/calendar';

@Component({
  selector: 'page-course',
  templateUrl: 'course.html'
})
export class CoursePage {
  sessionId : string = this.navParams.get('sessionId');
  course : Course = this.navParams.get("course");
  segment = 'Cours magistral';

  constructor(public navCtrl: NavController,
    public courseService: CourseService,
    private calendar: Calendar,
    public toastCtrl: ToastController,
    public navParams:NavParams) {
  }

  ionViewDidLoad() {
    this.getCourse(this.sessionId, this.course.acronym)
  }

  getCourse(sessionId : string, acronym : string){
    this.courseService.getCourseId(sessionId, acronym).then(
      data => {
        let courseId = data;
        this.courseService.getActivity(sessionId, courseId).then(
          data => {
            this.course.activities = data.sort(
              (a1,a2) => a1.start.valueOf() - a2.start.valueOf()
            ).filter(
                activitie => activitie.end.valueOf() > Date.now().valueOf()
              ); // display only activities finished after now time
          }
        )
      }
    )
  }

  addToCalendar(slidingItem : ItemSliding, activity : Activity){
    let options:any = {
    };

    this.calendar.createEventWithOptions(this.course.name +" : " + activity.type,
      activity.auditorium, null, activity.start,
      activity.end, options).then(() => {
        let toast = this.toastCtrl.create({
          message: 'Activité ajoutée',
          duration: 3000
        });
        toast.present();
        slidingItem.close();
    });
  }

}
