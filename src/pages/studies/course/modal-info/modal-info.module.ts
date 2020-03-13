import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModalInfoPage } from './modal-info';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [ModalInfoPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule
  ]
})
export class ModalInfoPageModule {
}
