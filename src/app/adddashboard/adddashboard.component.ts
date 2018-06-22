import { Component, OnInit } from '@angular/core';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

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
  isAdded: boolean;
  isNotAdded: boolean;

  constructor(private _dataService: DataService) {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.attachmentList.push(JSON.parse(response));
    }
  }

  ngOnInit() {
    var that = this;
    this._dataService.getCategories("drop")
      .subscribe(res => {
        that.categoriesList = res.data;
      });
  }

  addDashboard(data) {
    this.isAdded = false;
    this.isNotAdded = false;

    data.imageuri = this.attachmentList[0].filepath;

    this._dataService.addDasboard(data, "Admin")
      .subscribe(res => {
        if (res.status !== 501)
          this.isAdded = true;
        else
          this.isNotAdded = true;
      });
  }
}
