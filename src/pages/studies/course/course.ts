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
import {
    AlertController, IonicPage, ItemSliding, ModalController, NavController, NavParams,
    ToastController
} from 'ionic-angular';

import { Component } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';

import { Activity } from '../../../app/entity/activity';
import { Course } from '../../../app/entity/course';
import { CourseService } from '../../../providers/studies-services/course-service';
import { UserService } from '../../../providers/utils-services/user-service';
import { UtilsService } from '../../../providers/utils-services/utils-service';

@IonicPage()
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
    this.courseSorted = { cm: [], tp: [], ex: [] };
    const acro = this.course.acronym;
    if (this.userS.hasSlotCM(acro)) {
      this.slotCM = this.userS.getSlotCM(acro);
    }
    if (this.userS.hasSlotTP(acro)) {
      this.slotTP = this.userS.getSlotTP(acro);
    }
  }

  ionViewDidLoad() {
    this.getCourse(this.sessionId, this.course.acronym);
  }

  getCourse(sessionId: string, acronym: string) {
    this.courseService.getCourseId(sessionId, acronym).then(data => {
      const courseId = data;
      this.courseService.getActivity(sessionId, courseId).then(activity => {
        this.course.activities = activity
          .sort((a1, a2) => a1.start.valueOf() - a2.start.valueOf())
          .filter(activitie => activitie.end.valueOf() > Date.now().valueOf()); // display only activities finished after now time
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

  addToCalendar(slidingItem: ItemSliding, activity: Activity) {
    const options: any = {
      firstReminderMinutes: 15
    };
    const message = this.utilsService.getText('COURSE', 'MESSAGE');
    this.calendar
      .createEventWithOptions(
        this.course.name + ' : ' + activity.type,
        activity.auditorium,
        null,
        activity.start,
        activity.end,
        options
      )
      .then(() => {
        const toast = this.toastCtrl.create({
          message: message,
          duration: 3000
        });
        toast.present();
        slidingItem.close();
      });
    this.alert();
  }

  alert(all: boolean = false) {
    const prefix = all ? 'COURSE' : 'STUDY';
    const msg_number = all ? '3' : '4';
    const title = this.utilsService.getText(prefix, 'WARNING');
    const message = this.utilsService.getText(prefix, 'MESSAGE' + msg_number);
    const disclaimerAlert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: data => { }
        }
      ]
    });
    disclaimerAlert.present();
  }

  updateDisplayedTP() {
    const toFilter = this.courseSorted.tp;
    if (toFilter.length === 0) { this.noTP = true; } else { this.noTP = false; }
    let toPush;
    if (this.slotTP !== 'no') {
      toPush = toFilter.filter(
        acti => acti.name === this.slotTP || acti.name.indexOf('-') > -1
      );
    } else { toPush = this.courseSorted.tp; }
    this.displayedActi = this.displayedActi.concat(toPush);
  }

  updateDisplayedCM() {
    const toFilter = this.courseSorted.cm;
    if (toFilter.length === 0) { this.noCM = true; } else { this.noCM = false; }
    let toPush: Array<Activity>;
    if (this.slotCM !== 'no') {
      toPush = toFilter.filter(acti => acti.name === this.slotCM);
    } else { toPush = this.courseSorted.cm; }
    this.displayedActi = this.displayedActi.concat(toPush);
  }

  updateDisplayed() {
    this.displayedActi = [];
    this.updateDisplayedCM();
    this.updateDisplayedTP();
    this.displayedActi = this.displayedActi.concat(this.courseSorted.ex);
    if (this.courseSorted.ex.length === 0) { this.noEx = true; } else { this.noEx = false; }
  }

  showPrompt(segment: string) {
    const options = this.getInitialOptions(segment);
    const aucun =
      (this.slotTP === 'no' && segment === 'TD') ||
      (this.slotCM === 'no' && segment === 'Cours magistral');
    const array = this.getSlots(segment);
    for (let i = 0; i < array.length; i++) {
      const slotChosen =
        this.slotTP === array[i].name || this.slotCM === array[i].name;
      options.inputs.push({
        name: 'options',
        value: array[i].name,
        label:
          this.getLabel(array, i),
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
    }
    const prompt = this.alertCtrl.create(options);
    if (options.inputs.length > 1) { prompt.present(); }
  }

  private getLabel(array: Activity[], i: number) {
    return array[i].name +
      ' ' +
      array[i].start.getHours() +
      ':' +
      array[i].start.getUTCMinutes();
  }

  private getInitialOptions(segment: string) {
    const title = this.utilsService.getText('COURSE', 'TITLE');
    const message = this.utilsService.getText('COURSE', 'MESSAGE2');
    const cancel = this.utilsService.getText('COURSE', 'CANCEL');
    const apply = this.utilsService.getText('COURSE', 'APPLY');
    const options = {
      title: title,
      message: message,
      inputs: [],
      buttons: [
        {
          text: cancel
        },
        {
          text: apply,
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

  getSlots(segment: string) {
    let act: Activity[] = this.course.activities;
    act = act.filter(
      acti =>
        acti.type === segment ||
        (acti.type === 'TP' && segment === 'TD') ||
        (segment === 'Examen' && acti.isExam)
    );
    let slots = act
      .map(item => item.name)
      .filter((value, index, self) => self.indexOf(value) === index);
    if (segment === 'TD') { slots = slots.filter(acti => acti.indexOf('_') !== -1); }
    if (segment === 'Cours magistral') {
      slots = slots.filter(acti => acti.indexOf('-') !== -1);
    }
    const newAct: Activity[] = [];
    for (let i = 0; i < slots.length; i++) {
      const activity: Activity = act.find(acti => acti.name === slots[i]);
      newAct.push(activity);
    }
    return newAct;
  }

  addCourseToCalendar() {
    const options: any = {
      firstReminderMinutes: 15
    };
    for (const activity of this.displayedActi) {
      this.calendar.createEventWithOptions(
        this.course.name + ' : ' + activity.type,
        activity.auditorium,
        null,
        activity.start,
        activity.end,
        options
      );
    }
    const message = this.utilsService.getText('STUDY', 'MESSAGE3');

    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
    this.alert(true);
  }

  openModalInfo() {
    const myModal = this.modalCtrl.create(
      'ModalInfoPage',
      { course: this.course, year: this.year },
      { cssClass: 'modal-fullscreen' }
    );
    myModal.onDidDismiss(data => { });
    myModal.present();
  }
}
