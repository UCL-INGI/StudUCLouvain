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
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserService } from '../utils-services/user-service';
import { RssService } from './rss-service';
import { EventItem } from '../../app/entity/eventItem';

@Injectable()
export class EventsService {
  events: Array<EventItem> = [];
  allCategories: any = [];
  shownEvents = 0;
  nbCalls = 0;
  callLimit = 30;

  url = "http://louvainfo.be/evenements/feed/calendar/";

  constructor(private http: Http, public user:UserService, public rssService : RssService) {}

  public getEvents(segment:string) {
    this.events = [];
    return new Promise( (resolve, reject) => {
      this.rssService.load(this.url).subscribe(
        data => {
          this.nbCalls++;
          if (data['query']['results'] == null) {
            if(this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no events to display
            }
            reject(1); //1 = data.query.results == null, YQL req timed out, retry rssService
          } else {
            this.nbCalls = 0;
            this.extractEvents(data['query']['results']['item']);
            resolve({events : this.events, shownEvents: this.shownEvents});
          }
        },
        err => {
          reject(err);
        });;
    });
  }

  private extractEvents(data: any) {
    let maxDescLength = 20;
    if(data === undefined){
      console.log("Error events data undefined!!!")
      return;
    }
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let trimmedDescription = item.description.length > maxDescLength ? item.description.substring(0, 80) + "..." : item.description;
      let favorite = false;
      let hidden = false;
      let iconCategory = "assets/events-icon/other.png";

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

      let startDate = this.createDateForEvent(item.date_begin);
      let endDate = this.createDateForEvent(item.date_end);
      let newEventItem = new EventItem(item.description, item.link, item.title, item.photo, trimmedDescription, item.location,
                      hidden, favorite, item.guid, startDate, endDate, item.category, iconCategory);

      this.events.push(newEventItem);
    }
  }

  public getIconCategory(category : string):string{
    switch(category.toLowerCase()) {
      case "sensibilisation" : {
        return "assets/icon/events-icon/sensibilisation.png";
      }
      case "animation" : {
        return "assets/icon/events-icon/animation.png";
      }
      case "culturel et artistique" : {
        return "assets/icon/events-icon/cultural.png";
      }
      case "guindaille" : {
        return "assets/icon/events-icon/party.png";
      }
      case "sportif" : {
        return "assets/icon/events-icon/sports.png";
      }
      case "services et aides" : {
        return "assets/icon/events-icon/services.png";
      }
      default: {
        return "assets/icon/events-icon/other.png";
      }
    }
  }

  private createDateForEvent(str : string):Date{
    //new Date(Year : number, (month-1) : number, day : number)
    let dateTimeSplit = str.split(" ");
    let dateSplit = dateTimeSplit[0].split("/");
    let timeSplit = dateTimeSplit[1].split(":");

    let year = parseInt(dateSplit[2]);
    let month = parseInt(dateSplit[1])-1;
    let day = parseInt(dateSplit[0]);
    let hours = parseInt(timeSplit[0]);
    let minutes = parseInt(timeSplit[1]);

    return new Date(year, month, day, hours, minutes);

  }

  public filterItems(myList, searchTerm){

    return myList.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

}
