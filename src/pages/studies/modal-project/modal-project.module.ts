import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModalProjectPage } from './modal-project';

@NgModule({
  declarations: [ModalProjectPage],
  imports: [
    IonicPageModule.forChild(ModalProjectPage),
    TranslateModule.forChild()
  ]
})
export class ModalProjectPageModule { }
