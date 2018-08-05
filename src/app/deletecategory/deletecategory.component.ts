import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-deletecategory',
  templateUrl: './deletecategory.component.html',
  styleUrls: ['./deletecategory.component.css']
})
export class DeletecategoryComponent implements OnInit {

  categoriesList: any = [];
  catId: string = null;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getCategories("drop")
      .subscribe(res => {
        if (res.status !== 501) {
          this.categoriesList = res.data;
        }
        else
          alert(res.message);
      });
  }

  deleteRole() {
    if (confirm("Be cautious! All Dashboards, Links and Trainings under this role will be deleted. Are you sure you want to continue?")) {
      this._dataService.deleteCategory(this.catId)
        .subscribe(res => {
          if (res.status !== 501) {
            this.catId = null;

            this._dataService.getCategories("drop")
              .subscribe(res => {
                if (res.status !== 501) {
                  this.categoriesList = res.data;
                }
                else
                  alert(res.message);
              });

            alert("Role deleted successfully.");
          }
          else
            alert(res.message);
        });
    }
  }
}
