import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { EventsPage } from './events';

@NgModule({
  declarations: [EventsPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class EventsPageModule { }