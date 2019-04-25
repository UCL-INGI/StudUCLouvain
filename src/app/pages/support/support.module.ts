import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { SupportPage } from './support';

@NgModule({
  declarations: [SupportPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class SupportPageModule { }