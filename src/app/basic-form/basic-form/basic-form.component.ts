import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm, FormArray } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.basicForm.valid);
  }

}