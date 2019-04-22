import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicFormRoutingModule } from './basic-form-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { SharedModule } from '../shared/shared.module';
import { BasicFormComponent } from './basic-form/basic-form.component';

@NgModule({
  imports: [
    CommonModule, BasicFormRoutingModule, AngularMaterialModule//, SharedModule
  ],
  declarations: [BasicFormComponent]
})
export class BasicFormModule { }