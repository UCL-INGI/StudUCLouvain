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

import { IonicPage, NavParams } from 'ionic-angular';

import { Component } from '@angular/core';

import { EventsService } from '../../../providers/rss-services/events-service';
import { UtilsService } from "../../../providers/utils-services/utils-service";

@IonicPage()
@Component({
  selector: 'page-events-filter',
  templateUrl: 'events-filter.html'
})
export class EventsFilterPage {
  categories: Array<{
    name: string;
    iconCategory: string;
    isChecked: boolean;
  }> = [];
  dateRange: any;
  results: any = [];

  constructor(
    public navParams: NavParams,
    private eventService: EventsService,
    public utilsService: UtilsService
  ) {
    const excludedFilters = this.navParams.get('excludedFilters');
    const filters = this.navParams.get('filters');
    this.dateRange = this.navParams.get('dateRange');
    for (const filterName of filters) {
      this.categories.push({
        name: filterName,
        iconCategory: this.eventService.getIconCategory(filterName),
        isChecked: excludedFilters.indexOf(filterName) === -1
      });
    }
  }

  resetFilters() {
    this.categories.forEach(category => {
      category.isChecked = true;
    });
  }

  uncheckAll() {
    this.categories.forEach(category => {
      category.isChecked = false;
    });
  }
}
