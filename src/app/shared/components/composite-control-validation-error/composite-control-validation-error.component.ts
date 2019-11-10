import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl } from '@angular/forms';
import { getFormGroupName, getControlName, getChildCompositeControlDetail, getIsIgnoreRequiredValidation } from '../../form-helpers/reactive-form-helper';

/**
 * At the time of writing for Angular 7 you can write up your validations any way you want so
 * long as it follows the official documentation for reactive forms. The main purpose of
 * this component is to make it easier for developers to display a list of reactive form 
 * validation with Angular material per form control without needing the
 * developer to worry about explicity writing a "mat-error" per distinct error.
 */
@Component({
  selector: 'app-composite-control-validation-error',
  templateUrl: './composite-control-validation-error.component.html',
  styleUrls: ['./composite-control-validation-error.component.css']
})
export class CompositeControlValidationErrorComponent implements OnInit {

  // The property name of the Angular form group we want to lookup validation errors
  @Input() controlName: string;

  // The name of the form group that encompasses the individual form control that we care
  // about. We need this for Angular cross field validation.
  @Input() group: FormGroup;

  // The name of the root form group that encompasses everything. This is useful if we want
  // to validate form controls in form groups that are within form arrays and we want to use
  // form controls outside the form array.
  @Input() rootGroup: FormGroup;

  get compositeControlDetail() {
    const controlDetails = getChildCompositeControlDetail(this.control);
    return controlDetails;
  }

  get control() {
    return this.group.get(this.controlName);
  }

  get controlErrors() {
    // Get the composite control errors in addtion to this control by the name of this control, it should be prefixed a standard way.
    const control = this.control;
    const controlDetail = this.compositeControlDetail;

    // Check if this control ignores the required validation from the composite control
    const isIgnoreRequiredVal = getIsIgnoreRequiredValidation(control);

    // Recreate the composite control as is or with the required validation removed if applicable 
    const compositeControlErrorList = !controlDetail.compositeControl.errors ? [] : Object.keys(controlDetail.compositeControl.errors).map(key => ({ key, value: controlDetail.compositeControl.errors[key] }))
      .filter(f => !isIgnoreRequiredVal || f.key && f.key !== 'required');
    
    const compositeControlErrorObject = compositeControlErrorList && compositeControlErrorList.length > 0 ?
			compositeControlErrorList.reduce((acc, cur) => ({ ...acc, [cur.key]: { ...cur.value } }), {}) : {};

    return { ...compositeControlErrorObject, ...control.errors };
  }

