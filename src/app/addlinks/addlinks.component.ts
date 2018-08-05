import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

//Import addlinks class
import { Addlinks } from '../addlinks';

@Component({
  selector: 'app-addlinks',
  templateUrl: './addlinks.component.html',
  styleUrls: ['./addlinks.component.css']
})
export class AddlinksComponent implements OnInit {

  model = new Addlinks('', '', '', 'Reports', '2', 1, null, null, null);
  categoriesList: any = [];

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getCategories("drop")
      .subscribe(res => {
        if (res.status != 501)
          this.categoriesList = res.data;
        else
          alert(res.message);
      });
  }

  addLinks() {
    if (sessionStorage.getItem("role") == "User") { 
      this.model.status = "Pending";
      this.model.addedby = sessionStorage.getItem("userId");
    }
    else { 
      this.model.status = "Approved";
      this.model.addedby = sessionStorage.getItem("userId");
      this.model.approvedby = sessionStorage.getItem("userId");
    }

    this._dataService.addLinks(this.model)
      .subscribe(res => {
        if (res.status != 501) {
          this.model = new Addlinks('', '', '', 'Reports', '2', 1, null, null, null);
          alert("Link successfully added.");
        }
        else
          alert(res.message);
      });
  }

}
