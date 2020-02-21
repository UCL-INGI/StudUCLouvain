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

import { NewsItem } from '../../app/entity/newsItem';
import { RssService } from './rss-service';

@Injectable()
export class NewsService {
  url1 = 'https://uclouvain.be/actualites/p1/rss';
  url2 = 'https://uclouvain.be/actualites/p2/rss';
  url3 = 'https://uclouvain.be/actualites/p3/rss';
  news = [];
  shownNews = 0;
  maxDescLength = 20;

  constructor(public http: HttpClient, public rssService: RssService) {
    console.log('Hello NewsService Provider');
  }


  public getNews(segment: string) {
    const baseURL = this.getBaseURL(segment);
    this.news = [];
    return this.rssService.load(baseURL).then(result => {
      this.extractNews(result);
      return {
        news: this.news,
        shownNews: this.shownNews
      };
    }).catch(error => {
      if (error === 1) {
        return this.getNews(segment);
      } else if (error === 2) {
        console.log('Loading news : GET req timed out > limit, suppose no news to be displayed');
      } else {
        console.log('Error loading news : ' + error);
      }
      return {
        news: [],
        shownNews: 0
      };
    });
  }

  private getBaseURL(segment: string) {
    switch (segment) {
      case 'P2': {
        return this.url2;
      }
      case 'P3': {
        return this.url3;
      }
      case 'P1': {
        return this.url1;
      }
      default: {
        return segment;
      }
    }
  }

  private extractNews(data: any) {
    if (data.length === undefined) {
      data = [data];
    }
    this.shownNews = 0;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let trimmedDescription = '...';
      if (item.description !== undefined) {
        trimmedDescription = item.description.length > this.maxDescLength ? item.description.substring(0, 80) + '...' : item.description;
      }
      this.shownNews++;
      const pubDate = this.createDateForNews(item.pubDate);
      const img = item.enclosure !== null ? item.enclosure._url : '';
      const newNewsItem = new NewsItem(
        item.description || 'No description...',
        item.link || 'No link',
        item.title || 'No title',
        img, trimmedDescription, false, item.guid, pubDate
      );
      this.news.push(newNewsItem);
    }
  }

  private createDateForNews(str: string): Date {
    // str : "Fri, 07 Jul 2017 08:51:52 +0200"
    // new Date(Year : number, (month-1) : number, day : number)
    const dateTimeSplit = str.split(' ');
    const timeSplit = dateTimeSplit[4].split(':');

    const year = parseInt(dateTimeSplit[3]);
    const month = this.getMonthNumber(dateTimeSplit[2]);
    const day = parseInt(dateTimeSplit[1]);
    const hours = parseInt(timeSplit[0]);
    const minutes = parseInt(timeSplit[1]);

    return new Date(year, month, day, hours, minutes);
  }

  private getMonthNumber(str: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(str);
  }
}
