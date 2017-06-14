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

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { RssService } from './rss-service';

@Injectable()
export class NewsService {
  url1 = "https://uclouvain.be/actualites/p1";
  url2 = "https://uclouvain.be/actualites/p2";
  url3 = "https://uclouvain.be/actualites/p3";

  news = [];

  constructor(public http: Http, public rssService: RssService) {
    console.log('Hello NewsService Provider');
  }

  public getNews(segment:string) {
    return new Promise( (resolve, reject) => {
      this.rssService.load(this.url1).subscribe(
        data => {
          this.extractNews(data);
          resolve();
        }
      );
    });
  }

  extractNews(data : any){
    /*var maxDescLength = 20;

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      var trimmedDescription = item.description.length > maxDescLength ? item.description.substring(0, 80) + "..." : item.description;
    }*/
  }
}
