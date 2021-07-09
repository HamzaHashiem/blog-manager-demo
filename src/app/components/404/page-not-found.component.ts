import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'page-not-found',
  templateUrl: 'page-not-found.component.html',
  styleUrls: ['page-not-found.component.css'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit() {}

  backClicked() {
    this._location.back();
  }
}
