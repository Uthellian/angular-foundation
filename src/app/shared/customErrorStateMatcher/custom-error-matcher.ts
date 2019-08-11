import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

export class CrossFieldErrorMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const controlName = this.getName(control);

    const isControlFromFormArray = !!control.parent.parent && control.parent.parent.controls instanceof Array;
    const formArrayErrors = isControlFromFormArray ? 
      control.parent.errors ? 
        Object.keys(control.parent.errors).map(key => ({ key, value: control.parent.errors[key] })) : []
          : [];
    const idPropVal = control.parent.get('id') ? control.parent.get('id').value : null;
    //console.log(formGroupId);

    const isFormArrayCrossValInError = formArrayErrors.some(f => f && f.value.associatedControl &&
			((typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlName) ||
			(f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlName))));

		const formErrorsTemp = form.errors ?
      Object.keys(form.errors).map(key => ({ key, value: form.errors[key] })) : [];
		const isCrossValInError = formErrorsTemp.some(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlName)))
        && (!f.value.invalidIds || f.value.invalidIds.some(s => s === idPropVal)
      )
    );

    //console.log(controlName);
    //console.log(isControlFromFormArray);
    //console.log(formArrayErrors);
    //console.log(isFormArrayCrossValInError);
    //console.log(control.parent.parent && control.parent.parent.controls instanceof Array);
    //console.log(form);

    //console.log(formErrorsTemp);
    //console.log((form.invalid && isCrossValInError));

		return ((control.invalid || (form.invalid && isCrossValInError) || (isControlFromFormArray && isFormArrayCrossValInError)) && (control.touched || form.submitted));
	}

	/**
	 * Get the name of the form control.
	 * @param control - Angular form control
	 */
	private getName(control: AbstractControl): string | null {
		const group = <FormGroup>control.parent;

		if (!group) {
			return null;
		}

		let name: string;

		Object.keys(group.controls).forEach(key => {
			const childControl = group.get(key);

			if (childControl !== control) {
				return;
			}

			name = key;
		});

		return name;
	}
}