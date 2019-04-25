import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CreditPage } from './credit';

@NgModule({
  declarations: [CreditPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class CreditPageModule { }