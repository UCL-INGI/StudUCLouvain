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
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import {Jsonp} from '@angular/http';
import { UserData } from './user-data';

export class FeedItem {
  description: string;
  link: string;
  title: string;
  image: string;
  trimmedDescription: string;
  location : string;
  hidden : boolean;
  favorite : boolean;
  guid : string;
  startDate : string;
  endDate : string;

  constructor(
      description: string,
      link: string,
      title: string,
      image:string,
      trimmedDescription: string,
      location: string,
      hidden: boolean,
      favorite: boolean,
      guid: string,
      startDate : string,
      endDate : string,
    ) {
    this.description = description;
    this.link = link;
    this.title = title;
    this.image = image;
    this.trimmedDescription = trimmedDescription;
    this.location = location;
    this.hidden = hidden;
    this.favorite = favorite;
    this.guid = guid;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

@Injectable()
export class FeedService {

  constructor(private http: Http, public storage: Storage, public user:UserData) {}

  public getEvents(segment:string) {
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D\'http%3A%2F%2Flouvainfo.be%2Fevenements%2Ffeed%2Fcalendar%2F\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    let events = [];

    return this.http.get(url)
    .map(data => data.json())
    .map((res) => {
      if (res == null) {
        return events;
      }
      let objects = res.query.results.rss.channel['item'];
      var length = 20;
      var shownEvents = 0;

      for (let i = 0; i < objects.length; i++) {
        let item = objects[i];
        var trimmedDescription = item.description.length > length ? item.description.substring(0, 80) + "..." : item.description;
        let favorite = false;
        let hidden = false;
        if (this.user.hasFavorite(item.guid)) {
          favorite = true;
        }
        shownEvents++;
        let newFeedItem =
          new FeedItem(item.description, item.link, item.title, item.photo, trimmedDescription, item.location, hidden, favorite, item.guid, item.date_begin, item.date_end);
        events.push(newFeedItem);
      }
      events.push(shownEvents);
      return events
    })
  }

}
