import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

//Import add-user class
import { AddUser } from '../add-user';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  roleList: any = [];
  categoriesList: any = [];
  model = new AddUser('', '', '', 'User', '', '', '3');

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getUserRoles()
      .subscribe(res => {
        if (res.status != 501)
          this.roleList = res.data;
        else
          alert(res.message);
      });

    this._dataService.getCategories("drop")
      .subscribe(res => {
        if (res.status !== 501) {
          this.categoriesList = res.data;
        }
        else
          alert(res.message);
      });
  }

  userSignup() {

    if (this.model.role == "Admin") {
      this.model.password = "cisco";
    }

    this.model.status = "Active";

    this._dataService.userSignup(this.model)
      .subscribe(res => {
        if (res.status != 501) {
          this.model = new AddUser('', '', '', 'User', '', '', '3');
          alert("User successfully added.");
        }
        else
          alert(res.message);
      });
  }
}
