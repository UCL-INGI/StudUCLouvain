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

import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AdeProject } from '../../app/entity/adeProject';
import { AdeService } from './ade-service';

@Injectable()
export class StudiesService {
  url: String;
  projects: AdeProject[];
  data: any;
  constructor(
    public http: HttpClient,
    public ade: AdeService) { }

  /*Open session for the user*/
  openSession() {
    return new Promise<string>((resolve, reject) => {
      console.log('StudiesService openSession');
      this.ade.httpOpenSession().subscribe(
        data => {
          resolve(data.session._id);
        }
      );
    });
  }

  /*Get the projects ADE*/
  getProjects(sessionId: string) {
    return new Promise((resolve, reject) => {
      console.log('Studiesservice getProjects');
      this.ade.httpGetProjects(sessionId).subscribe(
        data => {
          resolve(this.extractAdeProjects(data));
        }
      );
    });
  }

  /*Extract the projects ADE*/
  extractAdeProjects(data): AdeProject[] {
    const projects: AdeProject[] = [];
    if (data.projects.project.length === undefined) {
      const name = data.projects.project._name.toString();
      const id = data.projects.project._id.toString();
      const project = new AdeProject(id, name);
      projects.push(project);
    } else {
      for (let i = 0; i < data.projects.project.length; i++) {
        const name = data.projects.project[i]._name.toString();
        const id = data.projects.project[i]._id.toString();
        const project = new AdeProject(id, name);
        projects.push(project);
      }
    }
    return projects;
  }

  /*Set the project selected by the user*/
  setProject(sessionId: string, projectId: string) {
    return new Promise((resolve, reject) => {
      this.ade.httpSetProject(sessionId, projectId).subscribe(
        data => { resolve(data); }
      );
    });
  }

}
