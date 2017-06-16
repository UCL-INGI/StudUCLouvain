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
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';
//import xml2json from 'xml2json';

@Injectable()
export class CursusListService {
  url:String;

  data:any;
    constructor(public http: Http) {
      console.log('Hello PeopleService Provider');
      //this.url= 'http://horairev6.uclouvain.be/direct/index.jsp?login=etudiant&password=student';

    }

    load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      console.log("coucou")
      this.http.get('http://horairev6.uclouvain.be/jsp/webapi?function=connect&login=etudiant&password=student')
      .map(res => {
        console.log(res);
        //let posts = res.json();
        xml2js.parseString(res, ((result) => {
        console.log(result);
        return result;
        }));
        }).subscribe(
        (data) => console.log(data),
        (err) => console.log(err)
        );
    });
  }

}
