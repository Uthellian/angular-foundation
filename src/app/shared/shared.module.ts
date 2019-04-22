import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationErrorComponent } from './components/validation-error/validation-error.component';

import { ErrorKeyPipe } from './pipes/error-key.pipe';
import { FormErrorMessagePipe } from './pipes/form-error-message.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ValidationErrorComponent,
    ErrorKeyPipe,
    FormErrorMessagePipe
  ],
  exports: [
    ValidationErrorComponent,
    ErrorKeyPipe,
    FormErrorMessagePipe
  ]
})
export class SharedModule { }