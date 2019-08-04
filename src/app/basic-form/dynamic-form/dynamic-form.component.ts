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
      value: 'Matt',
      placeholder: 'First Name',
      order: 1
    })
  ];

  constructor(
    private fb: FormBuilder,
    private qcs: QuestionControlService
  ) { }

  ngOnInit() {
    // If there is a red squiggle here it's probaly a StackBlitz bug.
    this.form = this.qcs.toFormGroup(this.questions);
  }

}