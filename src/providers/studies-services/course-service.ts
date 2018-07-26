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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdeService } from './ade-service';
import 'rxjs/add/operator/map';
import { Activity } from '../../app/entity/activity';

@Injectable()
export class CourseService {

    constructor(
      public http: HttpClient,
      public ade : AdeService) {
    }

    /*Get the course ID for the acronym of the course*/
    getCourseId(sessionId : string, acronym : string){
      return new Promise <string>( (resolve, reject) => {
        this.ade.httpGetCourseId(sessionId, acronym).subscribe(
          data => {
            resolve(this.extractCourseId(data));
          }
        )
      })
    }

    /*Extract the course ID*/
    extractCourseId(data){
      return data.resources.resource._id;
    }

    /*Get activity for a course ID obtained by getting this from a course selected by the user*/
    getActivity(sessionId : string, courseId : string){
      return new Promise <Activity[]>( (resolve, reject) => {
        this.ade.httpGetActivity(sessionId, courseId).subscribe(
          data => {
            resolve(this.extractActivity(data));
          }
        )
      })
    }

    /*Extract the activity*/
    extractActivity(data) : Activity[]{
      let activities : Activity[] = [];
      let activitiesList = data.activities.activity
      console.log(data);
      for (let i =0; i< activitiesList.length ;i++){
        let activityElem = activitiesList[i];
        let newActivities : Activity[] = this.createNewActivities(activityElem);
        activities = activities.concat(newActivities);
      }
      return activities;
    }

    /*For each activity collect the right variables to be able to display them*/
    createNewActivities(jsonActivity) : Activity[] {
      let activities : Activity[] = [];
      let type : string = jsonActivity._type;
      let isExam = type.indexOf('Examen') !== -1;
      let events = jsonActivity.events.event;
      if(events !== undefined){
        for(let i=0; i<events.length; i++){
          let event = events[i];
          let endHour = event._endHour;
          let startHour = event._startHour;
          let date = event._date
          let participants = event.eventParticipants.eventParticipant
          let teachers = this.getTeachers(participants)
          let students = this.getStudents(participants)
          let auditorium = this.getAuditorium(participants)
          let start = this.createDate(date, startHour);
          let end = this.createDate(date, endHour);
          let name = event._name;
          let activity = new Activity(type, teachers, students, start, end, auditorium,isExam,name);
          activities.push(activity);
        }
      }
      if(isExam && events !== undefined){
        console.log(events);
          let event = events;
          let endHour = event._endHour;
          let startHour = event._startHour;
          let date = event._date
          let participants = event.eventParticipants.eventParticipant
          let teachers = this.getTeachers(participants)
          let students = this.getStudents(participants)
          let auditorium = this.getAuditorium(participants)
          let start = this.createDate(date, startHour);
          let end = this.createDate(date, endHour);
          let name = event._name;
          let activity = new Activity(type, teachers, students, start, end, auditorium,isExam,name);
          activities.push(activity);
      }
      return activities;
    }

    /*Create a date*/
    createDate(date : string, hour : string) : Date{
      let splitDate = date.split("/")
      let splitHour = hour.split(":")
      let newdate : Date = new Date(parseInt(splitDate[2]),
                            parseInt(splitDate[1])-1,
                            parseInt(splitDate[0]),
                            parseInt(splitHour[0]),
                            parseInt(splitHour[1])
                            );
      return newdate;
    }

    /*Get teacher from the participants*/
    getTeachers(participants) : string {
      let teachers : string = " ";
      for(let i=0; i < participants.length; i++){
        if(participants[i]._category === "instructor"){
          teachers = teachers + participants[i]._name + "/";
        }
      }
      return teachers;
    }

    /*Get students accepted at a course in the participants*/
    getStudents(participants) : string {
      let students : string = " ";
      for(let i=0; i < participants.length; i++){
        if(participants[i]._category === "trainee"){
          students = students + participants[i]._name + "/";
        }
      }
      return students;
    }

    /*Get Auditorium in which the course is presented*/
    getAuditorium(participants) : string {
      let auditorium : string = " ";
      for(let i=0; i < participants.length; i++){
        if(participants[i]._category === "classroom"){
          auditorium = auditorium + participants[i]._name + " ";
        }
      }
      return auditorium;
    }



}
