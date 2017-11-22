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
import { NavParams, App, Nav, MenuController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { AppAvailability } from '@ionic-native/app-availability';
import { UserService } from '../../providers/utils-services/user-service';
import { Storage } from '@ionic/storage';
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
  @ViewChild('Nav') nav: Nav;
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

  carPage = { title: 'Mobilité', component: MobilityPage,
    iosSchemaName: 'net.commuty.mobile',
    androidPackageName: 'net.commuty.mobile',
    appUrl: 'commutynet://', httpUrl: 'https://app.commuty.net/sign-in' };

  constructor(public navParams: NavParams,
              public app: App,
              public userS:UserService,
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
    console.log(this.myApp.nav); //Comprendre comment utiliser app.component
    console.log(page);
    this.myApp.openRootPage(page);
  }
}
