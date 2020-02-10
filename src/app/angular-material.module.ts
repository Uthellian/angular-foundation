import {NgModule} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatSelectModule, MatDividerModule],
  exports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatSelectModule, MatDividerModule]
})
export class AngularMaterialModule { }