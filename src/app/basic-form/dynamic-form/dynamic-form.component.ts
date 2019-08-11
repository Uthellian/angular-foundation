import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { QuestionBase } from '../../shared/base/question-base';
import { QuestionTextbox } from '../../shared/base/question-textbox';
import { QuestionControlService } from '../../shared/services/question-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  formModel: any;
  form: FormGroup;

  basicFormRootGroup = {
    questions: [
      new QuestionTextbox({
        key: 'firstName',
        value: '',
        placeholder: 'First Name',
        validators: Validators.required
      }),
      new QuestionTextbox({
        key: 'middleName',
        value: '',
        placeholder: 'Middle Name',
        validators: Validators.required
      }),
      new QuestionTextbox({
        key: 'surnameName',
        value: '',
        placeholder: 'Surname Name',
        validators: Validators.required
      })
    ],
    isBasicForm: true
  }
  
  advancedFormRootGroup = {
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
    },
    isBasicForm: false
  }

  get allFormGroupNames() {
    const formGroupNames = Object.keys(this.advancedFormRootGroup).
      filter(f => f.indexOf('Group') !== -1);
    return formGroupNames;
  }

  constructor(
    private fb: FormBuilder,
    private qcs: QuestionControlService
  ) {
    //this.formModel = this.basicFormRootGroup;
    this.formModel = this.advancedFormRootGroup;
  }

  ngOnInit() {
    this.form = this.qcs.createAdvancedFormGroup(this.advancedFormRootGroup);
    //this.form = this.qcs.createBasicFormGroup(this.basicFormRootGroup.questions);
    //console.log(this.form);
  }

  onSubmit() {
    this.qcs.isFormSubmitted$.next(true);
    console.log(this.form.valid);
  }

}