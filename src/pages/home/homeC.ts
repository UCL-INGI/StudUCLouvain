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

import { Component} from '@angular/core';
import { NavParams, NavController, App } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { AppAvailability } from '@ionic-native/app-availability';
import { UserService } from '../../providers/utils-services/user-service';
import { MyApp } from '../../app/app.component';

import { EventsPage } from '../events/events';
import { MobilityPage } from '../mobility/mobility';
import { LibrariesPage } from '../library/libraries';
import { NewsPage } from '../news/news';
import { RestaurantPage } from '../restaurant/restaurant';
import { StudiesPage } from '../studies/studies';
import { MapPage } from '../map/map';
import { HelpDeskPage } from '../help-desk/help-desk';
import { SportsPage } from '../sports/sports';

@Component({
  selector: 'page-homeC',
  templateUrl: 'homeC.html',
})
export class HomePage {
//  @ViewChild('Nav') nav: Nav;
  title:string = "Accueil";
  shownGroup = null;
  where = "";
  myApp : MyApp;


  libraryPage = { title: 'Bibliothèques', component: LibrariesPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  newsPage = { title: 'Actualités', component: NewsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  eventPage = { title: 'Evenements', component: EventsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  sportPage = { title: 'Sports', component: SportsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  studiesPage = { title: 'Etudes', component: StudiesPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  helpDeskPage = { title: 'Service d\'aide', component: HelpDeskPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  mapPage = { title: 'Carte', component: MapPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  restoPage = { title: 'Restaurants', component: RestaurantPage,
    iosSchemaName: 'com.apptree.resto4u',
    androidPackageName: 'com.apptree.resto4u',
    appUrl: 'apptreeresto4u://',
    httpUrl: 'https://uclouvain.be/fr/decouvrir/resto-u' };

  mobilityPage = { title: 'Mobilité', component: MobilityPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  constructor(public navParams: NavParams,
              public app: App,
              public userS:UserService,
              public nav : NavController,
              private iab: InAppBrowser,
              private appAvailability: AppAvailability,
              private device: Device
            )
  {
      if(this.navParams.get('title') !== undefined) {
        this.title = this.navParams.get('title');
      }
      this.app.setTitle(this.title);
  }

  update(){
    this.userS.addCampus(this.where);
  }

  changePage(page) {
    //console.log(this.myApp.nav); //Comprendre comment utiliser app.component
    if(page.iosSchemaName != null && page.androidPackageName != null){
      this.launchExternalApp(page);
    }
    this.nav.push(page.component, {title: page.title});
    //console.log(this.MyApp);
    //this.myApp.openRootPage(page);
  }

  launchExternalApp(page) {
    let app: string;
    let storeUrl:string;
    if (this.device.platform === 'iOS') {
      app = page.iosSchemaName;
      storeUrl=page.httpUrl;
    } else if (this.device.platform === 'Android') {
      app = page.androidPackageName;
      storeUrl= 'market://details?id='+ app;
    } else {
      const browser = this.iab.create(page.httpUrl, '_system');
      browser.close();
    }
    this.appAvailability.check(app).then(
      () => { // success callback
        const browser = this.iab.create(page.appUrl, '_system');
        browser.close();
      },
      () => { // error callback
        //this.market.open(app);
      }
    );
  }
}
