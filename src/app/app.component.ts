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
import { MenuController, Nav, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Market } from '@ionic-native/market';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { CampusEventsPage } from '../pages/campus-events/campus-events';
import { CarpoolingPage } from '../pages/carpooling/carpooling';
//import { CoursePage } from '../pages/course/course';
//import { DetailsPage } from '../pages/details/details';
import { LibraryPage } from '../pages/library/library';
import { NewsPage } from '../pages/news/news';
import { RestaurantPage } from '../pages/restaurant/restaurant';
import { SportPage } from '../pages/sport/sport';
import { StudiesPage } from '../pages/studies/studies';
//import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { HelpDeskPage } from '../pages/help-desk/help-desk';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = NewsPage;
  campusPages: Array<{title: string, component: any, icon: any, iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string}>;
  studiePages: Array<{title: string, component: any, icon: any, iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string}>;
  toolPages: Array<{title: string, component: any, icon: any, iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string}>;

  constructor(public platform: Platform,
    public menu: MenuController,
    public market: Market,
    private appAvailability : AppAvailability,
    private iab: InAppBrowser,
    private device: Device,
    private splashscreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.campusPages =[
      { title: 'News', component: NewsPage, icon: 'paper', iosSchemaName: null, androidPackageName: null, appUrl: null, httpUrl: null },
      { title: 'Events', component: CampusEventsPage, icon: 'calendar', iosSchemaName: null, androidPackageName: null, appUrl: null, httpUrl: null  },
      { title: 'Sports', component: SportPage, icon : 'football', iosSchemaName: null, androidPackageName: null, appUrl: null, httpUrl: null },
      { title: 'Restaurants', component: RestaurantPage, icon : 'restaurant', iosSchemaName: 'com.apptree.resto4u', androidPackageName: 'com.apptree.resto4u', appUrl: 'apptreeresto4u://', httpUrl: 'https://uclouvain.be/fr/decouvrir/resto-u' }
    ];
    this.studiePages =[
      { title: 'Studies', component: StudiesPage, icon: 'school', iosSchemaName: null, androidPackageName: null, appUrl: null, httpUrl: null  },
      { title: 'Libraries', component: LibraryPage, icon: 'book', iosSchemaName: null, androidPackageName: null, appUrl: null, httpUrl: null  }
    ];
    this.toolPages =[
      { title: 'Repertoire UCL', component: NewsPage, icon: 'contact', iosSchemaName: null, androidPackageName: null, appUrl: null, httpUrl: null  },
      { title: 'Maps', component: MapPage, icon: 'map', iosSchemaName: null, androidPackageName: null, appUrl: null, httpUrl: null  },
      { title: 'Covoiturage', component: CarpoolingPage, icon : 'car', iosSchemaName: 'net.commuty.mobile', androidPackageName: 'net.commuty.mobile', appUrl: 'commutynet://', httpUrl: 'https://app.commuty.net/sign-in' },
      { title: 'Help Desk', component: HelpDeskPage, icon: 'information-circle', iosSchemaName: null, androidPackageName: null, appUrl: null, httpUrl: null }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashscreen.hide();
    });
  }

  openRootPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    if(page.iosSchemaName != null && page.androidPackageName != null){
      this.launchExternalApp(page.iosSchemaName, page.androidPackageName, page.appUrl, page.httpUrl);
    }
    this.nav.setRoot(page.component, {title: page.title});

  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string) {
	  let app: string;
    let storeUrl:string;
  	if (this.device.platform === 'iOS') {
  		app = iosSchemaName;
      storeUrl=httpUrl;
  	} else if (this.device.platform === 'Android') {
  		app = androidPackageName;
      storeUrl= 'market://details?id='+ app;
  	} else {
  		const browser = this.iab.create(httpUrl, '_system');
      browser.close();
  	}
  	this.appAvailability.check(app).then(
  		() => { // success callback
  			const browser = this.iab.create(appUrl, '_system');
        browser.close();
  		},
  		() => { // error callback
  			this.market.open(app);
  		}
  	);
  }

}
