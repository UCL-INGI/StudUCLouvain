import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { TranslateModule } from '@ngx-translate/core';

import { SportsPage } from './sports';
import { SportsRoutingModule } from "./sports-routing.module";

@NgModule({
  declarations: [SportsPage],
  imports: [
    IonicModule,
    SportsRoutingModule,
    TranslateModule.forChild(),
  ],
  providers: [Calendar]
})
export class SportsPageModule {
}
