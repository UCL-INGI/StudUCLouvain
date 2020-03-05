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


export class Page {
    title: string;
    component: any;
    icon: any;
    iosSchemaName: string;
    androidPackageName: string;
    appUrl: string;
    httpUrl: string;

  constructor(
    title: string,
    component: any,
    icon: any,
    iosSchemaName: string,
    androidPackageName: string,
    appUrl: string,
    httpUrl: string,
  ) {
    this.title = title;
    this.component = component;
    this.icon = icon;
    this.iosSchemaName = iosSchemaName;
    this.androidPackageName = androidPackageName;
    this.appUrl = appUrl;
    this.httpUrl = httpUrl;
  }
}
