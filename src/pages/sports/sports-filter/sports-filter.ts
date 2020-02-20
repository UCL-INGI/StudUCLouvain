/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
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

import {IonicPage, NavParams, ViewController} from 'ionic-angular';

import {Component} from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-sports-filter',
  templateUrl: 'sports-filter.html'
})
export class SportsFilterPage {
  categories: Array<{ name: string; isChecked: boolean }> = [];
  dateRange: any;
  results: any = [];

  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    // passed in array of categories names that should be excluded (unchecked)
    const excludedFilters = this.navParams.get('excludedFilters');
    const filters = this.navParams.get('filters');
    this.dateRange = this.navParams.get('dateRange');
    for (const filterName of filters) {
      this.categories.push({
        name: filterName,
        isChecked: excludedFilters.indexOf(filterName) === -1
      });
    }
  }

  /*Reset all of the toggles to be checked*/
  resetFilters() {
    this.categories.forEach(category => {
      category.isChecked = true;
    });
  }

  /*Uncheck all sports from the filter*/
  uncheckAll() {
    this.categories.forEach(category => {
      category.isChecked = false;
    });
  }

  /*Pass back a new array of categories name to exclude*/
  applyFilters() {
    const excludedFilters = this.categories
      .filter(c => !c.isChecked)
      .map(c => c.name);
    this.dismiss(excludedFilters);
  }

  /*Dismiss filter*/
  dismiss(data?: any) {
    if (typeof data === 'undefined') {
      data = [];
    }
    this.results.push(data);
    this.results.push(this.dateRange);
    this.viewCtrl.dismiss(this.results);
  }
}
