import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

//Import addlinks class
import { Addlinks } from '../addlinks';

@Component({
  selector: 'app-updatelinks',
  templateUrl: './updatelinks.component.html',
  styleUrls: ['./updatelinks.component.css']
})
export class UpdatelinksComponent implements OnInit {

  categoriesList: any = [];
  linkList: any = [];
  model: Addlinks;
  searchId = "";
  ltype = "";
  isFormVisible = false;

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
  }

  onTypeChange() {
    this._dataService.getLinks(this.ltype)
      .subscribe(res => {
        if (res.status != 501)
          this.linkList = res.data;
        else
          alert(res.message);
      });
  }

  searchLink() {
    this.isFormVisible = false;

    this._dataService.getLinksbyId(this.searchId)
      .subscribe(res => {
        if (res.status != 501) {
          if (res.data.length > 0) {
            this.model = new Addlinks('', '', '', '', '', 1);
            this.model.linkid = res.data[0].linkid;
            this.model.linktitle = res.data[0].linktitle;
            this.model.linkdesc = res.data[0].linkdesc;
            this.model.linkurl = res.data[0].linkurl;
            this.model.linkcategory = res.data[0].linkcategory;
            this.model.catId = res.data[0].catId;
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

  updateLink() {
    this._dataService.updateLinks(this.model)
      .subscribe(res => {
        if (res.status != 501) {
          alert("Link updated successfully.");
        }
        else
          alert(res.message);
      });
  }

  deleteLink() {
    if (confirm("Delete " + this.model.linktitle)) {
      this._dataService.deleteLink(this.model.linkid)
        .subscribe(res => {
          if (res.status != 501) {
            this._dataService.getLinks(this.model.linkcategory)
              .subscribe(res => {
                if (res.status != 501)
                  this.linkList = res.data;
                else
                  alert(res.message);
              });
            this.isFormVisible = false;
            this.searchId = "";
            this.ltype = "";
            alert("Link deleted successfully.");
          }
          else
            alert(res.message);
        });
    }
  }
}
