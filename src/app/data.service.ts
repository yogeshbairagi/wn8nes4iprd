import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  result: any;

  constructor(private _http: Http) { }

  getCategories(purpose) {
    return this._http.get("/api/categories/"+purpose)
      .pipe(map(result => this.result = result.json()));
  }

  getDashboards(catId, status, userId) {
    return this._http.get("/api/dashboards/"+catId+"/"+status+"/"+userId)
      .pipe(map(result => this.result = result.json()));
  }

  addFavorite(dashId, userId) {

    return this._http.post("/api/addfavorite", {
      "dashId":dashId,
      "userId":userId
    })
      .pipe(map(result => this.result = result.json()));
  }

  removeFavorite(dashId, userId) {

    return this._http.post("/api/removefavorite", {
      "dashId":dashId,
      "userId":userId
    })
      .pipe(map(result => this.result = result.json()));
  }

  userLogin(email) {
    // let params: URLSearchParams = new URLSearchParams();
    // params.set('email', email);
    
    // let requestOptions = new RequestOptions();
    // requestOptions.search = params;

    return this._http.get("/api/login/"+email)
      .pipe(map(result => this.result = result.json().data));
  }

  userSignup(data) {
    // let params: URLSearchParams = new URLSearchParams();
    // params.set('email', email);
    
    // let requestOptions = new RequestOptions();
    // requestOptions.search = params;
    var fname:string = data.fname.trim();
    var lname:string = data.lname.trim();
    var uname:string = data.uname.trim().toLowerCase();

    return this._http.post("/api/signup", {
      "fname":fname,
      "lname":lname,
      "uname":uname,
      "role":"User",
      "status":"Pending"
    })
      .pipe(map(result => this.result = result.json()));
  }

  addDasboard(data, user) {

    var category:string = data.category.trim();
    var dname:string = data.dname.trim();
    var ddesc:string = data.ddesc.trim();
    var dlink:string = data.dlink.trim();
    var uusers:number = parseInt(data.uusers.trim());
    var views:number = parseInt(data.views.trim());
    var age:number = parseInt(data.age.trim());
    var imageuri:string = data.imageuri.trim();
    var status:string;

    if(user === "Admin")
    {
      status = "Approved";
    }
    else
    {
      status = "Pending"
    }

    return this._http.post("/api/adddashboard", {
      "category":category,
      "dname":dname,
      "ddesc":ddesc,
      "dlink":dlink,
      "uusers":uusers,
      "views":views,
      "age":age,
      "imageuri":imageuri,
      "status":status
    })
      .pipe(map(result => this.result = result.json()));
  }

  isLoggedIn()
  {
    if(sessionStorage.length)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}
