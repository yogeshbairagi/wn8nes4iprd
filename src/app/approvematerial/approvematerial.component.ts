import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-approvematerial',
  templateUrl: './approvematerial.component.html',
  styleUrls: ['./approvematerial.component.css']
})
export class ApprovematerialComponent implements OnInit {

  materialList: any = [];
  categoriesList: any = [];
  isSuper: boolean = false;
  catId: string = null;
  isFilter: boolean = false;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    if (sessionStorage.getItem("role") != "Admin")
      this.isSuper = true;
    else
      this.isSuper = false;

    this._dataService.getCategories("drop")
      .subscribe(res => {
        if (res.status !== 501) {
          this.categoriesList = res.data;
        }
        else
          alert(res.message);
      });

    this._dataService.getMaterialForApproval(sessionStorage.getItem("catId"), "Pending", sessionStorage.getItem("role"))
      .subscribe(res => {
        this.materialList = res.data;
      });
  }

  onCategoryChange() {
    this._dataService.getMaterialForApprovalcat(this.catId, "Pending")
      .subscribe(res => {
        this.materialList = res.data;
      });

    this.isFilter = true;
  }

  clearFilter() {
    this._dataService.getMaterialForApproval(sessionStorage.getItem("catId"), "Pending", sessionStorage.getItem("role"))
      .subscribe(res => {
        this.materialList = res.data;
      });
    this.catId = null;
    this.isFilter = false;
  }

  approveMaterial(item) {
    if (confirm("Press Ok to add the material.")) {
      this._dataService.approveMaterial(item.matid, sessionStorage.getItem("userId"))
        .subscribe(res => {
          if (res.status != 501) {
            this.clearFilter();
            alert("Material approved and added to the portal.");
          }
          else
            alert(res.message);
        });
    }
  }

  rejectMaterial(item) {
    if (confirm("Press Ok to delete material request.")) {
      this._dataService.deleteMaterial(item.matid)
        .subscribe(res => {
          if (res.status != 501) {
            this.clearFilter();
            alert("Material request rejected and deleted from the portal.");
          }
          else
            alert(res.message);
        });
    }
  }
}
