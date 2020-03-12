import { debounceTime } from 'rxjs/operators';
import { AlertController, IonContent, IonList, NavController, NavParams, Platform } from '@ionic/angular';
import { CacheService } from 'ionic-cache';

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { NewsItem } from '../../app/entity/newsItem';
import { NewsService } from '../../providers/rss-services/news-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { FacService } from '../../providers/utils-services/fac-service';
import { UserService } from '../../providers/utils-services/user-service';
import { UtilsService } from '../../providers/utils-services/utils-service';
import { NavigationExtras } from "@angular/router";

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

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  // url = 'assets/data/facultiesInformations.json';

  @ViewChild('newsList', {read: IonList, static: false}) newsList: IonList;
  @ViewChild('news', {static: false}) content: IonContent;
  news: Array<NewsItem> = [];
  segment = 'univ';
  subsegment = 'P1';
  facsegment = 'news';
  shownNews = 0;
  displayedNews: Array<NewsItem> = [];
  searching: any = false;
  searchControl: FormControl;
  searchTerm = '';
  title = 'Actualités';
  nonews: any = false;
  fac = '';
  listFac: any = [];
  site = '';
  rss = '';

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userS: UserService,
    public newsService: NewsService,
    public connService: ConnectivityService,
    private iab: InAppBrowser,
    public alertCtrl: AlertController,
    public facService: FacService,
    private cache: CacheService,
    private utilsService: UtilsService
  ) {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
    this.facService.loadResources().then(data => {
      this.listFac = data;
    });
  }

  ionViewDidLoad() {
    document.title = this.title;
    this.cachedOrNot();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.updateDisplayedNews();
    });
  }

  public openURL(url: string) {
    this.iab.create(url, '_system', 'location=yes');
  }

  updateFac(fac: string) {
    this.fac = fac;
    this.userS.addFac(this.fac);
    const links = this.findSite();
    this.site = links.site;
    this.rss = links.rss;
    this.loadNews();
  }

  findSite() {
    for (const sector of this.listFac) {
      for (const facs of sector.facs) {
        if (facs.acro === this.fac) {
          return {site: facs.site, rss: facs.rss};
        }
      }
    }
  }

  removeFac() {
    this.userS.removeFac();
  }

  public doRefresh(refresher) {
    if (this.connService.isOnline()) {
      this.refresh();
    } else {
      this.connService.presentConnectionAlert();
    }
    refresher.complete();
  }

  tabChanged() {
    if (this.segment === 'univ') {
      this.cachedOrNot();
    } else if (this.segment === 'fac') {
      this.fac = this.userS.fac;
      if (this.facsegment === 'news' && this.userS.hasFac()) {
        const links = this.findSite();
        this.site = links.site;
        this.rss = links.rss;
        this.loadNews();
      }
    }
  }

  async cachedOrNot() {
    if (this.segment === 'univ') {
      const key = this.getKeyUniv();
      await this.cache.getItem(key).then(data => {
        this.utilsService.presentLoading();
        this.news = data.news;
        this.shownNews = data.shownNews;
        this.searching = false;
        this.updateDisplayedNews();
      }).catch(() => {
        console.log('Oh no! My data is expired or doesn\'t exist!');
        this.loadNews(key);
      });
    } else {
      this.loadNews();
    }
  }

  public loadNews(key?) {
    this.searching = true;
    this.news = [];
    if (this.connService.isOnline()) {
      this.utilsService.presentLoading();
      let actu = this.subsegment;
      if (this.segment === 'fac' && this.facsegment === 'news') {
        actu = this.rss;
      }
      this.newsService.getNews(actu).then(result => {
        this.news = result.news;
        if (key) {
          this.cache.saveItem(key, result);
        }
        this.shownNews = result.shownNews;
        this.searching = false;
        this.nonews = this.news.length === 0;
        this.updateDisplayedNews();
      });
    } else {
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  public updateDisplayedNews() {
    this.searching = true;
    this.displayedNews = this.news.filter(item => {
      return item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
    this.shownNews = this.displayedNews.length;
    this.nonews = this.shownNews === 0;
    this.searching = false;
    this.utilsService.dismissLoading();
  }

  public goToNewsDetail(news: NewsItem) {
    const navigationExtras: NavigationExtras = {
      state: {
        items: news
      }
    };
    this.navCtrl.navigateForward(['NewsDetailsPage'], navigationExtras);
  }

  private refresh() {
    if (this.segment === 'univ' || (this.segment === 'fac' && this.facsegment === 'news' && this.userS.hasFac())) {
      let key: string;
      if (this.segment === 'univ') {
        key = this.getKeyUniv();
        this.cache.removeItem(key);
      }
      this.loadNews();
    }
  }

  private getKeyUniv() {
    return this.subsegment === 'P1' ? 'cache-P1' : this.subsegment === 'P2' ? 'cache-P2' : 'cache-P3';
  }
}
