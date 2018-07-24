import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { EventsDetailsPage } from './events-details';

@NgModule({
  declarations: [EventsDetailsPage],
  imports: [
  	IonicPageModule.forChild(EventsDetailsPage),
  	TranslateModule.forChild()
  ]
})
export class EventsDetailsPageModule { }