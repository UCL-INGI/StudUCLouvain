import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EventsDetailsPage } from './events-details';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [EventsDetailsPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule
  ]
})
export class EventsDetailsPageModule {
}
