import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { map } from "rxjs/operators";

//import form classes
import { AddDashboard } from './add-dashboard';
import { AddUser } from './add-user';
import { Addlinks } from './addlinks';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  result: any;

  constructor(private _http: Http) { }

  getUserRoles() {
    return this._http.get("/api/roles")
      .pipe(map(result => this.result = result.json()));
  }

  getUsers() {
    return this._http.get("/api/getusers")
      .pipe(map(result => this.result = result.json()));
  }

  getCategories(purpose: string) {
    return this._http.get("/api/categories/" + purpose)
      .pipe(map(result => this.result = result.json()));
  }

  getLinks(ltype: string) {
    return this._http.get("/api/getlinks/" + ltype)
      .pipe(map(result => this.result = result.json()));
  }

  getLinksbyId(linkid: string) {
    return this._http.get("/api/getlinkbyid/" + linkid)
      .pipe(map(result => this.result = result.json()));
  }

  getDashboards(catId, status, userId) {
    return this._http.get("/api/dashboards/" + catId + "/" + status + "/" + userId)
      .pipe(map(result => this.result = result.json()));
  }

  addFavorite(dashId, userId) {

    return this._http.post("/api/addfavorite", {
      "dashId": dashId,
      "userId": userId
    })
      .pipe(map(result => this.result = result.json()));
  }

  removeFavorite(dashId, userId) {

    return this._http.post("/api/removefavorite", {
      "dashId": dashId,
      "userId": userId
    })
      .pipe(map(result => this.result = result.json()));
  }

  getFavoriteCount(email) {
    return this._http.get("/api/favoritecount/" + email)
      .pipe(map(result => this.result = result.json()));
  }

  userLogin(email) {

    return this._http.get("/api/login/" + email)
      .pipe(map(result => this.result = result.json()));
  }

  userSignup(model: AddUser) {

    return this._http.post("/api/signup", {
      "fname": model.fname.trim(),
      "lname": model.lname.trim(),
      "uname": model.userId.trim(),
      "role": model.role,
      "status": model.status,
      "password": model.password
    })
      .pipe(map(result => this.result = result.json()));
  }

  updateUser(model: AddUser) {

    return this._http.post("/api/updateuser", {
      "fname": model.fname.trim(),
      "lname": model.lname.trim(),
      "uname": model.userId.trim(),
      "role": model.role,
      "status": model.status,
      "password": model.password
    })
      .pipe(map(result => this.result = result.json()));
  }

  changePassword(password: string) {

    return this._http.post("/api/changepassword", {
      "uname": sessionStorage.getItem("userId"),
      "password": password.trim()
    })
      .pipe(map(result => this.result = result.json()));
  }

  deleteUser(uname: string) {

    return this._http.post("/api/deleteuser", {
      "uname": uname
    })
      .pipe(map(result => this.result = result.json()));
  }

  addDasboard(model: AddDashboard, user: string) {

    var status: string;

    if (user === "Admin") {
      status = "Approved";
    }
    else {
      status = "Pending"
    }

    return this._http.post("/api/adddashboard", {
      "category": parseInt(model.category.trim()),
      "dname": model.dname.trim(),
      "ddesc": model.ddesc.trim(),
      "dlink": model.dlink.trim(),
      "uusers": model.uusers,
      "views": model.views,
      "age": model.age,
      "imageuri": model.imageuri,
      "status": status
    })
      .pipe(map(result => this.result = result.json()));
  }

  addLinks(model: Addlinks) {

    return this._http.post("/api/addlinks", {
      "linktitle": model.linktitle.trim(),
      "linkdesc": model.linkdesc.trim(),
      "linkurl": model.linkurl.trim(),
      "linkcategory": model.linkcategory,
      "catId": parseInt(model.catId)
    })
      .pipe(map(result => this.result = result.json()));
  }

  addCategory(catDesc: string) {
    return this._http.post("/api/addcategory", {
      "catDesc": catDesc.trim()
    })
      .pipe(map(result => this.result = result.json()));
  }

  updateLinks(model: Addlinks) {

    return this._http.post("/api/updatelinks", {
      "linktitle": model.linktitle.trim(),
      "linkdesc": model.linkdesc.trim(),
      "linkurl": model.linkurl.trim(),
      "linkcategory": model.linkcategory,
      "catId": parseInt(model.catId),
      "linkid": model.linkid
    })
      .pipe(map(result => this.result = result.json()));
  }

  deleteLink(linkid: number) {

    return this._http.post("/api/deletelink", {
      "linkid": linkid
    })
      .pipe(map(result => this.result = result.json()));
  }

  isLoggedIn() {
    if (sessionStorage.length) {
      return true;
    }
    else {
      return false;
    }
  }
}
