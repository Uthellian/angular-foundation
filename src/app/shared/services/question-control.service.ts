import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { QuestionBase } from '../base/question-base';

@Injectable()
export class QuestionControlService {

  isFormSubmitted$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      group[question.key] = new FormControl(question.value, question.validators);
    });
    return new FormGroup(group);
  }
}