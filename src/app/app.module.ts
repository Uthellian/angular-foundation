import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module'; 
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { BasicFormModule } from './basic-form/basic-form.module';
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule, CommonModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, SharedModule, AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
