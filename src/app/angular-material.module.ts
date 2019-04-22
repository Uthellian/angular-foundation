import { NgModule } from '@angular/core';
import { MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule } from '@angular/material';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule],
  exports: [MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatCardModule]
})
export class AngularMaterialModule { }