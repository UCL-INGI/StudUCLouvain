/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
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
import { AlertController, ModalController, NavController, NavParams, ToastController } from '@ionic/angular';

import { Component } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';

import { Activity } from '../../../app/entity/activity';
import { Course } from '../../../app/entity/course';
import { CourseService } from '../../../providers/studies-services/course-service';
import { UserService } from '../../../providers/utils-services/user-service';
import { UtilsService } from '../../../providers/utils-services/utils-service';

@Component({
  selector: 'page-course',
  templateUrl: 'course.html'
})
export class CoursePage {
  sessionId: string = this.navParams.get('sessionId');
  course: Course = this.navParams.get('course');
  year = this.navParams.get('year');
  segment = 'Cours magistral';
  slotTP = 'no';
  slotCM = 'no';
  displayedActi: Array<Activity> = [];
  courseSorted: {
    cm: Array<Activity>;
    tp: Array<Activity>;
    ex: Array<Activity>;
  };
  noTP: boolean;
  noCM: boolean;
  noEx: boolean;

  constructor(
    public navCtrl: NavController,
    public courseService: CourseService,
    private calendar: Calendar,
    public toastCtrl: ToastController,
    public userS: UserService,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    private utilsService: UtilsService
  ) {
    this.courseSorted = {cm: [], tp: [], ex: []};
    const acro = this.course.acronym;
    if (this.userS.hasSlot(acro, false)) {
      this.slotCM = this.userS.getSlot(acro, false);
    }
    if (this.userS.hasSlot(acro, true)) {
      this.slotTP = this.userS.getSlot(acro, true);
    }
    this.getCourse(this.sessionId, this.course.acronym);
  }

  getCourse(sessionId: string, acronym: string) {
    this.courseService.getCourseId(sessionId, acronym).then(data => {
      this.courseService.getActivity(sessionId, data).then(activity => {
        this.course.activities = activity.sort(
          (a1, a2) => a1.start.valueOf() - a2.start.valueOf()
        ).filter(activitie => activitie.end.valueOf() > Date.now().valueOf()); // display only activities finished after now time
        this.displayedActi = this.course.activities;
        this.courseSorted.cm = this.course.activities.filter(
          acti => acti.type === 'Cours magistral'
        );
        this.courseSorted.tp = this.course.activities.filter(
          acti => acti.type === 'TD' || acti.type === 'TP'
        );
        this.courseSorted.ex = this.course.activities.filter(
          acti => acti.isExam
        );
        this.updateDisplayed();
      });
    });
  }

  addToCalendar(activity: Activity) {
    const message = this.utilsService.getText('COURSE', 'MESSAGE');
    this.getEventWithOption(activity, message);
    this.alert();
  }

  async alert(all: boolean = false) {
    const prefix = all ? 'COURSE' : 'STUDY';
    const msg_number = all ? '3' : '4';
    const disclaimerAlert = await this.alertCtrl.create({
      header: this.utilsService.getText(prefix, 'WARNING'),
      message: this.utilsService.getText(prefix, 'MESSAGE' + msg_number),
      buttons: [{
        text: 'OK'
      }]
    });
    return await disclaimerAlert.present();
  }

  updateDisplayedTP() {
    const toFilter = this.courseSorted.tp;
    this.noTP = toFilter.length === 0;
    let toPush;
    if (this.slotTP !== 'no') {
      toPush = toFilter.filter(acti => acti.name === this.slotTP || acti.name.indexOf('-') > -1);
    } else {
      toPush = this.courseSorted.tp;
    }
    this.displayedActi = this.displayedActi.concat(toPush);
  }

  updateDisplayedCM() {
    const toFilter = this.courseSorted.cm;
    this.noCM = toFilter.length === 0;
    let toPush: Array<Activity>;
    if (this.slotCM !== 'no') {
      toPush = toFilter.filter(acti => acti.name === this.slotCM);
    } else {
      toPush = this.courseSorted.cm;
    }
    this.displayedActi = this.displayedActi.concat(toPush);
  }

