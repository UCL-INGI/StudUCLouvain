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

import { Component } from '@angular/core';
import { NavController, NavParams, ModalController }
        from '@ionic/angular';

import { StudentService} from '../../../../services/wso2-services/student-service';

@Component({
  selector: 'page-modal-info',
  templateUrl: 'modal-info.html',
})
export class ModalInfoPage {
  course = this.navParams.get('course');
  year = this.navParams.get('year');
  information:any;
  langue;


  constructor(public navCtrl: NavController,

    public navParams: NavParams,
    public viewCtrl: ModalController,
    public studentService: StudentService)
  {
    this.getInfo().then(data => {
      console.log(data);
      this.information=data;
      this.langue=data.langue;
    });
  }

    getInfo() : Promise<any>{
      let response:any;
      return new Promise(resolve => {
        this.studentService.checkCourse(this.course.acronym,this.year).then(
        (data) =>{
          console.log(data);
          let res:any = data;
          console.log(res);
          if(data === 400) {

            this.closeModal();
            resolve(400);
          }
          else{
             let cahier = '';
            let campus = res.campus;
            let teacher = res.fichesIntervenants;
            let offres = res.fichesOffres;
            let langue = res.langueEnseignement;
            let loca = res.localisation;
            let credit = res.ects;
            let entite = res.entiteCharge
            let progpre = res.programmesEtPrerequis;
            let quadri = res.quadrimestre
            let resume = res.resumeCoursMap.entry[1].value;
            let vol = {'vol1':res.volTot1, 'vol2' : res.volTot2, 'vol1Coef':res.volTot1AvecCoef, 'vol2Coef': res.volTot2AvecCoef};
            if(res.cahierChargesExiste){
              cahier = res.cahierChargesMap.entry[1].value;
 
            }

            response={'cahierCharges':cahier, 'offre' : offres,
                        'campus':campus, 'entite': entite,
                        'prof': teacher, 'localisation': loca,
                        'credit' : credit, 'programmeprerequis' : progpre,
                        'quadri' : quadri, 'resume': resume, 'volume' : vol, 'langue':langue
                      };
                      console.log(response);
            resolve(response);
          }
          
        })
      })    
    }

   closeModal() {
 
     this.viewCtrl.dismiss();
   }


}
