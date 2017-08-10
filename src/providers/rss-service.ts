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
import 'rxjs/add/operator/timeout';

@Injectable()
export class RssService {
  rssServiceBaseUrl: string = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D%27";
  rssServiceBaseOptions: string = "%27&format=json";

  constructor(public http: Http) {

  }

  load(url: string) {
    let encodedURL = this.rssServiceBaseUrl + encodeURIComponent(url) + this.rssServiceBaseOptions;


    return this.http.get(encodedURL)
            .map(res => {
              let data:any = res.json();
              console.log("test : " + data['query']);
              return data['query']['results']['rss']['channel']['item'];
            });
  }
}
