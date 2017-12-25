import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy/privacy-policy.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PrivacyPolicyComponent],
  exports: [PrivacyPolicyComponent]
})
export class AboutModule { }
