/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire, Corentin Lamy, Daubry Benjamin & Marchesini Bruno
    Date : July 2018
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
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage } from 'ionic-angular';

import { NewsService } from '../../providers/rss-services/news-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { UserService } from '../../providers/utils-services/user-service';
import { FacService } from '../../providers/utils-services/fac-service';

import { NewsItem } from '../../app/entity/newsItem';

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  @ViewChild('newsList', { read: List }) newsList: List;
  @ViewChild('news') content: Content;

  // USEFUL TO RESIZE WHEN SUBHEADER HIDED OR SHOWED
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
  facsegment="news";
  shownNews = 0;
  displayedNews : Array<NewsItem> = [];
  searching: any = false;
  searchControl: FormControl;
  searchTerm: string = '';
  title:string ="Actualités" ;
  nonews:any = false;
  loading;
  fac:string="";
  listFac:any=[];
  site:string="";
  rss:string="";
  //url = 'assets/data/fac.json';

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
    public loadingCtrl: LoadingController,
    public facService: FacService)
  {
      if(this.navParams.get('title') !== undefined) {
        this.title = this.navParams.get('title');
      }
      this.searchControl = new FormControl();
      this.facService.loadResources().then((data) => {
        this.listFac=data;
      });
  }

  ionViewDidLoad() {
    this.app.setTitle(this.title);
    if(this.connService.isOnline()) {
      this.loadEvents();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.updateDisplayedNews();
      });
      this.presentLoading();
    }
    else{
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  presentLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    }
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
    this.resize();
    let links = this.findSite();
    this.site = links.site;
    this.rss = links.rss;
    this.loadEvents();

  }

  findSite(){
    for(let sector of this.listFac){
      for(let facs of sector.facs){
        if(facs.acro === this.fac) {
          return {'site':facs.site, 'rss': facs.rss};
        }
      }
    }
  }

  removeFac(fac:string){
    this.userS.removeFac(fac);
        this.resize();
  }

  public doRefresh(refresher) {

    if(this.segment ==='univ') this.loadEvents();
    refresher.complete();

  }

  segmentChanged(){
    this.resize();
    //if(this.segment==='univ') this.updateDisplayedNews();
    if(this.segment==='fac'){
      this.fac=this.userS.fac;

      if(this.facsegment === 'news' && this.userS.hasFac()){
        let links = this.findSite();
        this.site= links.site;
        this.rss = links.rss;
      }
    }
    this.loadEvents();

  }

  facSegChange(){

  }

  public loadEvents() {
    this.searching = true;
    this.news = [];
    if(this.connService.isOnline()) {
      let actu = this.subsegment;
      if(this.segment === 'fac' && this.facsegment === 'news') actu = this.rss;
      this.newsService.getNews(actu)
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
      this.navCtrl.pop();
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
    this.navCtrl.push( 'NewsDetailsPage', { 'news': news });
  }
}
