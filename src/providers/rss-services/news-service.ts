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
import 'rxjs/add/operator/map';
import { RssService } from './rss-service';
import { NewsItem } from '../../app/entity/newsItem';


@Injectable()
export class NewsService {
  url1 = "https://uclouvain.be/actualites/p1/rss";
  url2 = "https://uclouvain.be/actualites/p2/rss";
  url3 = "https://uclouvain.be/actualites/p3/rss";
  nbCalls = 0;
  callLimit = 30;

  news = [];
  shownNews = 0;

  constructor(public http: HttpClient, public rssService: RssService) {
    console.log('Hello NewsService Provider');
  }

  public getNews(segment:string) {
    let baseURL;
    this.news = [];
    switch(segment) {
       case "P2": {
          baseURL = this.url2;
          break;
       }
       case "P3": {
          baseURL = this.url3;
          break;
       }
       case "P1": {
         baseURL = this.url1;
         break;
       }
       default: {
          baseURL = segment;
          break;
       }
    }
    return new Promise( (resolve, reject) => {

      this.rssService.load(baseURL).subscribe(
        data => {
          this.nbCalls++;
          if (data['query']['results'] == null) {
            if(this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no news to display
            }
            reject(1); //1 = data.query.results == null, retry rssService
          } else {
            this.nbCalls = 0;
            this.extractNews(data['query']['results']['item']);
            resolve({news : this.news, shownNews: this.shownNews});
          }
        },
        err => {
          reject(err);
        });;
    });
  }

  private extractNews(data : any){
    let maxDescLength = 20;

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let trimmedDescription = "...";
      if(item.description !== undefined) {
        trimmedDescription = item.description.length > maxDescLength ? item.description.substring(0, 80) + "..." : item.description;
      }
      let hidden = false;

      this.shownNews++;
      let pubDate = this.createDateForNews(item.pubDate);
      let img = "";
      if(item.enclosure != null) img = item.enclosure.url;
      let newNewsItem = new NewsItem(item.description || "No description...", item.link || "No link", item.title || "No title", img, trimmedDescription, hidden, item.guid, pubDate);
      this.news.push(newNewsItem);
    }
  }

  private createDateForNews(str : string): Date{
    //str : "Fri, 07 Jul 2017 08:51:52 +0200"
    //new Date(Year : number, (month-1) : number, day : number)
    let dateTimeSplit = str.split(" ");
    let timeSplit = dateTimeSplit[4].split(":");

    let year = parseInt(dateTimeSplit[3]);
    let month = this.getMonthNumber(dateTimeSplit[2]);
    let day = parseInt(dateTimeSplit[1]);
    let hours = parseInt(timeSplit[0]);
    let minutes = parseInt(timeSplit[1]);

    return new Date(year, month, day, hours, minutes);
  }

  private getMonthNumber(str: string) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return months.indexOf(str);
  }
}
