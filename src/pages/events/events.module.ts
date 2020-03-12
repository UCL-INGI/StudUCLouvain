import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { TranslateModule } from '@ngx-translate/core';

import { EventsPage } from './events';

@NgModule({
  declarations: [EventsPage],
  imports: [IonicModule, TranslateModule.forChild()],
  providers: [Calendar]
})
export class EventsPageModule {
}
