import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { TranslateModule } from '@ngx-translate/core';

import { EventsPage } from './events';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [EventsPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [Calendar]
})
export class EventsPageModule {
}
