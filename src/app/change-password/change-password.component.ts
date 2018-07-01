import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  password = "";
  npassword = "";

  constructor(private _dataService: DataService, private _router: Router) { }

  ngOnInit() {
  }

  changePassword() {
    if (this.password == this.npassword) {
      if (confirm("You will be logged out of the portal. Do you want to continue?")) {
        this._dataService.changePassword(this.password)
          .subscribe(res => {
            if (res.status != 501) {
              this.userLogOff();
            }
            else
              alert(res.message);
          });
      }
    }
    else {
      this.password = "";
      this.npassword = "";
      alert("Passwords doesn't match. Please re-enter the password.");
    }
  }

  userLogOff()
  {
    sessionStorage.clear();
    this._router.navigate(["/"]);
  }
}
