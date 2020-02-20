import {IonicPageModule} from 'ionic-angular';

import {NgModule} from '@angular/core';
import {Calendar} from '@ionic-native/calendar';
import {TranslateModule} from '@ngx-translate/core';

import {SportsPage} from './sports';

@NgModule({
  declarations: [SportsPage],
  imports: [IonicPageModule.forChild(SportsPage), TranslateModule.forChild()],
  providers: [Calendar]
})
export class SportsPageModule {
}
