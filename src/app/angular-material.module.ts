import { NgModule } from '@angular/core';
import { MatInputModule, MatButtonModule, MatRadioModule, MatCardModule, MatSelectModule, MatDividerModule } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatSelectModule, MatDividerModule],
  exports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatSelectModule, MatDividerModule]
})
export class AngularMaterialModule { }