import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-approvetraining',
  templateUrl: './approvetraining.component.html',
  styleUrls: ['./approvetraining.component.css']
})
export class ApprovetrainingComponent implements OnInit {

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

    this._dataService.getTrainingForApproval(sessionStorage.getItem("catId"), "Pending", sessionStorage.getItem("role"))
      .subscribe(res => {
        this.materialList = res.data;
      });
  }

  onCategoryChange() {
    this._dataService.getTrainingForApprovalcat(this.catId, "Pending")
      .subscribe(res => {
        this.materialList = res.data;
      });

    this.isFilter = true;
  }

  clearFilter() {
    this._dataService.getTrainingForApproval(sessionStorage.getItem("catId"), "Pending", sessionStorage.getItem("role"))
      .subscribe(res => {
        this.materialList = res.data;
      });
    this.catId = null;
    this.isFilter = false;
  }

  approveTraining(item) {
    if (confirm("Press Ok to add the training.")) {
      this._dataService.approveTraining(item.tid, sessionStorage.getItem("userId"))
        .subscribe(res => {
          if (res.status != 501) {
            this.clearFilter();
            alert("Training approved and added to the portal.");
          }
          else
            alert(res.message);
        });
    }
  }

  rejectTraining(item) {
    if (confirm("Press Ok to delete training request.")) {
      this._dataService.deleteTraining(item.tid)
        .subscribe(res => {
          if (res.status != 501) {
            this.clearFilter();
            alert("Training request rejected and deleted from the portal.");
          }
          else
            alert(res.message);
        });
    }
  }
}