  updateDisplayed() {
    this.displayedActi = [];
    this.updateDisplayedCM();
    this.updateDisplayedTP();
    this.displayedActi = this.displayedActi.concat(this.courseSorted.ex);
    this.noEx = this.courseSorted.ex.length === 0;
  }

  async showPrompt(segment: string) {
    const options = this.getInitialOptions(segment);
    const aucun = (this.slotTP === 'no' && segment === 'TD') || (this.slotCM === 'no' && segment === 'Cours magistral');
    const array = this.getSlots(segment);
    for (let i = 0; i < array.length; i++) {
      const slotChosen = this.slotTP === array[i].name || this.slotCM === array[i].name;
      options.inputs.push({
        name: 'options',
        value: array[i].name,
        label: this.getLabel(array, i),
        type: 'radio',
        checked: slotChosen
      });
    }
    if (options.inputs.length > 1) {
      options.inputs.push({
        name: 'options',
        value: 'no',
        label: 'Toutes',
        type: 'radio',
        checked: aucun
      });
      const a = await this.alertCtrl.create(options);
      return await a.present();
    }
  }

  getSlots(segment: string) {
    let act = this.course.activities.filter(acti =>
      acti.type === segment ||
      (acti.type === 'TP' && segment === 'TD') ||
      (segment === 'Examen' && acti.isExam)
    );
    let slots = act.map(item => item.name).filter((value, index, self) => self.indexOf(value) === index);
    if (segment === 'TD') {
      slots = slots.filter(acti => acti.indexOf('_') !== -1);
    } else if (segment === 'Cours magistral') {
      slots = slots.filter(acti => acti.indexOf('-') !== -1);
    }
    const newAct: Activity[] = [];
    for (let i = 0; i < slots.length; i++) {
      const activity: Activity = act.find(acti => acti.name === slots[i]);
      newAct.push(activity);
    }
    return newAct;
  }

  async addCourseToCalendar() {
    for (const activity of this.displayedActi) {
      this.getEventWithOption(activity, this.course.name + ' : ' + activity.type);
    }
    const toast = await this.toastCtrl.create({
      message: this.utilsService.getText('STUDY', 'MESSAGE3'),
      duration: 3000
    });
    this.alert(true);
    return await toast.present();
  }

  async openModalInfo() {
    const myModal = await this.modalCtrl.create({
      component: 'ModalInfoPage',
      componentProps: {course: this.course, year: this.year},
      cssClass: 'modal-fullscreen'
    });
    await myModal.onDidDismiss().then(() => {
    });
    return await myModal.present();
  }

  private getEventWithOption(activity: Activity, message) {
    this.calendar.createEventWithOptions(
      message,
      activity.auditorium,
      null,
      activity.start,
      activity.end,
      {firstReminderMinutes: 15}
    ).then(async () => {
      const toast = await this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      await toast.present();
    });
  }

  private getLabel(array: Activity[], i: number) {
    return array[i].name + ' ' + array[i].start.getHours() + ':' + array[i].start.getUTCMinutes();
  }

  private getInitialOptions(segment: string) {
    const options = {
      title: this.utilsService.getText('COURSE', 'TITLE'),
      message: this.utilsService.getText('COURSE', 'MESSAGE2'),
      inputs: [],
      buttons: [
        {
          text: this.utilsService.getText('COURSE', 'CANCEL')
        },
        {
          text: this.utilsService.getText('COURSE', 'APPLY'),
          handler: data => this.getHandler(segment, data)
        }
      ]
    };
    return options;
  }

  private getHandler(segment: string, data: any) {
    if (segment === 'Cours magistral') {
      this.slotCM = data;
      this.userS.addSlotCM(this.course.acronym, this.slotCM);
    } else if (segment === 'TD') {
      this.slotTP = data;
      this.userS.addSlotTP(this.course.acronym, this.slotTP);
    }
    this.updateDisplayed();
  }
}
