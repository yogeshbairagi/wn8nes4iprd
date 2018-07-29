import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
//import * as $ from 'jquery';

// Import the DataService
import { DataService } from '../data.service';

//Import classes
import { UserLogin } from '../user-login';
import { AddUser } from '../add-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = new UserLogin('', '', false, false, true, false);
  umodel = new AddUser('','','','User','',null);

  // Create an instance of the DataService, Router through dependency injection
  constructor(private _dataService: DataService, private _router: Router) {

  }

  ngOnInit() {
    if (sessionStorage.length)
      this._router.navigate(["dashboard"]);
  }

  userSignup() {

    this.umodel.status = "Active";
    
    this._dataService.userSignup(this.umodel)
      .subscribe(res => {
        if (res.status != 501)
        {
          this.umodel = new AddUser('','','','User','',null);
          alert("User successfully added.");
        }
        else
          alert("User already exists. Please check your CEC ID.");
      });
  }

  logIn() {

    this._dataService.userLogin(this.model.userId.trim().toLowerCase())
      .subscribe(res => {
        //this.users = res;
        if (res.data.length !== 0) {
          if (res.data[0].password === this.model.password) {
            this.model.loginmsg = false;
            sessionStorage.setItem("userId", res.data[0].userId);
            sessionStorage.setItem("fname", res.data[0].fname);
            sessionStorage.setItem("lname", res.data[0].lname);
            sessionStorage.setItem("role", res.data[0].role);
            sessionStorage.setItem("status", res.data[0].status);
            this._router.navigate(["dashboard"]);
          }
          else {
            this.model.loginmsg = true;
          }
        }
        else {
          this.model.loginmsg = true;
        }
      });

    //this.users[0].userId
  }

  onLoginClick()
  {
    this.model = new UserLogin('', '', false, false, true, false);
  }

  onRegisterClick()
  {
    this.umodel = new AddUser('','','','User','',null);
  }

  userCheck() {
    if (this.model.userId.trim().toLowerCase() != "") {
      this._dataService.userLogin(this.model.userId.trim().toLowerCase())
        .subscribe(res => {
          //this.users = res;
          if (res.data.length !== 0) {
            this.model.msgshow = false;

            if (res.data[0].role != "User") {
              this.model.pwdshow = true;
              this.model.goshow = false;
            }
            else {
              sessionStorage.setItem("userId", res.data[0].userId);
              sessionStorage.setItem("fname", res.data[0].fname);
              sessionStorage.setItem("lname", res.data[0].lname);
              sessionStorage.setItem("role", res.data[0].role);
              sessionStorage.setItem("status", res.data[0].status);
              this._router.navigate(["dashboard"]);
            }
          }
          else {
            this.model.msgshow = true;
            this.model.pwdshow = false;
            this.model.goshow = true;
          }
        });
    }
    else {
      this.model.msgshow = true;
      this.model.pwdshow = false;
    }
  }
}
