import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-badge',
  templateUrl: './support-badge.component.html',
  styleUrls: ['./support-badge.component.css']
})
export class SupportBadgeComponent implements OnInit {

  badgeClass: string;
  badgeText: string;

  constructor() { }

  @Input()
  set level(val: number) {
    switch (val) {
      case 1:
        this.badgeClass = 'badge-success';
        this.badgeText = 'Supportive';
        break;
      case 2:
        this.badgeClass = 'badge-warning';
        this.badgeText = 'Unsure';
        break;
      case 3:
        this.badgeClass = 'badge-danger';
        this.badgeText = 'Not Supportive';
        break;
      case 4:
        this.badgeClass = 'badge-light';
        this.badgeText = 'Not Contacted';
        break;
    }
  }

  ngOnInit() {
  }

}
