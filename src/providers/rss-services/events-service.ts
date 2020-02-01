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

import { Injectable } from '@angular/core';

import { EventItem } from '../../app/entity/eventItem';
import { UserService } from '../utils-services/user-service';
import { RssService } from './rss-service';

@Injectable()
export class EventsService {
  events: Array<EventItem> = [];
  allCategories: any = [];
  shownEvents = 0;


  url = 'https://louvainfo.be/calendrier/feed/calendar/';

  constructor(public user: UserService, public rssService: RssService) { }

  /*Get the events*/
  public getEvents(segment: string) {
    this.events = [];
    return this.rssService.load(this.url).then(result => {
      console.log(result);
      this.extractEvents(result);
      return {
        events: this.events,
        shownEvents: this.shownEvents
      };
    })
      .catch(error => {
        if (error === 1) {
          return this.getEvents(segment);
        } else {
          if (error === 2) {
            console.log('Loading events : GET req timed out > limit, suppose no news to be displayed');
          } else {
            console.log('Error loading events : ' + error);
          }
          return {
            events: [],
            shownEvents: 0
          };
        }
      });
  }

  /*Extraction of events*/
  private extractEvents(data: any) {
    this.shownEvents = 0;
    const maxDescLength = 20;
    if (data === undefined) {
      console.log('Error events data undefined!!!');
      return;
    }
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const trimmedDescription = item.description.length > maxDescLength ? item.description.substring(0, 80) + '...' : item.description;
      let favorite = false;
      const hidden = false;
      let iconCategory = 'assets/icon/events-icon/other.png';
      if (this.user.hasFavorite(item.guid)) {
        favorite = true;
      }
      if (item.category) {
        if (this.allCategories.indexOf(item.category) < 0) {
          this.allCategories.push(item.category);
        }
        iconCategory = this.getIconCategory(item.category);
      }
      this.shownEvents++;
      const startDate = this.createDateForEvent(item.date_begin);
      const endDate = this.createDateForEvent(item.date_end);
      const newEventItem = new EventItem(item.description, item.link, item.title, item.photo, trimmedDescription, item.location,
        hidden, favorite, item.guid, startDate, endDate, item.category, iconCategory);
      this.events.push(newEventItem);
    }
  }

  /*Get the good icon for a catagory*/
  public getIconCategory(category: string): string {
    switch (category.toLowerCase()) {
      case 'sensibilisation': {
        return 'assets/icon/events-icon/sensibilisation.png';
      }
      case 'animation': {
        return 'assets/icon/events-icon/animation.png';
      }
      case 'culturel et artistique': {
        return 'assets/icon/events-icon/cultural.png';
      }
      case 'guindaille': {
        return 'assets/icon/events-icon/party.png';
      }
      case 'sportif': {
        return 'assets/icon/events-icon/sports.png';
      }
      case 'services et aides': {
        return 'assets/icon/events-icon/services.png';
      }
      default: {
        return 'assets/icon/events-icon/other.png';
      }
    }
  }

  /*Return a date in good form by splitting for the event*/
  private createDateForEvent(str: string): Date {
    // new Date(Year : number, (month-1) : number, day : number)
    const dateTimeSplit = str.split(' ');
    const dateSplit = dateTimeSplit[0].split('/');
    const timeSplit = dateTimeSplit[1].split(':');

    const year = parseInt(dateSplit[2]);
    const month = parseInt(dateSplit[1]) - 1;
    const day = parseInt(dateSplit[0]);
    const hours = parseInt(timeSplit[0]);
    const minutes = parseInt(timeSplit[1]);

    return new Date(year, month, day, hours, minutes);
  }

  /*Return the items of filter*/
  public filterItems(myList, searchTerm) {
    return myList.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
