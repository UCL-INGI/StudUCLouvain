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
import 'rxjs/add/operator/timeout';

import X2JS from 'x2js';

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class RssService {
  nbCalls = 0;
  callLimit = 30;

  constructor(public http: HttpClient) {
  }

  convertXmlToJson(xml): any {
    const parser: any = new X2JS();
    const json = parser.xml2js(xml);
    return json;
  }

  load(url: string, isSport: boolean = false) {
    return new Promise((resolve, reject) => {
      this.http.get(url, {responseType: 'text'}).timeout(5000)
        .map(data => this.convertXmlToJson(data)).subscribe(result => {
          this.nbCalls++;
          if (isSport) {
            result = result['xml'];
          } else {
            result = result['rss']['channel'];
          }
          if (result == null) {
            if (this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); // 2 = data.query.results == null  & callLimit reached, no neitemsws to display
            }
            reject(1); // 1 = data.query.results == null, retry rssService
          } else {
            this.nbCalls = 0;
            resolve(result['item']);
          }
        },
        err => {
          reject(err);
        });
    });
  }
}
