import {IonicPageModule} from 'ionic-angular';

import {NgModule} from '@angular/core';
import {Calendar} from '@ionic-native/calendar';
import {TranslateModule} from '@ngx-translate/core';

import {EventsPage} from './events';

@NgModule({
  declarations: [EventsPage],
  imports: [IonicPageModule.forChild(EventsPage), TranslateModule.forChild()],
  providers: [Calendar]
})
export class EventsPageModule {
}
