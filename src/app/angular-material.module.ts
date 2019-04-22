import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule } from '@angular/material';

@NgModule({
  imports: [BrowserAnimationsModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule],
  exports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule]
})
export class AngularMaterialModule { }