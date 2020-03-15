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

import { ModalController, NavParams } from '@ionic/angular';

import { Component } from '@angular/core';
import { UtilsService } from "../../../services/utils-services/utils-service";

@Component({
  selector: 'page-sports-filter',
  templateUrl: 'sports-filter.html'
})
export class SportsFilterPage {
  categories: Array<{ name: string; isChecked: boolean }> = [];
  dateRange: any;
  results: any = [];

  constructor(public navParams: NavParams, public utilsService: UtilsService, public modalCtrl: ModalController) {
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

  applyFilters(cancel: boolean = false, categories, results, dateRange) {
    const excludedFilters = cancel ? [] : categories.filter(c => !c.isChecked).map(c => c.name);
    results.push(excludedFilters);
    results.push(dateRange);
    this.modalCtrl.dismiss(results);
  }
}
