import { Component, OnInit } from '@angular/core';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

//import add-dashboard class
import { AddDashboard } from '../add-dashboard';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-adddashboard',
  templateUrl: './adddashboard.component.html',
  styleUrls: ['./adddashboard.component.css']
})
export class AdddashboardComponent implements OnInit {

  uploader: FileUploader = new FileUploader({ url: "/api/upload" });
  attachmentList: any = [];
  categoriesList: any = [];
  model = new AddDashboard('2', '', '', '', 0, 0, 0, '', '', null, null);
  isUser: boolean = false;
  isAdmin: boolean = false;

  constructor(private _dataService: DataService) {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.model.imageuri = JSON.parse(response).filepath;
    }
  }

  ngOnInit() {
    var that = this;

    if(sessionStorage.getItem("role") == "User")
    {
      this.isUser = true;
      this.isAdmin = false;
      this.model.addedby = sessionStorage.getItem("userId");
    }
    else
    {
      this.isUser = false;
      this.isAdmin = true;
      this.model.addedby = sessionStorage.getItem("userId");
      this.model.approvedby = sessionStorage.getItem("userId");
    }

    this._dataService.getCategories("drop")
      .subscribe(res => {
        if (res.status !== 501) {
          that.categoriesList = res.data;
        }
        else
          alert(res.message);
      });
  }

  addDashboard() {
    if (this.model.imageuri != '') {
      this._dataService.addDasboard(this.model, sessionStorage.getItem("role"))
        .subscribe(res => {
          if (res.status !== 501) {
            this.model = new AddDashboard('2', '', '', '', 0, 0, 0, '', '', null, null);
            alert("Dashboard added successfully.");
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
