/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
    This file is part of Stud.UCLouvain
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    Stud.UCLouvain is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Stud.UCLouvain is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Stud.UCLouvain.  If not, see <http://www.gnu.org/licenses/>.
*/

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CacheModule } from 'ionic-cache';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { AppVersion } from '@ionic-native/app-version';
import { Calendar } from '@ionic-native/calendar';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Market } from '@ionic-native/market';
import { Network } from '@ionic-native/network';
import { SecureStorage } from '@ionic-native/secure-storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MapService } from '../providers/map-services/map-service';
import { POIService } from '../providers/map-services/poi-service';
import { EventsService } from '../providers/rss-services/events-service';
import { NewsService } from '../providers/rss-services/news-service';
import { RssService } from '../providers/rss-services/rss-service';
import { SportsService } from '../providers/rss-services/sports-service';
import { AdeService } from '../providers/studies-services/ade-service';
import { CourseService } from '../providers/studies-services/course-service';
import { StudiesService } from '../providers/studies-services/studies-service';
import { ConnectivityService } from '../providers/utils-services/connectivity-service';
import { FacService } from '../providers/utils-services/fac-service';
import { UserService } from '../providers/utils-services/user-service';
import { LibrariesService } from '../providers/wso2-services/libraries-service';
import { RepertoireService } from '../providers/wso2-services/repertoire-service';
import { StudentService } from '../providers/wso2-services/student-service';
import { Wso2Service } from '../providers/wso2-services/wso2-service';
import { MyApp } from './app.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [MyApp],
  exports: [TranslateModule],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CacheModule.forRoot({ keyPrefix: 'UCL-cache' }),
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppAvailability,
    ConnectivityService,
    CourseService,
    StudiesService,
    EventsService,
    MapService,
    Market,
    POIService,
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
    AdeService,
    CourseService,
    Wso2Service,
    SportsService,
    RepertoireService,
    StudentService,
    FacService,
    SQLite,
    SecureStorage,
    AppVersion,
    Diagnostic
  ]
})
export class AppModule { }
