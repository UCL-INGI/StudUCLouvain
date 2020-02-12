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

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EmployeeItem } from '../../app/entity/employeeItem';
import { Wso2Service } from './wso2-service';

@Injectable()
export class RepertoireService {
  employees: Array<EmployeeItem> = [];
  url = 'directories/v1/employees/';
  options: any;

  constructor(public http: HttpClient, private wso2Service: Wso2Service) { }

  public searchEmployees(options: Array<string>, values: Array<string>) {
    this.employees = [];
    let newUrl = this.url;
    newUrl += 'search?';
    for (let i = 0; i < options.length; i++) {
      newUrl += options[i] + '=' + values[i];
      if (i !== options.length - 1) {
        newUrl += '&';
      }
    }
    newUrl += '&page=1&pageSize=10';
    return new Promise(resolve => {
      this.wso2Service.load(newUrl).subscribe(
        data => {
          if (data['persons'] != null) {
            this.extractEmployees(data['persons'].person);
            resolve({ employees: this.employees });
          }
        });
    });
  }

  public loadEmpDetails(emp: EmployeeItem) {
    return new Promise(resolve => {
      const url_details = this.url + emp.matric_fgs + '/detail';
      this.wso2Service.load(url_details).subscribe(
        data => {
          emp = this.extractEmployeeDetails(emp, data['businessInformation']);
          resolve({ empDetails: emp });
        });
    });
  }

  private extractEmployees(data: any) {
    if (data != null) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const employee = new EmployeeItem(item.matric_fgs, item.lastname, item.firstname, item.email, item.departments);
        this.employees.push(employee);
      }
    }
  }

  private extractEmployeeDetails(emp: EmployeeItem, data: any): EmployeeItem {
    emp.address = data.address;
    emp.contracts = data.contracts;
    emp.businessContacts = data.businessContacts;
    emp.gender = data.gender;
    emp.photo_url = data.photo_url;
    return emp;
  }
}
