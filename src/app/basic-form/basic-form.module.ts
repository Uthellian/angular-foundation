import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicFormRoutingModule } from "./basic-form-routing.module";
import { SharedModule } from '../shared/shared.module';

import { BasicFormComponent } from './basic-form/basic-form.component';

@NgModule({
  imports: [
    CommonModule, BasicFormRoutingModule, SharedModule
  ],
  declarations: [BasicFormComponent]
})
export class BasicFormModule { }