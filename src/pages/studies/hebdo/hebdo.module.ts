import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HebdoPage } from './hebdo';

@NgModule({
  declarations: [HebdoPage],
  imports: [IonicPageModule.forChild(HebdoPage), TranslateModule.forChild()]
})
export class HebdoPageModule { }
