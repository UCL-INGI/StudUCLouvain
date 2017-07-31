/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

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

export class NewsItem {
  description: string;
  link: string;
  title: string;
  image: string;
  trimmedDescription: string;
  hidden : boolean;
  guid : string;
  pubDate : Date;

  constructor(
    description: string,
    link: string,
    title: string,
    image:string,
    trimmedDescription: string,
    hidden: boolean,
    guid: string,
    pubDate : Date
  ) {
    this.description = description;
    this.link = link;
    this.title = title;
    this.image = image;
    this.trimmedDescription = trimmedDescription;
    this.hidden = hidden;
    this.guid = guid;
    this.pubDate = pubDate;
  }
}
