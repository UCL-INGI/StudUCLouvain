import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ExamPage } from './exam';

@NgModule({
  declarations: [ExamPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class ExamPageModule { }