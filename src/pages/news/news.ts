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

import {
    AlertController, App, Content, IonicPage, List, LoadingController, NavController, NavParams,
    Platform
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
  selector: "page-news",
  templateUrl: "news.html"
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
    if (this.navParams.get("title") !== undefined) {
      this.title = this.navParams.get("title");
    }
    this.searchControl = new FormControl();
    this.facService.loadResources().then(data => {
      this.listFac = data;
    });
  }

  @ViewChild("newsList", { read: List }) newsList: List;
  @ViewChild("news") content: Content;

  news: Array<NewsItem> = [];
  segment = "univ";
  subsegment = "P1";
  facsegment = "news";
  shownNews = 0;
  displayedNews: Array<NewsItem> = [];
  searching: any = false;
  searchControl: FormControl;
  searchTerm = "";
  title = "Actualités";
  nonews: any = false;
  loading;
  fac = "";
  listFac: any = [];
  site = "";
  rss = "";

  // USEFUL TO RESIZE WHEN SUBHEADER HIDED OR SHOWED
  resize() {
    if (this.content) {
      this.content.resize();
      console.debug("content resize", this.content);
    }
  }

  /*load the view, Call function to load news, display them*/
  ionViewDidLoad() {
    this.app.setTitle(this.title);
    // Check the connexion, if it's ok, load the news
    // if(this.connService.isOnline()) {
    this.cachedOrNot();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.updateDisplayedNews();
    });
    // this.presentLoading();
    // }
    // If no connexion, go back to the previous page and pop an alert
    /*else{
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }*/
  }

  /*Display an loading pop up*/
  presentLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: "Please wait..."
      });
      this.loading.present();
    }
  }

  /*Cancel the loading pop up*/
  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  /*Open a page with the details of a news*/
  public openURL(url: string) {
    this.iab.create(url, "_system", "location=yes");
  }

  /*Select the good fac for the selection of the user and load the good news*/
  updateFac(fac: string) {
    this.fac = fac;
    this.userS.addFac(this.fac);
    this.resize();
    const links = this.findSite();
    this.site = links.site;
    this.rss = links.rss;
    this.loadNews();
  }

  /*If there is a site for a fac, return the good site*/
  findSite() {
    for (const sector of this.listFac) {
      for (const facs of sector.facs) {
        if (facs.acro === this.fac) {
          return { site: facs.site, rss: facs.rss };
        }
      }
    }
  }

  /*Remove a fac for a user*/
  removeFac(fac: string) {
    this.userS.removeFac(fac);
    this.resize();
  }

  /*Reload news if pull bellow the view*/
  public doRefresh(refresher) {
    if (this.connService.isOnline()) {
      if (
        this.segment === "univ" ||
        (this.segment === "fac" &&
          this.facsegment === "news" &&
          this.userS.hasFac())
      ) {
        if (this.segment === "univ") {
          const part = this.subsegment;
          let key;
          if (part === "P1") {
            key = "cache-P1";
          } else if (part === "P2") {
            key = "cache-P2";
          } else {
            key = "cache-P3";
          }
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

  facTabChange() {}

  /*Tab change*/
  tabChanged() {
    this.resize();
    if (this.segment === "univ") {
      this.cachedOrNot();
    }
    if (this.segment === "fac") {
      this.fac = this.userS.fac;
      if (this.facsegment === "news" && this.userS.hasFac()) {
        const links = this.findSite();
        this.site = links.site;
        this.rss = links.rss;

        this.loadNews();
      }
    }
  }

  /*Check if data are cached or not */
  async cachedOrNot() {
    // this.cache.removeItem('cache-P1');
    let key;
    const part = this.subsegment;
    if (this.segment === "univ") {
      if (part === "P1") {
        key = "cache-P1";
      } else if (part === "P2") {
        key = "cache-P2";
      } else {
        key = "cache-P3";
      }
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
          console.log("Oh no! My data is expired or doesn't exist!");
          this.loadNews(key);
        });
    } else {
      this.loadNews();
    }
  }

  /*Load news to display*/
  public loadNews(key?) {
    this.searching = true;
    this.news = [];
    // Check connexion before load news
    if (this.connService.isOnline()) {
      this.presentLoading();
      let actu = this.subsegment;
      if (this.segment === "fac" && this.facsegment === "news") {
        actu = this.rss;
      }
      this.newsService.getNews(actu).then(result => {
        this.news = result.news;
        if (key) {
          this.cache.saveItem(key, result);
        }
        this.shownNews = result.shownNews;
        this.searching = false;
        this.nonews = this.news.length == 0;
        this.updateDisplayedNews();
      });
      // If no connexion pop an alert and go back to previous page
    } else {
      // return [];
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  /*Update display news*/
  public updateDisplayedNews() {
    this.searching = true;
    this.displayedNews = this.news;
    this.displayedNews = this.news.filter(item => {
      return (
        item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
    this.shownNews = this.displayedNews.length;
    this.nonews = this.shownNews == 0;
    this.searching = false;
    this.dismissLoading();
    console.log(this.displayedNews);
  }

  /*When click on a news, go to the page with more details*/
  public goToNewsDetail(news: NewsItem) {
    this.navCtrl.push("NewsDetailsPage", { news: news });
  }
}
