import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModalProjectPage } from './modal-project';

@NgModule({
  declarations: [ModalProjectPage],
  imports: [
    IonicModule,
    TranslateModule.forChild()
  ]
})
export class ModalProjectPageModule {
}
