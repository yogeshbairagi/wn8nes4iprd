import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css']
})
export class AddcategoryComponent implements OnInit {

  catDesc = "";

  constructor(private _dataService: DataService) { }

  ngOnInit() {
  }

  addCategory() {
    this._dataService.addCategory(this.catDesc)
      .subscribe(res => {
        if (res.status != 501) {
          this.catDesc = "";
          alert("Category added successfully.");
        }
        else
          alert(res.message);
      });
  }
}
