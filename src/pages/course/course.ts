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
import { NavController,NavParams  } from 'ionic-angular';
import { CourseService } from '../../providers/course-service';
import { Course } from '../../app/entity/course'

@Component({
  selector: 'page-course',
  templateUrl: 'course.html'
})
export class CoursePage {
  public course: Course;
  public week: string;
  public nextDeadline: string;
  public weekSchedule: any[];

  constructor(public navCtrl: NavController, public courseService: CourseService, public params:NavParams) {
    this.course = params.get("course");
    this.getADEInfos();
  }

  ionViewDidLoad() {
    console.log('Hello CoursePage Page');
  }

  getADEInfos(){
    //TODO link to ade real infos
    this.nextDeadline = "23/02/2017";
    this.week = "Week 3";
    this.weekSchedule = [
      {
        date: "15/02/2017",
        time: "10h45-12h45",
        hall: "Sainte-Barbe",
        imgURL: "assets/img/lecture_halls/saintebarbe.jpg"
      },
      {
        date: "16/02/2017",
        time: "08h30-10h30",
        hall: "Sainte-Barbe",
        imgURL: "assets/img/lecture_halls/saintebarbe.jpg"
      },
    ];
  }

  openMapTo(locString : string) {
    console.log(locString);
  }

}
