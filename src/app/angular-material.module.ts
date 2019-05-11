import { NgModule } from '@angular/core';
import { MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatDatepickerModule, MatMomentDateModule],
  exports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule, MatDatepickerModule, MatMomentDateModule]
})
export class AngularMaterialModule { }