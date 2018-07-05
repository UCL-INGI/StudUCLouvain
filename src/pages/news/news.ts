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

import { Component, ViewChild } from '@angular/core';
import { App, List, Content, NavController, NavParams, Platform, AlertController,LoadingController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { NewsService } from '../../providers/rss-services/news-service';
import { NewsItem } from '../../app/entity/newsItem';
import { NewsDetailsPage } from './news-details/news-details';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../providers/utils-services/user-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  @ViewChild('newsList', { read: List }) newsList: List;
  @ViewChild('news') content: Content;
  
  resize()
  {
    if(this.content)
    {
      this.content.resize();
      console.debug("content resize", this.content)
    }
  }

  news: Array<NewsItem> = [];
  segment = "univ";
  subsegment = "P1";
  shownNews = 0;
  displayedNews : Array<NewsItem> = [];
  searching: any = false;
  searchControl: FormControl;
  searchTerm: string = '';
  title:string ="Actualités" ;
  nonews:any = false;
  loading;
  fac:string="";


  constructor(
    public platform : Platform,
    public navCtrl: NavController,
    public navParams:NavParams,
    public app:App,
    public userS:UserService,
    public newsService : NewsService,
    public connService : ConnectivityService,
    private iab: InAppBrowser,
    public alertCtrl : AlertController,
    private translateService: TranslateService,
    public loadingCtrl: LoadingController
  ) {
      if(this.navParams.get('title') !== undefined) {
        this.title = this.navParams.get('title');
      }
      this.app.setTitle(this.title);
      this.searchControl = new FormControl();
      this.platform.ready().then(() => {
        this.loadEvents();
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
          this.searching = false;
          this.updateDisplayedNews();
        });
      });
      this.fac=this.userS.fac;
      //this.segmentChanged();
  }
    presentLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      this.loading.present();
    }
    //this.dismiss = true;

   /* setTimeout(() => {
      this.loading.dismiss();
    }, 5000);*/
  }

  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
  }

  public openURL(url: string) {
    this.iab.create(url, '_system','location=yes');
  }

  updateFac(){
    this.userS.addFac(this.fac);
  }

  ionViewDidLoad() {
    this.presentLoading();
  }

  public doRefresh(refresher) {

    if(this.segment ==='univ') this.loadEvents();
    refresher.complete();

  }

  segmentChanged(){
    this.resize();
    if(this.segment==='univ') this.updateDisplayedNews();

  }

  public loadEvents() {
    this.searching = true;
    this.news = [];
    if(this.connService.isOnline()) {
      this.newsService.getNews(this.subsegment)
      .then(
        res => {
          let result:any = res;
          this.news = result.news;
          this.shownNews = result.shownNews;
          this.searching = false;
          this.updateDisplayedNews();
      })
      .catch(error => {
          if(error == 1) {
            this.loadEvents();
          } else {
            if(error == 2) {
              console.log("Loading news : YQL req timed out > limit, suppose no news to be displayed");
            } else {
              console.log("Error loading news : " + error);
            }
            this.searching = false;
            this.nonews=true;
            this.updateDisplayedNews();
          }
      });
    } else {
      this.searching = false;
      this.connService.presentConnectionAlert();
    }

  }

  public updateDisplayedNews() {
    this.searching = true;
    this.displayedNews = this.news;
    this.displayedNews = this.news.filter((item) => {
      return (item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
    });
    this.shownNews = this.displayedNews.length;
    this.searching = false;
    this.dismissLoading();
  }

  public goToNewsDetail(news: NewsItem) {
    this.navCtrl.push( NewsDetailsPage, { 'news': news });
  }
}
