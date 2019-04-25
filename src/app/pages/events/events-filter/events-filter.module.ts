import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { EventsFilterPage } from './events-filter';

@NgModule({
  declarations: [EventsFilterPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class EventsFilterModule { }