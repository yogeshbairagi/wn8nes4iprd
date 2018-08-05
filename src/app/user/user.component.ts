import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userFname: string = null;

  constructor() { }

  ngOnInit() {
    this.userFname = sessionStorage.fname;
  }

  userLogOff()
  {
    sessionStorage.clear();
    //this._router.navigate(["/"]);
    location.reload();
  }

}
