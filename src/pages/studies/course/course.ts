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
import { NavController, NavParams, ItemSliding, ToastController, AlertController  }
  from 'ionic-angular';
import { CourseService }
  from '../../../providers/studies-services/course-service';
import { Course } from '../../../app/entity/course';
import { Activity } from '../../../app/entity/activity'
import { Calendar } from '@ionic-native/calendar';
import { UserService } from '../../../providers/utils-services/user-service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-course',
  templateUrl: 'course.html'
})
export class CoursePage {
  sessionId : string = this.navParams.get('sessionId');
  course : Course = this.navParams.get("course");
  segment = 'Cours magistral';
  slotTP:string = "no";
  slotCM:string = "no";
  displayedActi : Array<Activity> = [];

  constructor(public navCtrl: NavController,
    public courseService: CourseService,
    private calendar: Calendar,
    public toastCtrl: ToastController,
    public userS:UserService,
    private alertCtrl : AlertController,
    private translateService: TranslateService,
    public navParams:NavParams) {

      let acro = this.course.acronym;
      if(this.userS.hasSlotCM(acro)){
        this.slotCM = this.userS.getSlotCM(acro);
        this.updateDisplayedCM();
      }
      if(this.userS.hasSlotTP(acro)){
        this.slotTP = this.userS.getSlotTP(acro);
        this.updateDisplayedTP();
      }
  }

  ionViewDidLoad() {
    this.getCourse(this.sessionId, this.course.acronym);
    //this.displayedActi = this.course.activities;

  }

  getCourse(sessionId : string, acronym : string){
    this.courseService.getCourseId(sessionId, acronym).then(
      data => {
        let courseId = data;
        this.courseService.getActivity(sessionId, courseId).then(
          data => {
            this.course.activities = data.sort(
              (a1,a2) => a1.start.valueOf() - a2.start.valueOf()
            );//.filter(
              //  activitie => activitie.end.valueOf() > Date.now().valueOf()
              //); // display only activities finished after now time
              this.displayedActi=this.course.activities;
          }
        )
      }
    )
  }

  addToCalendar(slidingItem : ItemSliding, activity : Activity){
    let options:any = {
    };
    let message:string;
    this.translateService.get('COURSE.MESSAGE').subscribe((res:string) => {message=res;});
    this.calendar.createEventWithOptions(this.course.name +" : " + activity.type,
      activity.auditorium, null, activity.start,
      activity.end, options).then(() => {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000
        });
        toast.present();
        slidingItem.close();
    });
  }

  updateDisplayedTP(){
      let toFilter;
      if(this.course.activities != null) toFilter = this.course.activities;
      else toFilter = this.displayedActi;
      
      if(this.slotTP != "no")this.displayedActi = toFilter.filter(acti => (acti.type ==="Cours magistral" || acti.isExam || acti.name === this.slotTP));
      else this.displayedActi = this.course.activities;
  }

  updateDisplayedCM(){
      let toFilter;
      if(this.course.activities != null) toFilter = this.course.activities;
      else toFilter = this.displayedActi;
    
      if(this.slotCM != "no") this.displayedActi = toFilter.filter(acti => (acti.type === "TD" || acti.type ==="TP" || acti.isExam || acti.name === this.slotCM));
      else this.displayedActi = this.course.activities;
  }

  updateDisplayed(){
    if(this.slotCM!="no") this.updateDisplayedCM();
    if(this.slotTP != "no") this.updateDisplayedTP();
  }

  showPrompt(segment: string){

    var options = {
      title: 'Séances',
      message: 'Choisissez votre séance',
      inputs : [],
      buttons : [
      {
          text: "Annuler",
          handler: data => {

          }
      },
      {
          text: "Appliquer",
          handler: data => {
            if(segment == "Cours magistral") {
              this.slotCM = data;
              this.updateDisplayedCM();
              this.userS.addSlotCM(this.course.acronym,this.slotCM);
            }
            if(segment == "TD") {
              this.slotTP = data;
              this.updateDisplayedTP();
              this.userS.addSlotTP(this.course.acronym,this.slotTP);
            }

          }
      }]};

    let array = this.getSlots(segment);
    for(let i=0; i< array.length; i++) {
      options.inputs.push({ name : 'options', value: array[i].name , label: array[i].name + " " + array[i].start.getHours()+":"+array[i].start.getUTCMinutes() , type: 'radio' });
    }
    if(options.inputs.length > 1) options.inputs.push({name:'options', value:"no", label : "Aucun", type : 'radio'});
    let prompt = this.alertCtrl.create(options);
    if(options.inputs.length > 1)prompt.present();
  }

  getSlots(segment:string){
    let act: Activity[] = this.course.activities;
     act = act.filter(
      acti => (acti.type == segment || (acti.type == "TP" && segment == "TD") || (segment == "Examen" && acti.isExam))
      );
    //console.log(acttemp);
    let slots = act.map(item => item.name)
      .filter((value, index, self) => self.indexOf(value) === index); //keep only different
      //console.log(act);
    if(segment == "TD") slots = slots.filter(acti => acti.indexOf("_") !== -1);
    if(segment == "Cours magistral") slots = slots.filter(acti => acti.indexOf("-") !== -1);
    let newAct: Activity[] = [];

    for(let i=0; i< slots.length; i++){
      let activity:Activity = act.find(acti => acti.name == slots[i]);
      newAct.push(activity);
    }

    return newAct;

  //console.log((actfin));

  }

}
