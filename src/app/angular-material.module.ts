import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule } from '@angular/material';

@NgModule({
  imports: [BrowserAnimationsModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule],
  exports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule]
})
export class AngularMaterialModule { }