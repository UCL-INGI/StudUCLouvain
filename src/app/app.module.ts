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
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Calendar } from '@ionic-native/calendar';
import { SecureStorage } from '@ionic-native/secure-storage';
import { NativeGeocoder } from '@ionic-native/native-geocoder';



import { EventsPage } from '../pages/events/events';
import { EventsFilterPage } from '../pages/events/events-filter/events-filter';
import { EventsDetailsPage } from '../pages/events/events-details/events-details';
import { CarpoolingPage } from '../pages/carpooling/carpooling';
import { CoursePage } from '../pages/studies/course/course';
import { LibrariesPage } from '../pages/library/libraries';
import { LibraryDetailsPage } from '../pages/library/library-details/library-details';
import { MapPage } from '../pages/map/map';
import { MapLocationSelectorPage }
          from '../pages/map/map-location-selector/map-location-selector';
import { NewsPage } from '../pages/news/news';
import { NewsDetailsPage } from '../pages/news/news-details/news-details';
import { RestaurantPage } from '../pages/restaurant/restaurant';
import { StudiesPage } from '../pages/studies/studies';
import { HelpDeskPage } from '../pages/help-desk/help-desk';
import { ModalProjectPage } from '../pages/studies/modal-project/modal-project';
import { SportsPage } from '../pages/sports/sports';
import { SportsFilterPage } from '../pages/sports/sports-filter/sports-filter';
import { HomePage } from '../pages/home/homeC';

import { ConnectivityService } from '../providers/utils-services/connectivity-service';
import { CourseService } from '../providers/studies-services/course-service';
import { StudiesService } from '../providers/studies-services/studies-service';
import { EventsService } from '../providers/rss-services/events-service';
import { MapService } from '../providers/map-services/map-service'
import { POIService } from '../providers/map-services/poi-service';
import { UserService } from '../providers/utils-services/user-service';
import { RssService } from '../providers/rss-services/rss-service';
import { NewsService } from '../providers/rss-services/news-service';
import { LibrariesService } from '../providers/wso2-services/libraries-service';
import { AdeService } from '../providers/studies-services/ade-service';
import { Wso2Service } from '../providers/wso2-services/wso2-service';
import { SportsService } from '../providers/rss-services/sports-service';





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
    NewsPage,
    NewsDetailsPage,
    MapPage,
    ModalProjectPage,
    RestaurantPage,
    StudiesPage,
    HelpDeskPage,
    LibraryDetailsPage,
    SportsPage,
    SportsFilterPage,
    HomePage
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
    MapPage,
    ModalProjectPage,
    NewsPage,
    NewsDetailsPage,
    RestaurantPage,
    StudiesPage,
    HelpDeskPage,
    LibraryDetailsPage,
    SportsPage,
    SportsFilterPage,
    HomePage
  ],
  providers: [
    { provide : ErrorHandler, useClass : IonicErrorHandler},
    AppAvailability,
    ConnectivityService,
    CourseService,
    StudiesService,
    EventsService,
    InAppBrowser,
    MapService,
    Market,
    POIService,
    SQLite,
    UserService,
    Device,
    SplashScreen,
    StatusBar,
    GoogleMaps,
    Geolocation,
    Network,
    Calendar,
    NewsService,
    RssService,
    LibrariesService,
    SecureStorage,
    AdeService,
    CourseService,
    Wso2Service,
    NativeGeocoder,
    SportsService
  ]
})
export class AppModule {}
