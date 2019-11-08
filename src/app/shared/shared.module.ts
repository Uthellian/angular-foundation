import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ValidationErrorComponent } from './components/validation-error/validation-error.component';

import { ErrorKeyPipe } from './pipes/error-key.pipe';
import { FormErrorMessagePipe } from './pipes/form-error-message.pipe';
import { DynamicFormQuestionComponent } from './components/dynamic-form-question/dynamic-form-question.component';
import { QuestionControlService } from './services/question-control.service';
import { DateTimeFormControlComponent } from './components/date-time-form-control/date-time-form-control.component';
import { TimeInputDirective } from './directives/time-input.directive';
import { DateInputDirective } from './directives/date-input.directive';
import { CompositeControlValidationErrorComponent } from './components/composite-control-validation-error/composite-control-validation-error.component';

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
    DynamicFormQuestionComponent,
    DateTimeFormControlComponent,
    TimeInputDirective,
    DateInputDirective,
    CompositeControlValidationErrorComponent
  ],
  exports: [
    ValidationErrorComponent,
    ErrorKeyPipe,
    FormErrorMessagePipe,
    DynamicFormQuestionComponent,
    DateTimeFormControlComponent,
    TimeInputDirective,
    DateInputDirective,
    CompositeControlValidationErrorComponent
  ],
  providers: [QuestionControlService]
})
export class SharedModule { }