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

import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Market } from '@ionic-native/market/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Calendar } from '@ionic-native/calendar/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { CacheModule } from 'ionic-cache';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

import { ConnectivityService } from './services/utils-services/connectivity-service';
import { FacService } from './services/utils-services/fac-service';
import { CourseService } from './services/studies-services/course-service';
import { StudiesService } from './services/studies-services/studies-service';
import { EventsService } from './services/rss-services/events-service';
import { MapService } from './services/map-services/map-service'
import { POIService } from './services/map-services/poi-service';
import { UserService } from './services/utils-services/user-service';
import { RssService } from './services/rss-services/rss-service';
import { NewsService } from './services/rss-services/news-service';
import { LibrariesService } from './services/wso2-services/libraries-service';
import { AdeService } from './services/studies-services/ade-service';
import { Wso2Service } from './services/wso2-services/wso2-service';
import { StudentService } from './services/wso2-services/student-service';
import { SportsService } from './services/rss-services/sports-service';
import { RepertoireService } from './services/wso2-services/repertoire-service';
import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http,'./assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    AppComponent
  ],
  exports: [
    TranslateModule
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CacheModule.forRoot({ keyPrefix: 'UCL-cache' }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    
  ],
  providers: [
    { provide : ErrorHandler, useClass : ErrorHandler},
    AppAvailability,
    ConnectivityService,
    CourseService,
    StudiesService,
    EventsService,
    InAppBrowser,
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
    NativeGeocoder,
    SportsService,
    RepertoireService,
    StudentService,
    FacService,
    SQLite,
    SecureStorage,
    AppVersion,
    Diagnostic,
    Toast,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
export class AppModule {}
