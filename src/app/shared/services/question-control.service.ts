import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from '../base/question-base';

@Injectable()
export class QuestionControlService {

  constructor() { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      group[question.key] = new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}