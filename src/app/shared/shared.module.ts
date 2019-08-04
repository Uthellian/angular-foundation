import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ValidationErrorComponent } from './components/validation-error/validation-error.component';

import { ErrorKeyPipe } from './pipes/error-key.pipe';
import { FormErrorMessagePipe } from './pipes/form-error-message.pipe';
import { DynamicFormQuestionComponent } from './components/dynamic-form-question/dynamic-form-question.component';
import { QuestionControlService } from './services/question-control.service';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [
    ValidationErrorComponent,
    ErrorKeyPipe,
    FormErrorMessagePipe,
    DynamicFormQuestionComponent
  ],
  exports: [
    ValidationErrorComponent,
    ErrorKeyPipe,
    FormErrorMessagePipe,
    DynamicFormQuestionComponent
  ],
  providers: [QuestionControlService]
})
export class SharedModule { }