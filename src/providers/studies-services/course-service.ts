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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Activity } from '../../app/entity/activity';
import { AdeService } from './ade-service';

@Injectable()
export class CourseService {

  constructor(
    public http: HttpClient,
    public ade: AdeService
  ) {
  }

  getCourseId(sessionId: string, acronym: string) {
    return this.getPromise(false, sessionId, acronym);
  }

  getPromise(isActivity: boolean, sessionId, filterField) {
    return new Promise<any>((resolve) => {
      const getMethod = isActivity ? this.ade.httpGetActivity : this.ade.httpGetCourseId;
      const extractMethod = isActivity ? this.extractActivity : this.extractCourseId;
      getMethod(sessionId, filterField).subscribe(data => resolve(extractMethod(data)));
    });
  }

  extractCourseId(data) {
    if (data.resources.resource !== undefined) {
      return data.resources.resource._id;
    }
  }

  getActivity(sessionId: string, courseId: string) {
    return this.getPromise(true, sessionId, courseId);
  }

  extractActivity(data): Activity[] {
    let activities: Activity[] = [];
    if (data.activities !== undefined) {
      let activitiesList = data.activities.activity;
      if (activitiesList.length === undefined) {
        activitiesList = [data.activities.activity];
      }
      for (let i = 0; i < activitiesList.length; i++) {
        activities = activities.concat(this.createNewActivities(activitiesList[i]));
      }
    }
    return activities;
  }

  createNewActivities(jsonActivity): Activity[] {
    const activities: Activity[] = [];
    const type: string = jsonActivity._type;
    let events = jsonActivity.events.event;
    if (events !== undefined) {
      events = this.handleSpecialCase(events);
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const participants = event.eventParticipants.eventParticipant;
        const students = this.getDatas(
          participants, '', 'trainee', '<br>&nbsp;&nbsp;&nbsp;&nbsp;'
        );
        const activity = new Activity(
          type,
          this.getDatas(participants, '', 'instructor', ''),
          students.substr(0, students.length - 28),
          this.createDate(event._date, event._startHour), this.createDate(event._date, event._endHour),
          this.getDatas(participants, ' ', 'classroom', ' '),
          type.indexOf('Examen') !== -1,
          event._name
        );
        activities.push(activity);
      }
    }
    return activities;
  }

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

  getDatas(participants, prefix: string, category: string, suffix: string) {
    let datas = prefix;
    for (let i = 0; i < participants.length; i++) {
      if (participants[i]._category === category) {
        datas = datas + participants[i]._name + suffix;
      }
    }
    return datas;
  }

  private handleSpecialCase(events: any) {
    if (events.length === undefined) {
      events = [events];
    }
    return events;
  }
}
