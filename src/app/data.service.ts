import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { map } from "rxjs/operators";

//import form classes
import { AddDashboard } from './add-dashboard';
import { AddUser } from './add-user';
import { Addlinks } from './addlinks';
import { AddTraining } from './add-training';
//import { link } from 'fs';

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

  getTraining(category: string) {
    return this._http.get("/api/training/" + category)
      .pipe(map(result => this.result = result.json()));
  }

  getMaterial(category: string, userId: string) {
    return this._http.get("/api/getmaterial/" + category + "/" + userId)
      .pipe(map(result => this.result = result.json()));
  }

  getRowspan(category: string, userId: string) {
    return this._http.get("/api/getrowspan/" + category + "/" + userId)
      .pipe(map(result => this.result = result.json()));
  }

  getCategories(purpose: string) {
    return this._http.get("/api/categories/" + purpose)
      .pipe(map(result => this.result = result.json()));
  }

  getLinks(catId:string, ltype: string, status: string) {
    return this._http.get("/api/getlinks/" + catId + "/" + ltype + "/" + status)
      .pipe(map(result => this.result = result.json()));
  }

  getLinksCat(catId:string, status: string) {
    return this._http.get("/api/getlinkscat/" + catId + "/" + status)
      .pipe(map(result => this.result = result.json()));
  }

  getLinksbyId(linkid: string) {
    return this._http.get("/api/getlinkbyid/" + linkid + "/" + status)
      .pipe(map(result => this.result = result.json()));
  }

  getLinksbycat(category: string, type: string, userId: string, status: string) {
    return this._http.get("/api/getlinkbycat/" + category + "/" + type + "/" + userId + "/" + status)
      .pipe(map(result => this.result = result.json()));
  }

  getLinksForApproval(catId: string, status: string, role: string) {
    return this._http.get("/api/getlinksforapproval/" + catId + "/" + status + "/" + role)
      .pipe(map(result => this.result = result.json()));
  }

  getLinksForApprovalcat(catId: string, status: string) {
    return this._http.get("/api/getlinksforapprovalcat/" + catId + "/" + status)
      .pipe(map(result => this.result = result.json()));
  }

  getDashboards(catId, status, userId) {
    return this._http.get("/api/dashboards/" + catId + "/" + status + "/" + userId)
      .pipe(map(result => this.result = result.json()));
  }

  getPendingDashboards(catId, status, role) {
    return this._http.get("/api/pendingdashboards/" + catId + "/" + status + "/" + role)
      .pipe(map(result => this.result = result.json()));
  }

  displayDashboard(dashId) {
    return this._http.get("/api/displaydashboard/" + dashId)
      .pipe(map(result => this.result = result.json()));
  }

  approveDashboard(dashId) {
    return this._http.get("/api/approvedashboard/" + dashId)
      .pipe(map(result => this.result = result.json()));
  }

  deleteDashboard(dashId) {
    return this._http.get("/api/deletedashboard/" + dashId)
      .pipe(map(result => this.result = result.json()));
  }

  approveLinks(linkid, approvedby) {
    return this._http.get("/api/approvelinks/" + linkid + "/" + approvedby)
      .pipe(map(result => this.result = result.json()));
  }

  deleteLinks(linkid, approvedby) {
    return this._http.get("/api/deletelinks/" + linkid)
      .pipe(map(result => this.result = result.json()));
  }

  addFavorite(dashId, userId) {

    return this._http.post("/api/addfavorite", {
      "dashId": dashId,
      "userId": userId
    })
      .pipe(map(result => this.result = result.json()));
  }

  addLinkFavorite(linkId, userId) {

    return this._http.post("/api/addlinkfavorite", {
      "linkId": linkId,
      "userId": userId
    })
      .pipe(map(result => this.result = result.json()));
  }

  addTrainingFavorite(matid, userId) {

    return this._http.post("/api/addtrainingfavorite", {
      "matid": matid,
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

  removeLinkFavorite(linkId, userId) {

    return this._http.post("/api/removelinkfavorite", {
      "linkId": linkId,
      "userId": userId
    })
      .pipe(map(result => this.result = result.json()));
  }

  removeTrainingFavorite(matid, userId) {

    return this._http.post("/api/removetrainingfavorite", {
      "matid": matid,
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
      "password": model.password,
      "catId": model.catId
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
      "password": model.password,
      "catId": model.catId
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

    if (user === "User") {
      status = "Pending";
    }
    else {
      status = "Approved"
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
      "status": status,
      "addedby": model.addedby,
      "approvedby": model.approvedby
    })
      .pipe(map(result => this.result = result.json()));
  }

  updateDasboard(model: AddDashboard, dashId: string) {

    return this._http.post("/api/updatedashboard", {
      "dashId": dashId,
      "category": parseInt(model.category),
      "dname": model.dname.trim(),
      "ddesc": model.ddesc.trim(),
      "dlink": model.dlink.trim(),
      "uusers": model.uusers,
      "views": model.views,
      "age": model.age,
      "imageuri": model.imageuri,
      "addedby": model.addedby,
      "approvedby": model.approvedby
    })
      .pipe(map(result => this.result = result.json()));
  }

  addLinks(model: Addlinks) {

    return this._http.post("/api/addlinks", {
      "linktitle": model.linktitle.trim(),
      "linkdesc": model.linkdesc.trim(),
      "linkurl": model.linkurl.trim(),
      "linkcategory": model.linkcategory,
      "catId": parseInt(model.catId),
      "status": model.status,
      "addedby": model.addedby,
      "approvedby": model.approvedby
    })
      .pipe(map(result => this.result = result.json()));
  }

  addCategory(catDesc: string) {
    return this._http.post("/api/addcategory", {
      "catDesc": catDesc.trim()
    })
      .pipe(map(result => this.result = result.json()));
  }

  deleteCategory(catId: string) {
    return this._http.post("/api/deletecategory", {
      "catId": catId
    })
      .pipe(map(result => this.result = result.json()));
  }

  addTraining(model: AddTraining) {
    return this._http.post("/api/addtraining", {
      "title": model.title.trim(),
      "desc": model.desc.trim(),
      "category": parseInt(model.category.trim())
    })
      .pipe(map(result => this.result = result.json()));
  }

  addMaterial(materialList: Array<any>) {
    return this._http.post("/api/addmaterial", {
      "materialList":materialList
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
      "linkid": model.linkid,
      "status": model.status,
      "addedby": model.addedby,
      "approvedby": model.approvedby
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
