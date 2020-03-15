import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ModalProjectPage } from './modal-project';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [ModalProjectPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule
  ]
})
export class ModalProjectPageModule {
}
