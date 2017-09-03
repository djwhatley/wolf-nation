import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorService {

  constructor(
    private router: Router
  ) { }

  private currentError: AppError;

  getError(): AppError {
    return this.currentError;
  }

  error(title: string, message: string) {
    this.currentError = {
      title: title,
      message: message
    };
    this.router.navigateByUrl('/error');
  }
}

export class AppError {
  title: string;
  message: string;
}