  /**
   * Search for validation errors within the form group encompassing the specified form control.
   */
  get formGroupErrors() {
    const controlDetail = this.compositeControlDetail;

    // Sanity check
		if (!this.group || (!controlDetail.controlName || !controlDetail.controlName.trim())) { return {}; }

    // We'll start with looking for validation errors relevant to the specified form control.
    // Angular stores validation errors as an object with each property being a distinct 
    // error. So we need to convert that object into a list to make it easier to work with.
    // The array will look like something like this:
    // [{ "nameOfValidationAsKey1": { associatedControl: ['nameOfControl1', 'nameOfControl2'], message: 'validationMessage1' } }, 
    // { "nameOfValidationAsKey2": { associatedControl: 'nameOfControl2', message: 'validationMessage2' } }] 
		const groupErrorList = !this.group.errors ? [] : Object.keys(this.group.errors).map(key => ({ key, value: this.group.errors[key] }));
    
    // Now that we have a extracted all the errors off the form group as a list we'll filter so that it
    // only contains errors relevant to the specified form control.
		const errorList = groupErrorList.filter(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlDetail.controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlDetail.controlName))
      )
    );

    // If we have errors we need to convert it into a object
		const errorObject = errorList && errorList.length > 0 ?
			errorList.reduce((acc, cur) => ({ ...acc, [cur.key]: { ...cur.value } }), {}) : {};

		return errorObject;
	}

  /**
   * Search for validation errors within the root form group for the specified form control in a form group
   * which is contained within a form array.
   */
  get formArrayErrors() {
    const controlDetail = this.compositeControlDetail;

    // Using the specified form control go up one level to the form group and look up the value of the form
    // control with the following propert name "id"
    const idPropVal = controlDetail.compositeControl.parent.get('id') ? controlDetail.compositeControl.parent.get('id').value : null;
    
    // Sanity check.
    if (!this.rootGroup || !idPropVal) { return {} }

     // We'll start with looking for validation errors relevant to the specified form control.
    // Angular stores validation errors as an object with each property being a distinct 
    // error. So we need to convert that object into a list to make it easier to work with.
    // The array will look like something like this:
    // [{ "nameOfValidationAsKey1": { associatedControl: ['nameOfControl1', 'nameOfControl2'], invalidIds: [-1, -2], message: 'validationMessage1' } }, 
    // { "nameOfValidationAsKey2": { associatedControl: 'nameOfControl2', invalidIds: [-2], message: 'validationMessage2' } }]
    const groupErrorList = !this.rootGroup.errors ? [] : Object.keys(this.rootGroup.errors).map(key => ({ key, value: this.rootGroup.errors[key] }))
      .filter(f => f.value.invalidIds);

    // Now that we have a extracted all the errors off the form group as a list we'll filter so that it
    // only contains errors relevant to the specified form control.
    const errorList = groupErrorList.filter(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlDetail.controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlDetail.controlName))
      ) 
    );

    // We'll further filter down the list so that it will only contain errors by the value of our "id" that will fetched early.
    const errorListFilter = errorList.filter(f => f.value.invalidIds.some(s => s === idPropVal));

    // If we have errors we need to convert it into a object
    const errorObject = errorListFilter && errorListFilter.length > 0 ?
			errorListFilter.reduce((acc, cur) => ({ ...acc, [cur.key]: { ...cur.value } }), {}) : {};

		return errorObject;
  }
  
  /**
   * Search for validation errors within the root form group for the specified form control in a form group.
   */
  get rootFormGroupErrors() {
    const controlDetail = this.compositeControlDetail;

    const controlFormGroupName = getFormGroupName(controlDetail.compositeControl);

    // Sanity check.
    if (!this.rootGroup || !controlFormGroupName) { return {} }

    // We'll start with looking for validation errors relevant to the specified form control.
    // Angular stores validation errors as an object with each property being a distinct 
    // error. So we need to convert that object into a list to make it easier to work with.
    // The array will look like something like this:
    // [{ "nameOfValidationAsKey1": { associatedControl: ['nameOfControl1', 'nameOfControl2'], formGroupName: 'addressDetailsGroup', message: 'validationMessage1' } }, 
    // { "nameOfValidationAsKey2": { associatedControl: 'nameOfControl2', formGroupName: 'personDetailsGroup', message: 'validationMessage2' } }]
    const groupErrorList = !this.rootGroup.errors ? [] : Object.keys(this.rootGroup.errors).map(key => ({ key, value: this.rootGroup.errors[key] }))
      .filter(f => f.value.formGroupName);

    // Now that we have a extracted all the errors off the form group as a list we'll filter so that it
    // only contains errors relevant to the specified form control.
    const errorList = groupErrorList.filter(f => f && f.value.associatedControl &&
			(
        (typeof f.value.associatedControl === 'string' && f.value.associatedControl === controlDetail.controlName) ||
			  (f.value.associatedControl.constructor === Array && f.value.associatedControl.find(ac => ac === controlDetail.controlName))
      ) 
    );

    // We'll further filter down the list to only match our four group name.
    const errorListFilter = errorList.filter(f => f.value.formGroupName === controlFormGroupName);

    // If we have errors we need to convert it into a object
    const errorObject = errorListFilter && errorListFilter.length > 0 ?
			errorListFilter.reduce((acc, cur) => ({ ...acc, [cur.key]: { ...cur.value } }), {}) : {};

		return errorObject;
  }

  constructor() {}

  ngOnInit() {
    // Required inputs to use this component 
    if (!this.group) { throw Error("Form group is needed to use this component."); }
    if (!this.controlName) { throw Error("Form control name is needed to use this component"); }
  }

}