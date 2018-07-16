/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
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

import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';

@IonicPage()
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
  segment:string = 'pict';
  /*alt:string;
  this.translateService.get('PIC1').subscribe((res:string) => {this.alt=res;});*/

  // MUST USE TRADUCTION !!!!!!!!!!!

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

  slides = [
      {
        title: 'Que retenir?',
        subTitle: 'Ne pas dépasser la phase 2: quand j\'ai le "fêtant", j\'alterne mes boissons alcoolisées avec des softs et je profite de l\'eau gratuite! Je passerai une excellente soirée jusqu\'au bout de la nuit, je me souviendrai de tout, je resterai performant (dans tous les sens du terme) et je n\'aurai pas mal au crâne le lendemain. C\'est tout bénef! N\'oubliez jamais d\'alterner alcool et soft, de même n\'oubliez jamais de vous protéger en cas de rapport sexuel.',
        buttons: ['OK'],
        image: "assets/img/guindaille/1.png",
      },
      {
        title: 'Au top!',
        subTitle: 'Tout va bien. J\'ai bu environ deux drinks (2 unités standard d\'alcool). Je me sens normal(e) mais attention, au regard de la loi, je ne peux fort probablement plus conduire. Je suis au alentours de 0.5 gramme d\'alcool par litre de sang, qui est la limite légale autorisée pour conduire en Belgique. Si je veux reprendre le volant (ou le guidon), je dois attendre une bonne heure environ. En effet, le corp a besoin d\'environ 1h30 pour éliminer un seul drink!',
        buttons: ['OK'],
        image: "assets/img/guindaille/2.png",
      },
      {
        title: 'Au max!',
        subTitle: 'J\'ai le "fêtant", je suis joyeux(se), désinhibé(e), et j\'ai la drague plus facile. Excellent! Un état recherché lorsque l\'on a décidé de boire de l\'alcool, aller au-delà n\'a plus d\'intérêt. Pour rester dans cet état là toute la soirée, je dois absolument alterner avec des boissons softs. Je maintiendrai alors mon état joyeux, je m\'hydraterai correctement (l\'alcool déshydrate fort!), je me souviendrai de tout et je ne regretterai rien. Je me limite aussi à un ou deux drinks alcoolisés par heure maximum, car je tourne déjà entre 1‰ et 2‰ d\'alcool dans le sang. Pour rappel, je ne peux évidemment plus conduire depuis longtemps déjà.',
        buttons: ['OK'],
        image: "assets/img/guindaille/3.png",
      },
      {
        title: 'Limite Lourd!',
        subTitle: 'J\'ai oublié d\'alterner avec des softs lorsque je me sentais au top ou au max.. Mon taux d\'alcool continue de grimper, et me capacité à faire rire et plaisir à mon entourage y est inversement proportionnelle. Je suis persuadé d\'être drôle et séduisant(e), mais je suis le/la seul(e) à le penser. Je parle fort et je postilonne un peu sur mon voisin, ma voisine. Bref, je suis lourd(e)... Je commencer à avoir des troubles de l\'équilibre. Les lendemains seront difficiles! Je me situe entre 2‰ et 3‰ d\'alcool dans le sang.',
        buttons: ['OK'],
        image: "assets/img/guindaille/4.png",
      },
      {
        title: 'Soirée foirée, Lendemain foireux!',
        subTitle: 'C\'est la phrase qui emm... tout le monde, c\'est l\'alcool triste, violent... Je ne gère plus du tout ma consommation. Je perds le contrôle et l\'équilibre (ainsi qu\'éventuellement mon portefeuille, mes clés, mon portable,...). Mon cerveau est en souffrance importante et les nausées apparaissent. Je ne fais plus rire personne. Bien au contraire, je deviens un(e) "bitu" à gérer. Le lendemain sera très pénible et je pourrais regretter des choses, des faits. Je tourne autour des 3‰ d\'alcool dans le sang, c\'est beaucoup trop!',
        buttons: ['OK'],
        image: "assets/img/guindaille/5.png",
      },
      {
        title: 'Danger Maximum!',
        subTitle: 'C\'est le pré-coma ou le coma éthylique. Je m\'endors sous l\'effet de l\'alcool et, sans m\'en rendre compte, je prends des risques énormes (étouffement si je vomis, chutes et traumatisques, arrêt respiratoire pouvant mener au décès). De plus, si jamais je viens encore de boire un verre ou de faire l\'un ou l\'autre "à-fond", mon taux d\'alcool va encore monter. Le risque de coma profond devient alors très important. Je me situe entre 3‰ et 4‰ d\'alcool dans le sang, la majorité d\'entre nous entre en pré-coma ou coma profond à ce taux-là!',
        buttons: ['OK'],
        image: "assets/img/guindaille/6.png",
      }];

  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) 
  {
    this.title = this.navParams.get('title');
  }

  showAlert(page) {
      let alert = this.alertCtrl.create(page);
      alert.present();
  }
}
