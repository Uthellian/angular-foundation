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
  
  addressDetailsRequiredValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    const firstName = formGroup.get('personDetailsGroup').get('firstName').value;
    const surname = formGroup.get('personDetailsGroup').get('surname').value;

    const street = formGroup.get('addressDetailsGroup').get('street').value;
    const suburb = formGroup.get('addressDetailsGroup').get('suburb').value;

    const isPersonDetailsCompleted = firstName && surname;
    
    const invalidControls = isPersonDetailsCompleted && (!street || !suburb) ? !street && !suburb ? ['street', 'suburb'] : !street ? ['street'] : ['suburb']
    : [];

    //console.log(invalidControls);

    return !invalidControls.length ? null :  { 'addressDetailsRequired': { associatedControl: invalidControls, formGroupName: 'addressDetailsGroup', message: 'This is required.' } }
  };

  advancedFormRootGroup = {
    personDetailsGroup: {
      sectionHeading: 'Person Details',
      questions: [
        new QuestionTextbox({
          key: 'firstName',
          value: '',
          placeholder: 'First Name',
          validators: Validators.required
        }),
        new QuestionTextbox({
          key: 'surname',
          value: '',
          placeholder: 'Surname Name',
          validators: Validators.required
        })
      ],
      isFormGroup: true
    },
    addressDetailsGroup: {
      sectionHeading: 'Address Details',
      questions: [
        new QuestionTextbox({
          key: 'street',
          value: '',
          placeholder: 'Street',
          validators: null
        }),
        new QuestionTextbox({
          key: 'suburb',
          value: '',
          placeholder: 'Suburb',
          validators: null
        })
      ],
      isFormGroup: true
    },
    groupValidators: [this.addressDetailsRequiredValidator],
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
    console.log(this.form);
  }

  onSubmit() {
    this.qcs.isFormSubmitted$.next(true);
    console.log(this.form.valid);
  }

}