import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  categoriesList: any = [];
  dashboardList: any = [];
  catId: number;
  catDesc: string = null;

  constructor(private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    var that = this;
    this._dataService.getCategories("dash")
      .subscribe(res => {
        this.categoriesList = res.data;
        this.catId = res.data[1].catId;
        this.catDesc = res.data[1].catDesc;

        this._dataService.getDashboards(this.catId, "Approved")
          .subscribe(res => {
            this.dashboardList = res.data;
          });
      });
  }

  onAdminClick() {
    this._router.navigate(["admin"]);
  }

  onCategoryClick(item) {
    this.catId = item.catId;
    this.catDesc = item.catDesc;

    this._dataService.getDashboards(item.catId, "Approved")
      .subscribe(res => {
        this.dashboardList = res.data;
      });
  }

  onAddFavoriteClick(item) {

    this._dataService.addFavorite(item.dashId, sessionStorage.getItem("userId"))
      .subscribe(res => {
        this._dataService.getDashboards(this.catId, "Approved")
          .subscribe(res => {
            this.dashboardList = res.data;
          });
      });
  }

  onRemoveFavoriteClick(item) {

    this._dataService.removeFavorite(item.dashId, sessionStorage.getItem("userId"))
      .subscribe(res => {
        this._dataService.getDashboards(this.catId, "Approved")
          .subscribe(res => {
            this.dashboardList = res.data;
          });
      });
  }

  userLogOff() {
    sessionStorage.clear();
    this._router.navigate(["/"]);
  }

}
