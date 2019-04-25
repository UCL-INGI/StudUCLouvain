import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { HebdoPage } from './hebdo';

@NgModule({
  declarations: [HebdoPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class HebdoPageModule { }