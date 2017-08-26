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

import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Market } from '@ionic-native/market';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SQLite } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Calendar } from '@ionic-native/calendar';
import { SecureStorage } from '@ionic-native/secure-storage';



import { EventsPage } from '../pages/events/events';
import { EventsFilterPage } from '../pages/events-filter/events-filter';
import { CarpoolingPage } from '../pages/carpooling/carpooling';
import { CoursePage } from '../pages/studies/course/course';
import { EventsDetailsPage } from '../pages/events-details/events-details';
import { LibrariesPage } from '../pages/library/libraries';
import { LibraryDetailsPage } from '../pages/library-details/library-details';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MapLocationSelectorPage }
          from '../pages/map-location-selector/map-location-selector';
import { NewsPage } from '../pages/news/news';
import { NewsDetailsPage } from '../pages/news-details/news-details';
import { RestaurantPage } from '../pages/restaurant/restaurant';
import { StudiesPage } from '../pages/studies/studies';
import { HelpDeskPage } from '../pages/help-desk/help-desk';
import { ModalProjectPage } from '../pages/studies/modal-project/modal-project';


import { AuthService } from '../providers/auth-service';
import { ConnectivityService } from '../providers/connectivity-service';
import { CourseService } from '../providers/studies-services/course-service';
import { StudiesService } from '../providers/studies-services/studies-service';
import { DatabaseService } from '../providers/database-service';
import { EventsService } from '../providers/events-service';
import { MapService } from '../providers/map-service'
import { POIService } from '../providers/poi-service';
import { UserData } from '../providers/user-data';
import { RssService } from '../providers/rss-service';
import { NewsService } from '../providers/news-service';
import { LibrariesService } from '../providers/libraries-service';
import { AdeService } from '../providers/studies-services/ade-service';





@NgModule({
  declarations: [
    MyApp,
    EventsPage,
    EventsFilterPage,
    MapLocationSelectorPage,
    CarpoolingPage,
    CoursePage,
    EventsDetailsPage,
    LibrariesPage,
    LoginPage,
    NewsPage,
    NewsDetailsPage,
    MapPage,
    ModalProjectPage,
    RestaurantPage,
    StudiesPage,
    HelpDeskPage,
    LibraryDetailsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EventsPage,
    EventsFilterPage,
    MapLocationSelectorPage,
    CarpoolingPage,
    CoursePage,
    EventsDetailsPage,
    LibrariesPage,
    LoginPage,
    MapPage,
    ModalProjectPage,
    NewsPage,
    NewsDetailsPage,
    RestaurantPage,
    StudiesPage,
    HelpDeskPage,
    LibraryDetailsPage
  ],
  providers: [
    { provide : ErrorHandler, useClass : IonicErrorHandler},
    AppAvailability,
    AuthService,
    ConnectivityService,
    CourseService,
    StudiesService,
    DatabaseService,
    EventsService,
    InAppBrowser,
    MapService,
    Market,
    POIService,
    SQLite,
    UserData,
    Device,
    SplashScreen,
    StatusBar,
    Geolocation,
    Network,
    Calendar,
    NewsService,
    RssService,
    LibrariesService,
    SecureStorage,
    AdeService,
    CourseService
  ]
})
export class AppModule {}
