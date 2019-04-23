import { Component, Input } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup } from '@angular/forms';

/**
 * At time of writing for Angular 7 you can write up your validations any way you want so
 * long as it follows the official documentation for reactive forms. The main purpose of
 * this component is to extend Angular's display of reactive form with Angular material by
 * having a component that can display a list of errors per form control without needing the
 * developer to worry about explicity writing a "mat-error" per distinct error.
 */
@Component({
  selector: 'app-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.css']
})
export class ValidationErrorComponent {

  @Input() controlName: string;
  @Input() group: FormGroup;
  @Input() rootGroup: FormGroup;

  get control() {
    return this.group.get(this.controlName);
  }

  get controlErrors() {
    return this.control.errors;
  }

  get formErrors() {
		if (!this.group || (!this.controlName || !this.controlName.trim())) { return {}; }

		const groupErrorList = !this.group.errors ? [] : Object.keys(this.group.errors).map(key => ({ key, value: this.group.errors[key] }));
		const errorList = groupErrorList.filter(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === this.controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === this.controlName))
      )
    );
		const errorObject = errorList && errorList.length > 0 ?
			errorList.reduce((acc, cur) => ({ ...acc, [cur.key]: { ...cur.value } }), {}) : {};

		return errorObject;
	}

  get formArrayErrors() {
    const idPropVal = this.control.parent.get('id') ? this.control.parent.get('id').value : null;

    if (!this.rootGroup || !idPropVal) { return {} }

    const groupErrorList = !this.rootGroup.errors ? [] : Object.keys(this.rootGroup.errors).map(key => ({ key, value: this.rootGroup.errors[key] }))
      .filter(f => f.value.invalidIds);
    const errorList = groupErrorList.filter(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === this.controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === this.controlName))
      ) 
    );

    const errorListFilter = errorList.filter(f => f.value.invalidIds.some(s => s === idPropVal));

    const errorObject = errorListFilter && errorListFilter.length > 0 ?
			errorListFilter.reduce((acc, cur) => ({ ...acc, [cur.key]: { ...cur.value } }), {}) : {};

		return errorObject;
  }
  
  constructor() { }
}