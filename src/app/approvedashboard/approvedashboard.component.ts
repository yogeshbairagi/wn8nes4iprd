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

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getDashboards(0, "Pending", sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.dashboardList = res.data;
      });
  }

}
