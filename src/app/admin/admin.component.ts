import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  userFname: string = null;

  constructor(private _router: Router) { }

  ngOnInit() {
    this.userFname = sessionStorage.fname;
  }

  userLogOff()
  {
    sessionStorage.clear();
    this._router.navigate(["/"]);
  }
}
