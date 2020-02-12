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

import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Component } from '@angular/core';

import { StudentService } from '../../../../providers/wso2-services/student-service';

@IonicPage()
@Component({
  selector: 'page-modal-info',
  templateUrl: 'modal-info.html'
})
export class ModalInfoPage {
  course = this.navParams.get('course');
  year = this.navParams.get('year');
  information: any;
  langue;

  constructor(
    public navCtrl: NavController,

    public navParams: NavParams,
    public viewCtrl: ViewController,
    public studentService: StudentService
  ) {
    this.getInfo().then(data => {
      this.information = data;
      this.langue = data.langue;
    });
  }

  getInfo(): Promise<any> {
    let response: any;
    return new Promise(resolve => {
      this.studentService
        .checkCourse(this.course.acronym, this.year)
        .then((res: any) => {
          if (res === 400) {
            this.closeModal();
            resolve(400);
          } else {
            let cahier = '';
            const campus = res.campus.name;
            const teacher = res.fichesIntervenants;
            const offres = res.fichesOffres;
            const langue = res.language;
            const loca = res.campus.name;
            const credit = res.credits;
            const entite = res.allocation_entity;
            const progpre = res.programmesEtPrerequis;
            const quadri = res.quadrimester_text;
            // const resume = res.resumeCoursMap.entry[1].value;
            const resume = res.resumeCoursMap;
            const volume = { vol1: '', vol2: '', vol1Coef: '', vol2Coef: '' };
            for (const vol of res.components) {
              if (vol.type === 'LECTURING') {
                volume.vol1 = vol.hourly_volume_total_annual;
              } else if (vol.type === 'PRACTICAL_EXERCISES') {
                volume.vol2 = vol.hourly_volume_total_annual;
              }
            }
            if (res.cahierChargesExiste) {
              cahier = res.cahierChargesMap.entry[1].value;
            }

            response = {
              cahierCharges: cahier,
              offre: offres,
              campus: campus,
              entite: entite,
              prof: teacher,
              localisation: loca,
              credit: credit,
              programmeprerequis: progpre,
              quadri: quadri,
              resume: resume,
              volume: volume,
              langue: langue
            };
            resolve(response);
          }
        });
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
