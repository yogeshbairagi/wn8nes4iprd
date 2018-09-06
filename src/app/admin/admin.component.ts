import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  userFname: string = null;

  constructor(private _router: Router) { }

  ngOnInit() {
    $('.sidebar__drawer > a').click(function () {
      $(this).parent().toggleClass('sidebar__drawer--opened');
    });

    this.userFname = sessionStorage.getItem("fname");
  }

  userLogOff() {
    sessionStorage.clear();
    //this._router.navigate(["/"]);
    location.reload();
  }

  onApproveClick(event) {
    if (event.srcElement.parentElement.getAttribute("class") == "sidebar__drawer") {
      event.srcElement.parentElement.setAttribute("class", "sidebar__drawer--opened")
    }
    else {
      event.srcElement.parentElement.setAttribute("class", "sidebar__drawer")
    }

    //event.srcElement.parentElement.toggleClass('sidebar__drawer--opened');
    //$(this).parent().toggleClass('sidebar__drawer--opened');
  }
}
