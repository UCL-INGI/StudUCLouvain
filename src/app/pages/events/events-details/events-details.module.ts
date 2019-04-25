import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { EventsDetailsPage } from './events-details';

@NgModule({
  declarations: [EventsDetailsPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class EventsDetailsPageModule { }