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

//import { EventItem } from '../../app/entity/eventItem';
//import { SportItem } from '../../app/entity/sportItem';


@Injectable()
export class UserService {

  favorites: string[] = [];
  sports: string[] = [];
  campus: string = "";
  slots: Array<{ course: string, TP: string, CM: string }> = [];
  fac: string = "";
  disclaimer: boolean = false;

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
    this.getSlots();
    this.getFac();
    this.getDisclaimer();
  }

  getFavorites() {
    this.storage.get('listEvents').then((data) => {
      if (data == null) {
        this.favorites = [];
      } else {
        this.favorites = data;
      }
    });
  }

  getSports() {
    this.storage.get('listSports').then((data) => {
      if (data == null) {
        this.sports = [];
      } else {
        this.sports = data;
      }
    });
  }

  getCampus() {
    this.storage.get('campus').then((data) => {
      if (data == null) {
        this.campus = "";
      } else {
        this.campus = data;
      }
    });
  }

  getDisclaimer() {
    this.storage.get('disclaimer').then((data) => {
      if (data == null) {
        this.disclaimer = false;
      } else {
        this.disclaimer = data;
      }
    });
  }

  getFac() {
    this.storage.get('fac').then((data) => {
      if (data == null) {
        this.fac = "";
      } else {
        this.fac = data;
      }
    });
  }

  getSlots() {
    this.storage.get('slots').then((data) => {
      if (data == null) {
        this.slots = [];
      }
      else {
        this.slots = data;
      }
    })
  }

  getSlotCM(acronym: string) {
    var index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) return this.slots[index].CM;
    else return "";
  }

  getSlotTP(acronym: string) {
    var index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) return this.slots[index].TP;
    else return "";
  }

  hasFavorite(itemGuid: string) {
    return (this.favorites.indexOf(itemGuid) > -1);
  };

  hasFavoriteS(itemGuid: string) {
    return (this.sports.indexOf(itemGuid) > -1);
  };

  hasCampus() {
    return (this.campus.length > 0);
  }

  hasFac() {
    return (this.fac.length > 0);
  }

  hasDisclaimer() {
    return (this.disclaimer == true);
  }

  hasSlotTP(acronym: string) {
    var index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      return this.slots[index].TP.length > 0;
    }
    else return index > -1;

  }

  hasSlotCM(acronym: string) {
    var index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      return this.slots[index].CM.length > 0;
    }
    else return index > -1;
  }

  addDisclaimer(discl: boolean) {
    this.disclaimer = discl;
    this.storage.set('disclaimer', this.disclaimer);
  }

  removeDisclaimer(discl: boolean) {
    this.disclaimer = false;
    this.storage.set('disclaimer', this.disclaimer);
  }

  addFavorite(itemGuid: string) {
    this.favorites.push(itemGuid);
    this.storage.set('listEvents', this.favorites);

  };

  removeFavorite(itemGuid: string) {
    let index = this.favorites.indexOf(itemGuid);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    this.storage.set('listEvents', this.favorites);
  };

  addFavoriteS(itemGuid: string) {
    this.sports.push(itemGuid);
    this.storage.set('listSports', this.sports);
  };

  removeFavoriteS(itemGuid: string) {
    let index = this.sports.indexOf(itemGuid);
    if (index > -1) {
      this.sports.splice(index, 1);
    }
    this.storage.set('listSports', this.sports);
  };


  addCampus(campus: string) {
    this.campus = campus;
    this.storage.set('campus', this.campus);
  };

  removeCampus(campus: string) {
    this.campus = "";
    this.storage.set('campus', this.campus);
  };

  addFac(fac: string) {
    this.fac = fac;
    this.storage.set('fac', this.fac);
  };

  removeFac(fac: string) {
    this.fac = "";
    this.storage.set('fac', this.fac);
  };

  addSlotTP(acronym: string, slot: string) {
    var index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      this.slots[index].TP = slot;
    }
    else {
      let item = { course: acronym, TP: slot, CM: "" };
      this.slots.push(item);
    }
    this.storage.set('slots', this.slots);
  }

  removeSlotTP(acronym: string) {
    var index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      this.slots[index].TP = "";
    }
    this.storage.set('slots', this.slots);
  }

  addSlotCM(acronym: string, slot: string) {
    var index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      this.slots[index].CM = slot;
    }
    else {
      let item = { course: acronym, TP: "", CM: slot };
      this.slots.push(item);
    }
    this.storage.set('slots', this.slots);
  }

  removeSlotCM(acronym: string) {
    var index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      this.slots[index].CM = "";
    }
    this.storage.set('slots', this.slots);
  }

}
