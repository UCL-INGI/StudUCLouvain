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

import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { EventItem } from '../../app/entity/eventItem';
//import { SportItem } from '../../app/entity/sportItem';


@Injectable()
export class UserService {

  favorites: string[] = [];
  sports: string[] = [];
  campus: string = "";

  constructor(
    public eventss: Events,
    public storage: Storage
  ) {
    //USE THIS LINE TO CLEAR THE STORAGE
    //storage.clear();
    this.getFavorites();
    //this.storage.set('campus',"");
    this.getCampus();
    this.getSports();
  }

  getFavorites(){
    this.storage.get('listEvents').then((data) =>
    {
      if(data==null){
        this.favorites=[];
      } else {
        this.favorites=data;
        }
    });
  }

  getSports(){
    this.storage.get('listSports').then((data) =>
    {
      if(data==null){
        this.sports=[];
      } else {
        this.sports=data;
        }
    });
  }

  hasFavorite(itemGuid: string) {
    return (this.favorites.indexOf(itemGuid) > -1);
  };

  addFavorite(itemGuid: string) {
    this.favorites.push(itemGuid);
    this.storage.set('listEvents',this.favorites);
    
  };

  removeFavorite(itemGuid: string) {
    let index = this.favorites.indexOf(itemGuid);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    this.storage.set('listEvents',this.favorites);
  };

  getCampus(){
    this.storage.get('campus').then((data) =>
    {
      if(data == null){
        this.campus = "";
      } else {
        this.campus=data; 
        }
    });
  }

  hasCampus() {
    return(this.campus.length > 0);
  }

  addCampus(campus: string) {
    this.campus = campus;
    this.storage.set('campus',this.campus);
    
  };

  removeCampus(campus: string) {
    
    this.campus="";
    this.storage.set('campus',this.campus);
  };

  hasFavoriteS(itemGuid : string) {
    return (this.sports.indexOf(itemGuid) > -1);
  };

  addFavoriteS(itemGuid : string) {
    this.sports.push(itemGuid);
    this.storage.set('listSports',this.sports);
  };

  removeFavoriteS(itemGuid: string) {
    let index = this.sports.indexOf(itemGuid);
    if (index > -1) {
      this.sports.splice(index, 1);
    }
    this.storage.set('listSports',this.sports);
  };
}
