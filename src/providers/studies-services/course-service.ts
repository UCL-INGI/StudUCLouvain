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

import 'rxjs/add/operator/map';

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Activity} from '../../app/entity/activity';
import {AdeService} from './ade-service';

@Injectable()
export class CourseService {

  constructor(
    public http: HttpClient,
    public ade: AdeService) {
  }

  /*Get the course ID for the acronym of the course*/
  getCourseId(sessionId: string, acronym: string) {
    return new Promise<string>((resolve, reject) => {
      this.ade.httpGetCourseId(sessionId, acronym).subscribe(
        data => {
          resolve(this.extractCourseId(data));
        }
      );
    });
  }

  /*Extract the course ID*/
  extractCourseId(data) {

    if (data.resources.resource !== undefined) {
      return data.resources.resource._id;
    }
  }

  /*Get activity for a course ID obtained by getting this from a course selected by the user*/
  getActivity(sessionId: string, courseId: string) {
    return new Promise<Activity[]>((resolve, reject) => {
      this.ade.httpGetActivity(sessionId, courseId).subscribe(
        data => {
          resolve(this.extractActivity(data));
        }
      );
    });
  }

  /*Extract the activity*/
  extractActivity(data): Activity[] {
    let activities: Activity[] = [];
    if (data.activities !== undefined) {
      let activitiesList = data.activities.activity;
      if (activitiesList.length === undefined) {
        activitiesList = [];
        activitiesList.push(data.activities.activity);
      }
      for (let i = 0; i < activitiesList.length; i++) {
        const activityElem = activitiesList[i];
        const newActivities: Activity[] = this.createNewActivities(activityElem);
        activities = activities.concat(newActivities);
      }
    }
    return activities;
  }

  /*For each activity collect the right variables to be able to display them*/
  createNewActivities(jsonActivity): Activity[] {
    const activities: Activity[] = [];
    const type: string = jsonActivity._type;
    const isExam = type.indexOf('Examen') !== -1;
    let events = jsonActivity.events.event;
    if (events !== undefined) {
      events = this.handleSpecialCase(events);

      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const endHour = event._endHour;
        const startHour = event._startHour;
        const date = event._date;
        const participants = event.eventParticipants.eventParticipant;
        const teachers = this.getTeachers(participants);
        const students = this.getStudents(participants);
        const auditorium = this.getAuditorium(participants);
        const start = this.createDate(date, startHour);
        const end = this.createDate(date, endHour);
        const name = event._name;
        const activity = new Activity(type, teachers, students, start, end, auditorium, isExam, name);
        activities.push(activity);
      }
    }
    return activities;
  }

  /*Create a date*/
  createDate(date: string, hour: string): Date {
    const splitDate = date.split('/');
    const splitHour = hour.split(':');
    const newdate: Date = new Date(parseInt(splitDate[2]),
      parseInt(splitDate[1]) - 1,
      parseInt(splitDate[0]),
      parseInt(splitHour[0]),
      parseInt(splitHour[1])
    );
    return newdate;
  }

  /*Get teacher from the participants*/
  getTeachers(participants): string {
    let teachers = '';
    for (let i = 0; i < participants.length; i++) {
      if (participants[i]._category === 'instructor') {
        teachers = teachers + participants[i]._name + '/';
      }
    }
    return teachers;
  }

  /*Get students accepted at a course in the participants*/
  getStudents(participants): string {
    let students = '';
    for (let i = 0; i < participants.length; i++) {
      if (participants[i]._category === 'trainee') {
        students = students + participants[i]._name + '<br>&nbsp;&nbsp;&nbsp;&nbsp;';
      }
    }

    return students.substr(0, students.length - 28);
  }

  /*Get Auditorium in which the course is presented*/
  getAuditorium(participants): string {
    let auditorium = ' ';
    for (let i = 0; i < participants.length; i++) {
      if (participants[i]._category === 'classroom') {
        auditorium = auditorium + participants[i]._name + ' ';
      }
    }
    return auditorium;
  }

  private handleSpecialCase(events: any) {
    if (events.length === undefined) {
      const temp = events;
      events = [];
      events.push(temp);
    }
    return events;
  }


}
