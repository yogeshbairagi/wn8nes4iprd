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
  searchId: string = null;
  ltype: string = null;
  isFormVisible: boolean = false;
  catId: string = null;
  isTypeVisible: boolean = false;

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
    this.searchId = null;
    this.isFormVisible = false;

    this._dataService.getLinks(this.catId, this.ltype, "Approved")
      .subscribe(res => {
        if (res.status != 501)
          this.linkList = res.data;
        else
          alert(res.message);
      });
  }

  onTitleChange()
  {
    this.isFormVisible = false;
  }

  onCategoryChange() {
    this.ltype = null;
    this.searchId = null;
    this.isFormVisible = false;
    this.isTypeVisible = true;

    this._dataService.getLinksCat(this.catId, "Approved")
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
            this.model = new Addlinks('', '', '', '', '', 1, null, null, null);
            this.model.linkid = res.data[0].linkid;
            this.model.linktitle = res.data[0].linktitle;
            this.model.linkdesc = res.data[0].linkdesc;
            this.model.linkurl = res.data[0].linkurl;
            this.model.linkcategory = res.data[0].linkcategory;
            this.model.catId = res.data[0].catId;
            this.model.status = res.data[0].status;
            this.model.addedby = res.data[0].addedby;
            this.model.approvedby = res.data[0].approvedby;
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
            this._dataService.getLinksCat(this.catId, "Approved")
              .subscribe(res => {
                if (res.status != 501)
                  this.linkList = res.data;
                else
                  alert(res.message);
              });
            this.isFormVisible = false;
            this.searchId = null;
            this.ltype = null;
            this.catId = null;
            this.isTypeVisible = false;
            alert("Link deleted successfully.");
          }
          else
            alert(res.message);
        });
    }
  }
}
