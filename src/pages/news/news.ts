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

import 'rxjs/add/operator/debounceTime';

import {
    AlertController, App, Content, IonicPage, List, Loading, LoadingController, NavController,
    NavParams, Platform
} from 'ionic-angular';
import { CacheService } from 'ionic-cache';

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { NewsItem } from '../../app/entity/newsItem';
import { NewsService } from '../../providers/rss-services/news-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { FacService } from '../../providers/utils-services/fac-service';
import { UserService } from '../../providers/utils-services/user-service';

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  // url = 'assets/data/fac.json';

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public userS: UserService,
    public newsService: NewsService,
    public connService: ConnectivityService,
    private iab: InAppBrowser,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public facService: FacService,
    private cache: CacheService
  ) {
    if (this.navParams.get('title') !== undefined) {
      this.title = this.navParams.get('title');
    }
    this.searchControl = new FormControl();
    this.facService.loadResources().then(data => {
      this.listFac = data;
    });
  }

  @ViewChild('newsList', { read: List }) newsList: List;
  @ViewChild('news') content: Content;

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
  loading: Loading;
  fac = '';
  listFac: any = [];
  site = '';
  rss = '';

  // USEFUL TO RESIZE WHEN SUBHEADER HIDED OR SHOWED
  resize() {
    if (this.content) {
      this.content.resize();
    }
  }

  ionViewDidLoad() {
    this.app.setTitle(this.title);
    this.cachedOrNot();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.updateDisplayedNews();
    });
  }

  presentLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  public openURL(url: string) {
    this.iab.create(url, '_system', 'location=yes');
  }

  updateFac(fac: string) {
    this.fac = fac;
    this.userS.addFac(this.fac);
    this.resize();
    const links = this.findSite();
    this.site = links.site;
    this.rss = links.rss;
    this.loadNews();
  }

  findSite() {
    for (const sector of this.listFac) {
      for (const facs of sector.facs) {
        if (facs.acro === this.fac) {
          return { site: facs.site, rss: facs.rss };
        }
      }
    }
  }

  removeFac(fac: string) {
    this.userS.removeFac(fac);
    this.resize();
  }

  public doRefresh(refresher) {
    if (this.connService.isOnline()) {
      if (
        this.segment === 'univ' ||
        (this.segment === 'fac' &&
          this.facsegment === 'news' &&
          this.userS.hasFac())
      ) {
        if (this.segment === 'univ') {
          const part = this.subsegment;
          const key = part === 'P1' ? 'cache-P1' : part === 'P2' ? 'cache-P2' : 'cache-P3';
          this.cache.removeItem(key);
          this.loadNews(key);
        } else {
          this.loadNews();
        }
      }
      refresher.complete();
    } else {
      this.connService.presentConnectionAlert();
      refresher.complete();
    }
  }

  facTabChange() { }

  tabChanged() {
    this.resize();
    if (this.segment === 'univ') {
      this.cachedOrNot();
    }
    if (this.segment === 'fac') {
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
    const part = this.subsegment;
    if (this.segment === 'univ') {
      const key =
        part === 'P1' ? 'cache-P1' : part === 'P2' ? 'cache-P2' : 'cache-P3';
      await this.cache
        .getItem(key)
        .then(data => {
          this.presentLoading();
          this.news = data.news;
          this.shownNews = data.shownNews;
          this.searching = false;
          this.updateDisplayedNews();
        })
        .catch(() => {
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
      this.presentLoading();
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
    this.displayedNews = this.news;
    this.displayedNews = this.news.filter(item => {
      return (
        item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
    this.shownNews = this.displayedNews.length;
    this.nonews = this.shownNews === 0;
    this.searching = false;
    this.dismissLoading();
  }

  public goToNewsDetail(news: NewsItem) {
    this.navCtrl.push('NewsDetailsPage', { news: news });
  }
}
