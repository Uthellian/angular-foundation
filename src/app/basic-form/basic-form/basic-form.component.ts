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

  dobRequiredValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    const firstName = formGroup.get('firstName').value;
    const dateOfBirth = formGroup.get('dateOfBirth').value;
    return firstName && !dateOfBirth ? { 'dobRequired': { associatedControl: ['dateOfBirth'], message: 'Date of birth is required.' } } : null;
  };

  basicForm: FormGroup = this.fb.group({
    firstName: [null, [Validators.required]],
    surnameName: [null, [Validators.required]],
    dateOfBirth: [null, []],
    titleId: [null, [Validators.required]]
  }, {
    validator: [this.dobRequiredValidator]
  });

  titleRefData: TitleRefData[] = [
    { id: 1, name: 'Mr' },
    { id: 2, name: 'Miss' }
  ]

  get dob() {
    return this.basicForm.get('dateOfBirth');
  }

  constructor(
    private fb: FormBuilder,
    private qcs: QuestionControlService
  ) { }

  ngOnInit() {
    this.dob.valueChanges.subscribe(s => console.log(s));
  }

  setDobCurrentDate() {
    //this.dob.setValue(new Date());
    this.basicForm.patchValue({
      firstName: 'test',
      surnameName: 'test',
      dateOfBirth: new Date(),
      titleId: 1
    });
  }

  clearDob() {
    this.dob.reset();
  }

  disableDob() {
    this.dob.disable();
  }

  undisableDob() {
    this.dob.enable();
  }

  onSubmit() {
    console.log(this.basicForm.get('dateOfBirth').value);
    this.qcs.isFormSubmitted$.next(true);
  }

}