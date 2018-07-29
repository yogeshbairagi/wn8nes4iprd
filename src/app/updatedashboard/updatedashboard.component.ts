import { Component, OnInit } from '@angular/core';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

// Import the DataService
import { DataService } from '../data.service';

//Import addlinks class
import { AddDashboard } from '../add-dashboard';

@Component({
  selector: 'app-updatedashboard',
  templateUrl: './updatedashboard.component.html',
  styleUrls: ['./updatedashboard.component.css']
})
export class UpdatedashboardComponent implements OnInit {

  uploader: FileUploader = new FileUploader({ url: "/api/upload" });
  dashboardList: any = [];
  categoriesList: any = [];
  model: AddDashboard;
  category: string = null;
  dashId: string = null;
  isFormVisible = false;

  constructor(private _dataService: DataService) {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.model.imageuri = JSON.parse(response).filepath;
    }
  }

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

  onCategoryChange() {
    this.dashId = null;
    this.isFormVisible = false;

    this._dataService.getDashboards(this.category, "Approved", sessionStorage.getItem("userId"))
      .subscribe(res => {
        this.dashboardList = res.data;
      });
  }

  onDashChange() {
    this.isFormVisible = false;
  }

  displayDetails() {
    this.isFormVisible = false;

    this._dataService.displayDashboard(this.dashId)
      .subscribe(res => {
        if (res.status != 501) {
          if (res.data.length > 0) {
            this.model = new AddDashboard('', '', '', '', 0, 0, 0, '', '');
            this.model.category = res.data[0].catId;
            this.model.dname = res.data[0].dashname;
            this.model.ddesc = res.data[0].dashdesc;
            this.model.dlink = res.data[0].dashlink;
            this.model.uusers = res.data[0].unique_users;
            this.model.views = res.data[0].views;
            this.model.age = res.data[0].age;
            this.model.imageuri = res.data[0].imguri;
            //this.model.image = res.data[0].dashname +".jpg";
            this.isFormVisible = true;
          }
          else
            alert("Link doesn't exist. Please select other link.");
        }
        else {
          alert(res.message);
        }
      });
  }

  deleteDashboard(item) {
    if (confirm("Delete " + this.model.dname)) {
      this._dataService.deleteDashboard(this.dashId)
        .subscribe(res => {
          if (res.status != 501) {
            this.dashboardList = [];            
            this.isFormVisible = false;
            this.dashId = null;
            this.category = null;
            alert("Dashboard deleted successfully.");
          }
          else
            alert(res.message);
        });
    }
  }

  updateDashboard() {
    if (this.model.imageuri != '') {
      this._dataService.updateDasboard(this.model, this.dashId)
        .subscribe(res => {
          if (res.status !== 501) {
            alert("Dashboard updated successfully.");
          }
          else {
            alert(res.message);
          }
        });
    }
    else {
      alert("Please upload the image first.");
    }
  }

  onUploadChange() {
    var file: any;

    if (this.model.image == "") {
      this.uploader.clearQueue();
    }
    else if (this.uploader.queue.length > 1) {
      file = this.uploader.queue[0];
      this.uploader.queue[0] = this.uploader.queue[1];
      this.uploader.queue[1] = file;

      this.uploader.queue.pop();
    }
  }
}
