import {IonicPageModule} from 'ionic-angular';

import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {EventsFilterPage} from './events-filter';

@NgModule({
  declarations: [EventsFilterPage],
  imports: [
    IonicPageModule.forChild(EventsFilterPage),
    TranslateModule.forChild()
  ]
})
export class EventsFilterModule {
}
