import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  users: Array<any>;
  isPending: boolean;
  isFailed: boolean;

  // Create an instance of the DataService, Router through dependency injection
  constructor(private _dataService: DataService, private _router: Router) {

  }

  ngOnInit() {
    if(sessionStorage.length)
      this._router.navigate(["dashboard"]);
  }

  logIn(data) {
    //alert("Entered Email id : " + data.uname);
    this.isFailed = false;
    this.isPending = false;

    var email:string = data.uname.trim().toLowerCase();

    this._dataService.userLogin(email)
      .subscribe(res => {
        //this.users = res;
        if (res.data.length !== 0) {
          if (res.data[0].status === "Active") {
            sessionStorage.setItem("userId", res.data[0].userId);
            sessionStorage.setItem("fname", res.data[0].fname);
            sessionStorage.setItem("lname", res.data[0].lname);
            sessionStorage.setItem("role", res.data[0].role);
            sessionStorage.setItem("status", res.data[0].status);
            this._router.navigate(["dashboard"]);
          }
          else {
            this.isPending = true;
          }
        }
        else {
          this.isFailed = true;
        }
      });

    //this.users[0].userId
  }

}
