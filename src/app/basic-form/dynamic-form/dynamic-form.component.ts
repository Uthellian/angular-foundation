import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm, FormArray } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  basicForm: FormGroup = this.fb.group({
    firstName: [null, [Validators.required]]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}