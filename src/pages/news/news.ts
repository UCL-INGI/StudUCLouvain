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

import { Component, ViewChild } from '@angular/core';
import { App, List, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { NewsService } from '../../providers/news-service';
import { EventsService } from '../../providers/events-service';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  @ViewChild('newsList', { read: List }) newsList: List;

  news: any = [];
  segment = 'P1';
  shownNews = 0;
  displayedNews : any = [];

  public title:string ="News" ;

  constructor(
    public events: EventsService,
    public navCtrl: NavController,
    public navParams:NavParams,
    public app:App,
    public newsService : NewsService) {
  }

  ionViewDidLoad() {
    this.app.setTitle(this.title);
    this.loadEvents();
  }

  public doRefresh(refresher) {
    this.loadEvents();
    refresher.complete();
  }

  public loadEvents() {

  }

  public updateDisplayedNews() {

  }
}
