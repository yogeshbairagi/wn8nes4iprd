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
  userFname: string = null;

  constructor(private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    this.userFname = sessionStorage.fname;

    this._dataService.getFavoriteCount(sessionStorage.getItem("userId"))
      .subscribe(res => {
        if (res.data[0].count > 0) {
          this._dataService.getCategories("dash")
            .subscribe(res => {
              this.categoriesList = res.data;
              this.catId = res.data[0].catId;
              this.catDesc = res.data[0].catDesc;

              this._dataService.getDashboards(this.catId, "Approved", sessionStorage.getItem("userId"))
                .subscribe(res => {
                  this.dashboardList = res.data;
                });

            });
        }
        else {
          this._dataService.getCategories("dash")
            .subscribe(res => {
              this.categoriesList = res.data;
              this.catId = res.data[1].catId;
              this.catDesc = res.data[1].catDesc;

              this._dataService.getDashboards(this.catId, "Approved", sessionStorage.getItem("userId"))
                .subscribe(res => {
                  this.dashboardList = res.data;
                });
            });
        }
      });
  }

  onCategoryClick(item) {
    document.getElementById("tab-dashboards").setAttribute("class", "tab active");
    document.getElementById("tab-reports").setAttribute("class", "tab");
    document.getElementById("tab-tools").setAttribute("class", "tab");
    document.getElementById("tab-training").setAttribute("class", "tab");

    document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane active");
    document.getElementById("tab-reports-content").setAttribute("class", "tab-pane");
    document.getElementById("tab-tools-content").setAttribute("class", "tab-pane");
    document.getElementById("tab-training-content").setAttribute("class", "tab-pane");

    this.catId = item.catId;
    this.catDesc = item.catDesc;

    this._dataService.getDashboards(item.catId, "Approved", sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.dashboardList = res.data;
      });
  }

  onAddFavoriteClick(item) {

    this._dataService.addFavorite(item.dashId, sessionStorage.getItem("userId"))
      .subscribe(res => {
        this._dataService.getDashboards(this.catId, "Approved", sessionStorage.getItem("userId"))
          .subscribe(res => {
            this.dashboardList = res.data;
          });
      });
  }

  onRemoveFavoriteClick(item) {

    this._dataService.removeFavorite(item.dashId, sessionStorage.getItem("userId"))
      .subscribe(res => {
        this._dataService.getDashboards(this.catId, "Approved", sessionStorage.getItem("userId"))
          .subscribe(res => {
            this.dashboardList = res.data;
          });
      });
  }

  userLogOff() {
    sessionStorage.clear();
    this._router.navigate(["/"]);
  }

  onDashboardTabClick(event) {
    var target = event.currentTarget;
    var id = target.getAttribute("id");
    var tab;

    if (id == "tab-dashboards") {
      document.getElementById("tab-dashboards").setAttribute("class", "tab active");
      document.getElementById("tab-reports").setAttribute("class", "tab");
      document.getElementById("tab-tools").setAttribute("class", "tab");
      document.getElementById("tab-training").setAttribute("class", "tab");

      document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane active");
      document.getElementById("tab-reports-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-tools-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-training-content").setAttribute("class", "tab-pane");
    }
    else if (id == "tab-reports") {
      document.getElementById("tab-reports").setAttribute("class", "tab active");
      document.getElementById("tab-dashboards").setAttribute("class", "tab");
      document.getElementById("tab-training").setAttribute("class", "tab");
      document.getElementById("tab-tools").setAttribute("class", "tab");

      document.getElementById("tab-reports-content").setAttribute("class", "tab-pane active");
      document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-training-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-tools-content").setAttribute("class", "tab-pane");
    }
    else if (id == "tab-tools") {
      document.getElementById("tab-training").setAttribute("class", "tab");
      document.getElementById("tab-reports").setAttribute("class", "tab");
      document.getElementById("tab-dashboards").setAttribute("class", "tab");
      document.getElementById("tab-tools").setAttribute("class", "tab active");

      document.getElementById("tab-training-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-reports-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-tools-content").setAttribute("class", "tab-pane active");
    }
    else if (id == "tab-training") {
      document.getElementById("tab-training").setAttribute("class", "tab active");
      document.getElementById("tab-reports").setAttribute("class", "tab");
      document.getElementById("tab-dashboards").setAttribute("class", "tab");
      document.getElementById("tab-tools").setAttribute("class", "tab");

      document.getElementById("tab-training-content").setAttribute("class", "tab-pane active");
      document.getElementById("tab-reports-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-tools-content").setAttribute("class", "tab-pane");
    }
  }
}
