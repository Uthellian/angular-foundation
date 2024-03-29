import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { QuestionBase } from '../base/question-base';
import { QuestionTextbox } from '../base/question-textbox';

@Injectable()
export class QuestionControlService {

  isFormSubmitted$ = new BehaviorSubject<boolean>(false);
  formsSubmitted$ = new BehaviorSubject<string[]>([]);

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
      ],
      isFormGroup: true
    },
    addressDetailsGroup: {
      questions: [
        new QuestionTextbox({
          key: 'street',
          value: '',
          placeholder: 'Street',
          validators: Validators.required
        }),
        new QuestionTextbox({
          key: 'suburb',
          value: '',
          placeholder: 'Suburb',
          validators: Validators.required
        })
      ],
      isFormGroup: true
    }
  }

  constructor(
    private fb: FormBuilder
  ) {
    /*const newForm = this.createAdvancedFormGroup(this.formRootGroup);
    console.log(newForm);*/
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
      formModel.constructor === Array 
      ? 
        formModel.reduce((acc, curr) => ({
          ...acc, 
          [curr.key]: new FormControl(curr.value, curr.validators) 
        }), {}) :

        typeof formModel === 'object' && !!formModel.personDetailsGroup ?
          Object.keys(formModel).reduce((obj, prop) => {
            if (!!formModel[prop].questions) {
              
              // Dev help
              //console.log(formModel[prop].groupValidators);

              obj[prop] = !formModel[prop].groupValidators ? this.fb.group(
                createForm(formModel[prop].questions)
              ) : this.fb.group(
                createForm(formModel[prop].questions), {
                  validator: formModel[prop].groupValidators
                }
              );
            }


            return obj;
          }, {})

          : formModel;
    
    let newFormGroup = createForm(bluePrint);

    return !bluePrint.groupValidators ? new FormGroup(newFormGroup) : new FormGroup(newFormGroup, { validators: bluePrint.groupValidators, asyncValidators: [] });
    //return newFormGroup;
  }

}