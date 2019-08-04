import { Validators, ValidatorFn } from '@angular/forms';

export class QuestionBase<T> {
  value: T;
  key: string
  placeholder: string;
  controlType: string;
  validators: [ValidatorFn];

  constructor(
    options: {
      value?: T,
      key?: string,
      placeholder?: string,
      controlType?: string,
      validators?: [ValidatorFn] 
    } = {}
  ) {
      this.value = options.value;
      this.key = options.key || '';
      this.placeholder = options.placeholder || '';
      this.controlType = options.controlType || '';
      this.validators = options.validators || null;
  }
}