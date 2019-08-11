import { NgModule } from '@angular/core';
import { MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatSelectModule, MatDividerModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatDatepickerModule, MatMomentDateModule, MatSelectModule, MatDividerModule],
  exports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatDatepickerModule, MatMomentDateModule, MatSelectModule, MatDividerModule]
})
export class AngularMaterialModule { }