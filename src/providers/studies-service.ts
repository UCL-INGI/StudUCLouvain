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
import X2JS from 'x2js';
import { AdeService } from './ade-service';
import { AdeProject } from '../app/entity/adeProject';


@Injectable()
export class StudiesService {
  url:String;
  projects : AdeProject[];

  data:any;
    constructor(
      public http: Http,
      public ade : AdeService) {}


    openSession() {
    return new Promise( (resolve, reject) => {
      console.log("StudiesService openSession")
      this.ade.httpOpenSession().subscribe(
        data => {
          console.log("data");
          console.log(data);
          resolve( data.session._id);
        }
      );
    });
  }

  getProjects(sessionId : string) {
  return new Promise( (resolve, reject) => {
    console.log("Studiesservice getProjects")
    this.ade.httpGetProjects(sessionId).subscribe(
      data => {
        console.log("project");
        console.log(data.projects);
        resolve(this.extractAdeProjects(data));
        }
      );
    });
  }

  extractAdeProjects(data) : AdeProject[]{
    let projects : AdeProject[] = [];
    for(let i=0 ; i<data.projects.project.length ; i++){
      let name = data.projects.project[i]._name.toString();
      console.log("name : " + name);
      let id = data.projects.project[i]._id.toString();
      console.log("id : "+ id);
      let project = new AdeProject(id, name);
      console.log("project" + project)
      console.log("projects" + projects)
      projects.push(project)

    }
    console.log("extractAdeProjects return projects ");
    console.log(projects);
    return projects;
  }


  setProject(sessionId : string, projectId : string){
    return new Promise( (resolve, reject) => {
      console.log("studiesService setProject:" + sessionId + " projectId : " +  projectId);
      this.ade.httpSetProject(sessionId, projectId).subscribe(
        data => { resolve(data);       }
      );
    });
  }

}
