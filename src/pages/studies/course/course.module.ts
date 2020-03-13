import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { TranslateModule } from '@ngx-translate/core';

import { CoursePage } from './course';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [CoursePage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule,
    FormsModule
  ],
  providers: [Calendar]
})
export class CoursePageModule {
}
