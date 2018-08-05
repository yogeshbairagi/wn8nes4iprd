import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';
import { sequenceEqual } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-approvelinks',
  templateUrl: './approvelinks.component.html',
  styleUrls: ['./approvelinks.component.css']
})
export class ApprovelinksComponent implements OnInit {

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

    this._dataService.getLinksForApproval(sessionStorage.getItem("catId"), "Pending", sessionStorage.getItem("role"))
      .subscribe(res => {
        this.materialList = res.data;
      });
  }

  onCategoryChange() {
    this._dataService.getLinksForApprovalcat(this.catId, "Pending")
      .subscribe(res => {
        this.materialList = res.data;
      });

    this.isFilter = true;
  }

  clearFilter() {
    this._dataService.getLinksForApproval(sessionStorage.getItem("catId"), "Pending", sessionStorage.getItem("role"))
      .subscribe(res => {
        this.materialList = res.data;
      });
    this.catId = null;
    this.isFilter = false;
  }

  approveLink(item) {
    if (confirm("Press Ok to add the link.")) {
      this._dataService.approveLinks(item.linkid, sessionStorage.getItem("userId"))
        .subscribe(res => {
          if (res.status != 501) {
            this.clearFilter();
            alert("Link approved and added to the portal.");
          }
          else
            alert(res.message);
        });
    }
  }

  rejectLink(item) {
    if (confirm("Press Ok to delete link request.")) {
      this._dataService.deleteLink(item.linkid)
        .subscribe(res => {
          if (res.status != 501) {
            this.clearFilter();
            alert("Link request rejected and deleted from the portal.");
          }
          else
            alert(res.message);
        });
    }
  }
}
