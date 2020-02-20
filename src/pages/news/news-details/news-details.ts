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

import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {Component} from '@angular/core';

import {NewsItem} from '../../../app/entity/newsItem';

@IonicPage()
@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html'
})
export class NewsDetailsPage {
  news: NewsItem;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.news = navParams.get('news');
  }

  /*Open the url for a news to see more details*/
  public openPage(url: string) {
    window.open(url, '_blank');
  }
}
