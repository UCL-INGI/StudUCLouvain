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
//import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { NgCalendarModule } from 'ionic2-calendar';



import { EventsPage } from '../pages/events/events';
import { EventsFilterPage } from '../pages/events/events-filter/events-filter';
import { EventsDetailsPage } from '../pages/events/events-details/events-details';
import { MobilityPage } from '../pages/mobility/mobility';
import { CarpoolingPage } from '../pages/mobility/carpooling/carpooling';
import { BusPage } from '../pages/mobility/bus/bus';
import { TrainPage } from '../pages/mobility/train/train';
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
import { EmployeeDetailsPage } from '../pages/help-desk/employee-details/employee-details';
import { HelpDeskPage } from '../pages/help-desk/help-desk';
import { CreditPage } from '../pages/credit/credit';
import { ModalProjectPage } from '../pages/studies/modal-project/modal-project';
import { SportsPage } from '../pages/sports/sports';
import { SportsFilterPage } from '../pages/sports/sports-filter/sports-filter';
import { HomePage } from '../pages/home/home';
import { GuindaillePage } from '../pages/guindaille2-0/guindaille2-0';
import { ParamPage } from '../pages/param/param';

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
import { StudentService } from '../providers/wso2-services/student-service';
import { SportsService } from '../providers/rss-services/sports-service';
import { RepertoireService } from '../providers/wso2-services/repertoire-service';


export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http,'./assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    EventsPage,
    EventsFilterPage,
    MapLocationSelectorPage,
    MobilityPage,
    TrainPage,
    CarpoolingPage,
    BusPage,
    ParamPage,
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
    GuindaillePage,
    LibraryDetailsPage,
    SportsPage,
    SportsFilterPage,
    HomePage,
    CreditPage,
    EmployeeDetailsPage
  ],
  exports: [
    TranslateModule
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    //NgCalendarModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
        }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EventsPage,
    EventsFilterPage,
    MapLocationSelectorPage,
    MobilityPage,
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
    ParamPage,
    CreditPage,
    GuindaillePage,
    LibraryDetailsPage,
    SportsPage,
    SportsFilterPage,
    HomePage,
    CarpoolingPage,
    BusPage,
    TrainPage,
    EmployeeDetailsPage
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
    SportsService,
    RepertoireService,
    StudentService
  ]
})
export class AppModule {}
