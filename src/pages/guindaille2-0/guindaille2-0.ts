/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
    This file is part of UCLCampus
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    UCLCampus is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    UCLCampus is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with UCLCampus.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Component, trigger, state, style, animate, transition } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-guindaille2-0',
  templateUrl: 'guindaille2-0.html',
  animations: [
    trigger('expand', [
      state('true', style({ height: '45px' })),
      state('false', style({ height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})

export class GuindaillePage {
  title: any;
  shownGroup = null;

  alterner = { title: 'Alterner',
      subTitle: 'Si tu veux rester joyeux toute la soirée, alterne avec des softs. Cela te permettra de rester dans cet état, de t’hydrater (oui, oui, l’alcool déshydrate !), de te souvenir de tout et de ne rien regretter…',
      buttons: ['OK'] };

  bruit = { title: 'Limiter le bruit à l’extérieur',
      subTitle: 'Louvain-la-Neuve est une ville qui bouge, même la nuit. Tous les soirs, il y a des occasions de s’occuper et de faire la fête. Et les salles sont prévues pour, mais n’oublie pas le retour au calme une fois dehors.\nQuand tu décides de rentrer dormir, d’autres l’ont déjà fait avant toi alors… Chut, plus de bruits.',
      buttons: ['OK'] };

  eau = { title: 'Eau gratuite',
      subTitle: 'Même si tu ne t’en rends pas compte, l’alcool déshydrate ton organisme. L’eau est le meilleur moyen pour te réhydrater suffisamment entre deux verres d’alcool.\nN’attends pas de ressentir la sensation de soif pour boire un verre d’eau. Profites-en, elle est gratuite au bar, et à volonté !',
      buttons: ['OK'] };

  ou = { title: 'J\'en suis où?',
      subTitle: 'Quand tu sors, il est important que tu puisses évaluer et gérer ta propre consommation en fonction des effets ressentis et non pas de la quantité. Les effets ressentis chez l’un ou chez l’autre ; ou d’une soirée à l’autre ne sont pas les mêmes ! Cela dépend de ta constitution, ton état de fatigue,… Reste donc attentif à ces effets pour passer une bonne soirée !',
      buttons: ['OK'] };

  cans = { title: 'Pas de canettes ni de bouteilles en verre',
      subTitle: 'Les canettes et les contenants en verre sont interdits dans l’ensemble des surfaces d’animation.',
      buttons: ['OK'] };

  preservatif = { title: 'Préservatif',
      subTitle: '”10 à 12% des étudiants déclarent avoir eu des relations sexuelles non-protégées ou regrettées, suite à leur consommation d’alcool. » (UCL, 2011)\nL’alcool ne diminue pas les risques de transmissions de MST, ni celui de tomber enceinte.\nN’oublie pas ton préservatif avant de sortir, et de l’utiliser au moment voulu…',
      buttons: ['OK'] };

  racompagner = { title: 'Je raccompagne',
      subTitle: 'On ne doit jamais laisser son (sa) pote seul(e) lorsqu’il (elle) a trop bu ! On évite qu’il (elle) prenne la bagnole, la moto, le vélo… Même à pied, les risques existent ! On le (la) raccompagne pour lui éviter de mauvaises rencontres ou l’endormissement dans un buisson, et l’inévitable hypothermie qui va avec…\nLes quelques a-fonds réalisés juste avant font encore monter le taux d’alcoolémie ! Ce n’est pas parce qu’il (elle) dort que le coma éthylique ne guette pas. Vérifie son état de conscience (la personne doit rester « réveillable ») et s’il (elle) ne réagit pas, appelle les secours, c’est une urgence médicale.\nMieux vaut appeler les secours une fois de trop qu’une fois trop peu…',
      buttons: ['OK'] };

  uriner = { title: 'Uriner dans le pot',
      subTitle: 'Des toilettes et/ou des urinoirs existent dans les surfaces d’animation. Utilise-les donc à bon escient et vise juste !',
      buttons: ['OK'] };

  dehors = { title: 'Ne pas uriner dehors',
      subTitle: 'Les murs et les recoins ne sont pas des toilettes à ciel ouvert. Respecte l’environnement extérieur et utilise plutôt les toilettes existantes.',
      buttons: ['OK'] };

  violence = { title: 'Violence, arrête toi avant!',
      subTitle: 'Les effets de l’alcool peuvent varier. Alcool joyeux, triste ou encore agressif, personne n’est à l’abri. Si tu sens que toi ou un(e) de tes potes montez dans les tours, c’est le moment de te/le/la calmer et d’alterner avec des softs.',
      buttons: ['OK'] };

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private iab: InAppBrowser, public alertCtrl: AlertController) {
    this.title = this.navParams.get('title');
  }

  toggleGroup(group) {
      if (this.isGroupShown(group)) {
          this.shownGroup = null;
      } else {
          this.shownGroup = group;
      }
  }

  isGroupShown(group) {
      return this.shownGroup === group;
  }

  showAlert(page) {
      let alert = this.alertCtrl.create(page);
      alert.present();
  }
}
