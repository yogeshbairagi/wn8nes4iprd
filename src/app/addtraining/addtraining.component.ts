import { Component, OnInit } from '@angular/core';

// Import the DataService
import { DataService } from '../data.service';

//import add-training class
import { AddTraining } from '../add-training';

@Component({
  selector: 'app-addtraining',
  templateUrl: './addtraining.component.html',
  styleUrls: ['./addtraining.component.css']
})
export class AddtrainingComponent implements OnInit {

  categoriesList: any = [];
  model = new AddTraining(null, null, null);

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

  addTraining() {
    this._dataService.addTraining(this.model)
      .subscribe(res => {
        if (res.status != 501) {
          this.model = new AddTraining(null, null, null);
          alert("Training added successfully.");
        }
        else
          alert(res.message);
      });
  }
}
