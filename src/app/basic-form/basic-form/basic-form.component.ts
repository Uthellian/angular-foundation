import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { QuestionControlService } from '../../shared/services/question-control.service';

export interface TitleRefData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.css']
})
export class BasicFormComponent implements OnInit {

  basicForm: FormGroup = this.fb.group({
    firstName: [null, [Validators.required]],
    surnameName: [null, [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    titleId: [null, [Validators.required]]
  });

  titleRefData: TitleRefData[] = [
    { id: 1, name: 'Mr' },
    { id: 2, name: 'Miss' }
  ]

  constructor(
    private fb: FormBuilder,
    private qcs: QuestionControlService
  ) { }

  ngOnInit() {
    this.basicForm.get('dateOfBirth').valueChanges.subscribe(s => console.log(s));
  }

  onSubmit() {
    this.basicForm.get('dateOfBirth').setValue(new Date());
    console.log(this.basicForm.value);
    this.qcs.isFormSubmitted$.next(true);
  }

}