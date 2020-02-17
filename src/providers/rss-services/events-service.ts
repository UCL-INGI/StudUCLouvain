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
  maxDescLength = 20;


  url = 'https://louvainfo.be/calendrier/feed/calendar/';

  constructor(public user: UserService, public rssService: RssService) { }

  public getEvents(segment: string) {
    this.events = [];
    return this.rssService.load(this.url).then(result => {
      if (result === undefined) {
        console.log('Error events data undefined!!!');
        return;
      }
      this.extractEvents(result);
      return {
        events: this.events,
        shownEvents: this.shownEvents,
        categories: this.allCategories
      };
    }).catch(error => {
      if (error === 1) {
        return this.getEvents(segment);
      } else if (error === 2) {
        console.log('Loading events : GET req timed out > limit, suppose no news to be displayed');
      } else {
        console.log('Error loading events : ' + error);
      }
      return {
        events: [],
        shownEvents: 0,
        categories: []
      };
    });
  }

  private extractEvents(data: any) {
    this.shownEvents = 0;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const trimmedDescription = item.description.length > this.maxDescLength ?
        item.description.substring(0, 80) + '...' : item.description;
      const favorite = this.user.hasFavorite(item.guid);
      if (item.category && this.allCategories.indexOf(item.category) < 0) {
        this.allCategories.push(item.category);
      }
      const iconCategory = this.getIconCategory(item.category);
      this.shownEvents++;
      const startDate = this.createDateForEvent(item.date_begin);
      const endDate = this.createDateForEvent(item.date_end);
      const newEventItem = new EventItem(item.description, item.link, item.title, item.photo, trimmedDescription, item.location,
        false, favorite, item.guid, startDate, endDate, item.category, iconCategory);
      this.events.push(newEventItem);
    }
  }

  public getIconCategory(category: string): string {
    const icons = {
      'sensibilisation': 'sensibilisation.png',
      'animation': 'animation.png',
      'culturel et artistique': 'cultural.png',
      'guindaille': 'party.png',
      'sportif': 'sports.png',
      'services et aides': 'services.png'
    };
    return 'assets/icon/events-icon/' + (icons.hasOwnProperty(category) ? icons[category] : 'other.png');
  }

  private createDateForEvent(str: string): Date {
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
}
