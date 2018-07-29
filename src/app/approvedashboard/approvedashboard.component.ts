import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-approvedashboard',
  templateUrl: './approvedashboard.component.html',
  styleUrls: ['./approvedashboard.component.css']
})
export class ApprovedashboardComponent implements OnInit {

  dashboardList: any = [];
  categoriesList: any = [];
  category: string = null;

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

    this._dataService.getDashboards(0, "Pending", sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.dashboardList = res.data;
      });
  }

  onApproveClick(item) {
    if (confirm("Press Ok to add the dashboard.")) {
      this._dataService.approveDashboard(item.dashId)
        .subscribe(res => {
          if (res.status != 501) {
            this.clearFilter();
            alert("Dashboard approved and added to the portal.");
          }
          else
            alert(res.message);
        });
    }
  }

  onRejectClick(item) {
    if (confirm("Press Ok to delete dashboard request.")) {
      this._dataService.deleteDashboard(item.dashId)
        .subscribe(res => {
          if (res.status != 501) {
            this.clearFilter();
            alert("Dashboard request rejected and deleted from the portal.");
          }
          else
            alert(res.message);
        });
    }
  }

  onCategoryChange() {
    this._dataService.getDashboards(this.category, "Pending", sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.dashboardList = res.data;
      });
  }

  clearFilter() {
    this.category = null;
    this._dataService.getDashboards(0, "Pending", sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.dashboardList = res.data;
      });
  }
}
