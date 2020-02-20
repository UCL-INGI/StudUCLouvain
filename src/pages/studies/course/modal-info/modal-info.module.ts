import {IonicPageModule} from 'ionic-angular';

import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {ModalInfoPage} from './modal-info';

@NgModule({
  declarations: [ModalInfoPage],
  imports: [IonicPageModule.forChild(ModalInfoPage), TranslateModule.forChild()]
})
export class ModalInfoPageModule {
}
