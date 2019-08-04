import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { QuestionBase } from '../base/question-base';
import { QuestionTextbox } from '../base/question-textbox';

@Injectable()
export class QuestionControlService {

  isFormSubmitted$ = new BehaviorSubject<boolean>(false);

  formRootGroup = {
    personDetailsGroup: {
      questions: [
        new QuestionTextbox({
          key: 'firstName',
          value: '',
          placeholder: 'First Name',
          validators: Validators.required
        }),
        new QuestionTextbox({
          key: 'surnameName',
          value: '',
          placeholder: 'Surname Name',
          validators: Validators.required
        })
      ]
    }
  }

  constructor(
    private fb: FormBuilder
  ) {
    const newForm = this.createAdvancedFormGroup(this.formRootGroup);
    console.log(newForm);
  }

  createBasicFormGroup(questions: QuestionBase<any>[] ) {
    const createForm = (formModel) =>
      formModel.reduce((acc, curr) => ({
        ...acc, 
        [curr.key]: new FormControl(curr.value, curr.validators) 
      }), {});

    const newForm = createForm(questions)
    return new FormGroup(newForm);
  }

  createAdvancedFormGroup(bluePrint) {
    const createForm = (formModel) =>
      formModel.constructor === Array && !!formModel.questions 
      ? 
        formModel.reduce((acc, curr) => ({
          ...acc, 
          [curr.key]: new FormControl(curr.value, curr.validators) 
        }), {}) :

        typeof formModel === 'object' && !!formModel.personDetailsGroup ?
          Object.keys(formModel).reduce((obj, prop) => {
            console.log(formModel[prop]);

            obj[prop] = this.fb.group(
              createForm(formModel[prop])
            );

            return obj;
          }, {})

          : formModel;
    
    let newFormGroup = createForm(bluePrint);

    //return new FormGroup(newFormGroup);
    return newFormGroup;
  }

}