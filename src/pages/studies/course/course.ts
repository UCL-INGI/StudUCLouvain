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
import { NavController, NavParams  } from 'ionic-angular';
import { CourseService } from '../../../providers/studies-services/course-service';
import { Course } from '../../../app/entity/course'
import { Activity } from '../../../app/entity/activity'

@Component({
  selector: 'page-course',
  templateUrl: 'course.html'
})
export class CoursePage {
  sessionId : string = this.navParams.get('sessionId');
  course : Course = this.navParams.get("course");


  constructor(public navCtrl: NavController,
    public courseService: CourseService,
    public navParams:NavParams) {
    //this.getADEInfos();
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
            let activities = data;
            this.course.activities = data;
          }
        )
      }
    )
  }

}
