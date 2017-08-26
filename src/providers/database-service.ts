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
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseService {
  public database: SQLiteObject;
    private options = { name: "test.db", location: 'default', createFromLocation: 1 };
    constructor(public platform: Platform, private sqlite: SQLite) {
      console.log('Hello DatabaseService Provider');
      this.platform.ready().then(() => {
        this.sqlite.create(this.options)
        .then((db : SQLiteObject) => {
          console.log("open database");
          this.database=db;
        }, (error) => {
          console.log("ERROR: ", error);
        }
      )

        /*this.database= new SQLite();
        this.database.openDatabase(this.options).then(() => {
            console.log("open database");

        }, (error) => {
            console.log("ERROR: ", error);
        });*/
      });
    }
}
