/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

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

import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UserData {
  _favorites: string[] = [];

  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  hasFavorite(itemGuid: string) {
    return (this._favorites.indexOf(itemGuid) > -1);
  };

  addFavorite(itemGuid: string) {
    this._favorites.push(itemGuid);
  };

  removeFavorite(itemGuid: string) {
    let index = this._favorites.indexOf(itemGuid);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };
}
