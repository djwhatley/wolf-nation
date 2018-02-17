import { Component, OnInit } from '@angular/core';

import { AppError, ErrorService } from 'app/core/error/error.service';

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(
    private errorService: ErrorService
  ) { }

  error: AppError;

  ngOnInit() {
    this.error = this.errorService.getError();
    if (!this.error) {
      this.error = {
        title: 'Whoops',
        message: 'Looks like something went wrong.'
      }
    }
  }

}
