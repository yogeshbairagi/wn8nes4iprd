import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isUpdated: boolean;
  isNotUpdated: boolean;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
  }

  userSignup(data) {

    this.isUpdated = false;
    this.isNotUpdated = false;

    this._dataService.userSignup(data)
      .subscribe(res => {
        if (res.status !== 501)
          this.isUpdated = true;
        else
          this.isNotUpdated = true;
      });
  }

}
