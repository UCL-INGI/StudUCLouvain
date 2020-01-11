import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SportsPage } from './sports';

@NgModule({
  declarations: [SportsPage],
  imports: [IonicPageModule.forChild(SportsPage), TranslateModule.forChild()]
})
export class SportsPageModule {}
