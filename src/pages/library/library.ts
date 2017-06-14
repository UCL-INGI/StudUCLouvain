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

import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
//import {DatabaseService} from '../../providers/database-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {
  private options = { name: "test.db", location: 'default', createFromLocation: 1 };
  public title: any;
  public bibliotheques;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private sqlite: SQLite) {
    this.title = this.navParams.get('title');
    this.platform.ready().then(() => {
        console.log("platform ready");
        this.refresh();
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  ionViewDidLoad() {
    console.log('Hello LibraryPage Page');
  }

  public refresh() {

    this.platform.ready().then(() => {
      this.sqlite.create(this.options)
      .then((db : SQLiteObject) => {
        console.log("open database");
        db.executeSql("SELECT * FROM library", []).then((data) => {
              console.log("refresh");
              console.log(data);
              console.log("REFRESHED: " + JSON.stringify(data));
              this.bibliotheques = [];
              if(data.rows.length > 0) {
                  for(var i = 0; i < data.rows.length; i++) {
                      this.bibliotheques.push({sigle: data.rows.item(i).SIGLE});
                  }
              }
              console.log(this.bibliotheques);
          }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
          });
      }, (error) => {
        console.log("ERROR: ", error);
      }
    )
    });
  /*  this.database.database.executeSql("SELECT * FROM library", []).then((data) => {
        console.log("refresh");
        console.log(data);
        console.log("REFRESHED: " + JSON.stringify(data));
        this.bibliotheques = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                this.bibliotheques.push({sigle: data.rows.item(i).SIGLE});
            }
        }
        console.log(this.bibliotheques);
    }, (error) => {
        console.log("ERROR: " + JSON.stringify(error));
    });*/
}

}
