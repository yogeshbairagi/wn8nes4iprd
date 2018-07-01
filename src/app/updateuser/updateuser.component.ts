import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

//Import add-user class
import { AddUser } from '../add-user';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.css']
})
export class UpdateuserComponent implements OnInit {

  roleList: any = [];
  userList: any = [];
  model: AddUser;
  searchId = "";
  isFormVisible = false;
  isCEC = true;
  isName = false;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getUserRoles()
      .subscribe(res => {
        if (res.status != 501)
          this.roleList = res.data;
        else
          alert(res.message);
      });
  }

  searchUser() {

    this.isFormVisible = false;

    this._dataService.userLogin(this.searchId)
      .subscribe(res => {
        if (res.status != 501) {
          if (res.data.length > 0) {
            this.model = new AddUser('', '', '', '', '', '');
            this.model.userId = res.data[0].userId;
            this.model.fname = res.data[0].fname;
            this.model.lname = res.data[0].lname;
            this.model.role = res.data[0].role;
            this.model.status = res.data[0].status;
            this.isFormVisible = true;
          }
          else
            alert("User doesn't exist. Please check CEC email.");
        }
        else {
          alert(res.message);
        }
      });
  }

  updateUser() {
    if (this.model.role == "Admin") {
      this.model.password = "admin";
    }
    else {
      this.model.password = null;
    }

    this._dataService.updateUser(this.model)
      .subscribe(res => {
        if (res.status != 501) {
          alert("User successfully updated.");
        }
        else
          alert(res.message);
      });
  }

  deleteUser() {
    if (confirm("Delete " + this.model.fname + " " + this.model.lname)) {
      this._dataService.deleteUser(this.model.userId)
        .subscribe(res => {
          if (res.status != 501) {
            this._dataService.getUsers()
              .subscribe(res => {
                if (res.status != 501)
                  this.userList = res.data;
                else
                  alert(res.message);
              });
            this.isFormVisible = false;
            this.searchId = "";
            alert("User successfully deleted.");
          }
          else
            alert(res.message);
        });
    }
  }

  toggleSearch(event) {
    if (event.target.value == "cec") {
      this.isCEC = true;
      this.isName = false;
      this.isFormVisible = false;
      this.searchId = "";
    }
    else {
      this._dataService.getUsers()
        .subscribe(res => {
          if (res.status != 501)
            this.userList = res.data;
          else
            alert(res.message);
        });

      this.isCEC = false;
      this.isName = true;
      this.isFormVisible = false;
      this.searchId = "";
    }
  }
}