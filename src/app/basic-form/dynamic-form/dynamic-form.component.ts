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
  form: FormGroup;

  questions: QuestionBase<any>[] = [
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
  ];

  formBluePrint = {
    personDetail: {
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
    private fb: FormBuilder,
    private qcs: QuestionControlService
  ) { }

  ngOnInit() {
    this.form = this.qcs.createBasicFormGroup(this.questions);
    //console.log(this.form);
  }

  onSubmit() {
    this.qcs.isFormSubmitted$.next(true);
    console.log(this.form.valid);
  }

}