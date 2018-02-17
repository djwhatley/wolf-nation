import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
;
import { SupportBadgeComponent } from './support-badge/support-badge.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SupportBadgeComponent],
  exports: [SupportBadgeComponent]
})
export class SharedModule { }
