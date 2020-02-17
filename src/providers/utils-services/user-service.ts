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

import { Events } from 'ionic-angular';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserService {

  favorites: string[] = [];
  sports: string[] = [];
  campus = '';
  slots: Array<{ course: string, TP: string, CM: string }> = [];
  fac = '';
  disclaimer = false;

  constructor(
    public eventss: Events,
    public storage: Storage
  ) {
    // USE THIS LINE TO CLEAR THE STORAGE
    // storage.clear();
    this.getFavorites();
    // this.storage.set('campus',"");
    this.getStringData('campus');
    this.getSports();
    this.getSlots();
    this.getStringData('fac');
  }

  getFavorites() {
    this.favorites = this.getFromStorage('listEvents');
  }

  private getFromStorage(key: string) {
    this.storage.get(key).then(data => {
      return data ? data : [];
    });
    return [];
  }

  getSports() {
    this.sports = this.getFromStorage('listSports');
  }

  getStringData(key: string) {
    let temp = key === 'campus' ? this.campus : this.fac;
    this.storage.get(key).then((data) => temp = data ? data : '');
    key === 'campus' ? this.campus = temp : this.fac = temp;
  }

  getSlots() {
    this.slots = this.getFromStorage('slots');
  }

  getSlotCM(acronym: string) {
    const index = this.slots.findIndex(item => item.course === acronym);
    return index > -1 ? this.slots[index].CM : '';
  }

  getSlotTP(acronym: string) {
    const index = this.slots.findIndex(item => item.course === acronym);
    return index > -1 ? this.slots[index].TP : '';
  }

  hasFavorite(itemGuid: string) {
    return (this.favorites.indexOf(itemGuid) > -1);
  }

  hasFavoriteS(itemGuid: string) {
    return (this.sports.indexOf(itemGuid) > -1);
  }

  hasCampus() {
    return (this.campus.length > 0);
  }

  hasFac() {
    return (this.fac.length > 0);
  }

  hasSlotTP(acronym: string) {
    const index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      return this.slots[index].TP.length > 0;
    } else { return index > -1; }

  }

  hasSlotCM(acronym: string) {
    const index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      return this.slots[index].CM.length > 0;
    } else { return index > -1; }
  }

  addFavorite(itemGuid: string, listType: string) {
    const fav = listType === 'listEvents' ? this.favorites : this.sports;
    fav.push(itemGuid);
    this.storage.set(listType, fav);
    listType === 'listEvents' ? this.favorites = fav : this.sports = fav;
  }

  removeFavorite(itemGuid: string, listType: string) {
    const fav = listType === 'listEvents' ? this.favorites : this.sports;
    const index = fav.indexOf(itemGuid);
    if (index > -1) {
      fav.splice(index, 1);
    }
    this.storage.set(listType, fav);
    listType === 'listEvents' ? this.favorites = fav : this.sports = fav;
  }

  addCampus(campus: string) {
    this.campus = campus;
    this.storage.set('campus', this.campus);
  }

  removeCampus(campus: string) {
    this.campus = '';
    this.storage.set('campus', this.campus);
  }

  addFac(fac: string) {
    this.fac = fac;
    this.storage.set('fac', this.fac);
  }

  removeFac(fac: string) {
    this.fac = '';
    this.storage.set('fac', this.fac);
  }

  addSlotTP(acronym: string, slot: string) {
    const index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      this.slots[index].TP = slot;
    } else {
      const item = { course: acronym, TP: slot, CM: '' };
      this.slots.push(item);
    }
    this.storage.set('slots', this.slots);
  }

  removeSlot(acronym: string, isTP: boolean) {
    const index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      isTP ? this.slots[index].TP = '' : this.slots[index].CM = '';
    }
    this.storage.set('slots', this.slots);
  }

  addSlotCM(acronym: string, slot: string) {
    const index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      this.slots[index].CM = slot;
    } else {
      const item = { course: acronym, TP: '', CM: slot };
      this.slots.push(item);
    }
    this.storage.set('slots', this.slots);
  }
}
