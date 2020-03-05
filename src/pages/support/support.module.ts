import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SupportPage } from './support';

@NgModule({
  declarations: [SupportPage],
  imports: [IonicPageModule.forChild(SupportPage), TranslateModule.forChild()]
})
export class SupportPageModule {
}
