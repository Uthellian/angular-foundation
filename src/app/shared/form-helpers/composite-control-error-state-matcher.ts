import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { getFormGroupName, getControlName, getChildCompositeControlDetail, getIsIgnoreRequiredValidation } from './reactive-form-helper';

/**
 * When used, override Angular's default behaviour as to when error messages are shown for a reactive form control.
 */
export class CompositeControlErrorMatcher implements ErrorStateMatcher {

  /** Composite control name. */
  controlName: string;

  /** Form group of composite control. */
  formGroup: any;

  constructor(controlName: string, formGroup: FormGroup) {
    this.controlName = controlName;
    this.formGroup = formGroup;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const compositeControl = this.formGroup.get(this.controlName);
    const controlName = this.controlName;

    // Check if we have any cross field validation errors for a form array
    const isControlFromFormArray = !!compositeControl.parent.parent && compositeControl.parent.parent.controls instanceof Array;
    const formArrayErrors = isControlFromFormArray ? 
      compositeControl.parent.errors ? 
        Object.keys(compositeControl.parent.errors).map(key => ({ key, value: compositeControl.parent.errors[key] })) : []
          : [];
    const idPropVal = compositeControl.parent.get('id') ? compositeControl.parent.get('id').value : null;

    const isFormArrayCrossValInError = formArrayErrors.some(f => f && f.value.associatedControl &&
			((typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlName) ||
			(f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlName))));

    // Check if we have any cross field validation errors for a form group
		const formErrorsTemp = this.formGroup.errors ?
      Object.keys(this.formGroup.errors).map(key => ({ key, value: this.formGroup.errors[key] })) : [];
		const isCrossValInError = formErrorsTemp.some(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlName)))
        && (!f.value.invalidIds || f.value.invalidIds.some(s => s === idPropVal)
      )
    );

    // Check if we have any cross field validation errors for a form group within a root form group
    const controlFormGroupName = getFormGroupName(compositeControl);
    const rootErrorsTemp = compositeControl.root.errors ?
      Object.keys(compositeControl.root.errors).map(key => ({ key, value: compositeControl.root.errors[key] })).filter(f => f.value.formGroupName) : [];
    const isRootCrossValInError = rootErrorsTemp.some(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlName)) &&
        f.value.formGroupName === controlFormGroupName
      ) 
    );

    const isCompositeControlInvalid = !compositeControl.errors ? false : Object.keys(compositeControl.errors).map(key => ({ key, value: compositeControl.errors[key] })).filter(f => f.key && f.key !== 'required').length > 0;

		return (((control.invalid || isCompositeControlInvalid) || (this.formGroup.invalid && isCrossValInError) || (compositeControl.root.invalid && isRootCrossValInError) || (isControlFromFormArray && isFormArrayCrossValInError)) && (control.touched || form.submitted));
	}

}