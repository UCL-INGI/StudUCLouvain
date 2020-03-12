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


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AdeProject } from '../../app/entity/adeProject';
import { AdeService } from './ade-service';
import { ToastController } from "@ionic/angular";
import { UtilsService } from "../utils-services/utils-service";

@Injectable()
export class StudiesService {
  url: string;
  projects: AdeProject[];
  data: any;

  constructor(
    public http: HttpClient,
    public ade: AdeService,
    private toastCtrl: ToastController,
    private utilsService: UtilsService
  ) {}

  toastCourse(textKey: string) {
    return this.toastCtrl.create({
      message: this.utilsService.getText('STUDY', textKey),
      duration: 2000,
      position: 'middle'
    });
  }

  openSession() {
    return new Promise<string>((resolve) => {
      this.ade.httpOpenSession().subscribe((data: any) => resolve(data.session._id));
    });
  }

  getProjects(sessionId: string) {
    return new Promise((resolve) => {
      this.ade.httpGetProjects(sessionId).subscribe(data => resolve(this.extractAdeProjects(data)));
    });
  }

  extractAdeProjects(data: any): AdeProject[] {
    const projects: AdeProject[] = [];
    if (data.projects.project.length === undefined) {
      projects.push(new AdeProject(
        data.projects.project._id.toString(),
        data.projects.project._name.toString()
      ));
    } else {
      for (let i = 0; i < data.projects.project.length; i++) {
        projects.push(new AdeProject(
          data.projects.project[i]._id.toString(),
          data.projects.project[i]._name.toString()
        ));
      }
    }
    return projects;
  }

  setProject(sessionId: string, projectId: string) {
    return new Promise((resolve) => {
      this.ade.httpSetProject(sessionId, projectId).subscribe(data => resolve(data));
    });
  }
}
