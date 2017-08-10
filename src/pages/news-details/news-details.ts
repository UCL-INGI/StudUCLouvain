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

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewsItem } from '../../app/entity/newsItem';

/*
  Generated class for the Details page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html'
})
export class NewsDetailsPage {
  news: NewsItem;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.news = navParams.get('news');
  }

  public openPage(url: string) {
    //InAppBrowser.open(url, '_blank');
    window.open(url, '_blank');
  }

}
