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
  trainingList: any = [];
  rowspanList: any = [];
  trainingData: any = [];
  reportList: any = [];
  toolList: any = [];

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

              this._dataService.getLinksbycat(this.catId.toString(), "Reports", sessionStorage.getItem("userId"))
                .subscribe(res => {
                  this.reportList = res.data;
                });

              this._dataService.getLinksbycat(this.catId.toString(), "Tools", sessionStorage.getItem("userId"))
                .subscribe(res => {
                  this.toolList = res.data;
                });

            });
        }
        else {
          this._dataService.getCategories("dash")
            .subscribe(res => {
              this.categoriesList = res.data;
              this.catId = res.data[2].catId;
              this.catDesc = res.data[2].catDesc;

              this._dataService.getDashboards(this.catId, "Approved", sessionStorage.getItem("userId"))
                .subscribe(res => {
                  this.dashboardList = res.data;
                });

              this._dataService.getLinksbycat(this.catId.toString(), "Reports", sessionStorage.getItem("userId"))
                .subscribe(res => {
                  this.reportList = res.data;
                });

              this._dataService.getLinksbycat(this.catId.toString(), "Tools", sessionStorage.getItem("userId"))
                .subscribe(res => {
                  this.toolList = res.data;
                });

            });
        }
      });
  }

  onCategoryClick(item) {
    document.getElementById("tab-dashboards").setAttribute("class", "tab active");
    document.getElementById("tab-reports").setAttribute("class", "tab");
    // document.getElementById("tab-tools").setAttribute("class", "tab");
    document.getElementById("tab-training").setAttribute("class", "tab");

    document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane active");
    document.getElementById("tab-reports-content").setAttribute("class", "tab-pane");
    // document.getElementById("tab-tools-content").setAttribute("class", "tab-pane");
    document.getElementById("tab-training-content").setAttribute("class", "tab-pane");

    this.catId = item.catId;
    this.catDesc = item.catDesc;

    this._dataService.getDashboards(item.catId, "Approved", sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.dashboardList = res.data;
      });
  }

  onLinkAddFavoriteClick(item) {

    this._dataService.addLinkFavorite(item.linkId, sessionStorage.getItem("userId"))
      .subscribe(res => {
        this._dataService.getLinksbycat(this.catId.toString(), "Reports", sessionStorage.getItem("userId"))
          .subscribe(res => {
            this.reportList = res.data;
          });

        this._dataService.getLinksbycat(this.catId.toString(), "Tools", sessionStorage.getItem("userId"))
          .subscribe(res => {
            this.toolList = res.data;
          });
      });
  }

  onTrainingAddFavoriteClick(item) {
    this._dataService.addTrainingFavorite(item.matid, sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.getMaterialList();
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

  onLinkRemoveFavoriteClick(item) {

    this._dataService.removeLinkFavorite(item.linkId, sessionStorage.getItem("userId"))
      .subscribe(res => {
        this._dataService.getLinksbycat(this.catId.toString(), "Reports", sessionStorage.getItem("userId"))
          .subscribe(res => {
            this.reportList = res.data;
          });

        this._dataService.getLinksbycat(this.catId.toString(), "Tools", sessionStorage.getItem("userId"))
          .subscribe(res => {
            this.toolList = res.data;
          });
      });
  }

  onTrainingRemoveFavoriteClick(item) {
    this._dataService.removeTrainingFavorite(item.matid, sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.getMaterialList();
      });
  }

  userLogOff() {
    sessionStorage.clear();
    //this._router.navigate(["/"]);
    location.reload();
  }

  getRowspan(tid) {
    var count = 0;

    for (var i = 0; i < this.rowspanList.length; i++) {
      if (this.rowspanList[i].tid == tid) {
        count = this.rowspanList[i].count;
      }
    }

    return count;
  }

  onDashboardTabClick(event) {
    var target = event.currentTarget;
    var id = target.getAttribute("id");
    var tab;

    if (id == "tab-dashboards") {
      document.getElementById("tab-dashboards").setAttribute("class", "tab active");
      document.getElementById("tab-reports").setAttribute("class", "tab");
      document.getElementById("tab-training").setAttribute("class", "tab");

      document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane active");
      document.getElementById("tab-reports-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-training-content").setAttribute("class", "tab-pane");
    }
    else if (id == "tab-reports") {
      document.getElementById("tab-reports").setAttribute("class", "tab active");
      document.getElementById("tab-dashboards").setAttribute("class", "tab");
      document.getElementById("tab-training").setAttribute("class", "tab");

      document.getElementById("tab-reports-content").setAttribute("class", "tab-pane active");
      document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-training-content").setAttribute("class", "tab-pane");

      this._dataService.getLinksbycat(this.catId.toString(), "Reports", sessionStorage.getItem("userId"))
        .subscribe(res => {
          if (res.status !== 501) {
            this.reportList = res.data;
          }
          else
            alert(res.message);
        });

      this._dataService.getLinksbycat(this.catId.toString(), "Tools", sessionStorage.getItem("userId"))
        .subscribe(res => {
          if (res.status !== 501) {
            this.toolList = res.data;
          }
          else
            alert(res.message);
        });
    }
    else if (id == "tab-training") {
      document.getElementById("tab-training").setAttribute("class", "tab active");
      document.getElementById("tab-reports").setAttribute("class", "tab");
      document.getElementById("tab-dashboards").setAttribute("class", "tab");

      document.getElementById("tab-training-content").setAttribute("class", "tab-pane active");
      document.getElementById("tab-reports-content").setAttribute("class", "tab-pane");
      document.getElementById("tab-dashboards-content").setAttribute("class", "tab-pane");

      this.getMaterialList();
    }
  }

  getMaterialList() {
    this.trainingData = [];

    this._dataService.getMaterial(this.catId.toString(), sessionStorage.getItem("userId"))
      .subscribe(res => {
        if (res.status !== 501) {
          this.trainingList = res.data;

          this._dataService.getRowspan(this.catId.toString(), sessionStorage.getItem("userId"))
            .subscribe(res => {
              if (res.status !== 501) {
                this.rowspanList = res.data;

                for (var i = 0; i < this.rowspanList.length; i++) {
                  var row = { "title": "", "rowspan": "", "items": [] };
                  row.title = this.rowspanList[i].title;
                  row.rowspan = this.rowspanList[i].count;

                  for (var j = 0; j < this.trainingList.length; j++) {
                    var item = { "matid": "", "mattitle": "", "matdesc": "", "maturl": "", "mattype": "", "userId":"" };
                    if (this.rowspanList[i].tid == this.trainingList[j].tid) {
                      item.matid = this.trainingList[j].matid;
                      item.mattitle = this.trainingList[j].mattitle;
                      item.matdesc = this.trainingList[j].matdesc;
                      item.maturl = this.trainingList[j].maturl;
                      item.mattype = this.trainingList[j].mattype;
                      item.userId = this.trainingList[j].userId;
                      row.items.push(item);
                    }
                  }
                  this.trainingData.push(row);
                }
              }
              else
                alert(res.message);
            });
        }
        else
          alert(res.message);
      });
  }
}