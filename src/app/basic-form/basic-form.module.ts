import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicFormRoutingModule } from './basic-form-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BasicFormComponent } from './basic-form/basic-form.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

@NgModule({
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, BasicFormRoutingModule, AngularMaterialModule, SharedModule
  ],
  declarations: [BasicFormComponent, DynamicFormComponent]
})
export class BasicFormModule { }