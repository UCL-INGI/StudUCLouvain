import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EventsDetailsPage } from './events-details';

@NgModule({
  declarations: [EventsDetailsPage],
  imports: [
    IonicModule,
    TranslateModule.forChild()
  ]
})
export class EventsDetailsPageModule {
}
