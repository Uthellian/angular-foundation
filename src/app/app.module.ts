import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module'; 
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule, CommonModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, SharedModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
