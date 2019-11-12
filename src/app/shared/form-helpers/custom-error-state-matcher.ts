import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { getFormGroupName, getControlName, getChildCompositeControlDetail } from './reactive-form-helper';

/**
 * When used, override Angular's default behaviour as to when error messages are shown for a reactive form control.
 */
export class CrossFieldErrorMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const controlName = getControlName(control);

    // Check if we have any cross field validation errors for a form array
    const isControlFromFormArray = !!control.parent.parent && control.parent.parent.controls instanceof Array;
    const formArrayErrors = isControlFromFormArray ? 
      control.parent.errors ? 
        Object.keys(control.parent.errors).map(key => ({ key, value: control.parent.errors[key] })) : []
          : [];
    const idPropVal = control.parent.get('id') ? control.parent.get('id').value : null;

    const isFormArrayCrossValInError = formArrayErrors.some(f => f && f.value.associatedControl &&
			((typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlName) ||
			(f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlName))));

    // Check if we have any cross field validation errors for a form group
		const formErrorsTemp = form.errors ?
      Object.keys(form.errors).map(key => ({ key, value: form.errors[key] })) : [];
		const isCrossValInError = formErrorsTemp.some(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlName)))
        && (!f.value.invalidIds || f.value.invalidIds.some(s => s === idPropVal)
      )
    );

    // Check if we have any cross field validation errors for a form group within a root form group
    const controlFormGroupName = getFormGroupName(control);
    const rootErrorsTemp = control.root.errors ?
      Object.keys(control.root.errors).map(key => ({ key, value: control.root.errors[key] })).filter(f => f.value.formGroupName) : [];
    const isRootCrossValInError = rootErrorsTemp.some(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlName)) &&
        f.value.formGroupName === controlFormGroupName
      ) 
    );

		return ((control.invalid || (form.invalid && isCrossValInError) || (control.root.invalid && isRootCrossValInError) || (isControlFromFormArray && isFormArrayCrossValInError)) && (control.touched || form.submitted));
	}

}