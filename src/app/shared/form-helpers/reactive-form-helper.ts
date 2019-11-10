import { FormGroup, AbstractControl } from '@angular/forms';

export interface ICompositeControlDetail {
  isChildOfComposite: boolean;
  compositeControl: AbstractControl;
  controlName: string;
}

export interface IDateTimeOptions {
  includeTime: boolean;
  dateLabel: string;
  timeLabel: string;
}

/** Hard coded whitelist of child contol names derived from composite control. */
export const childCompositeControlNames = ['tempDate', 'tempTime'];

/** Hard coded whitelist of child contol names that ignore required validation from derived composite control. */
export const ignoreRequiredChildControlNames = ['tempTime'];

/** 
 * Does the form control have the specified validator by name. Please note
 * that this currently only works with standard angular validators. For
 * example "Validators.required". The name for that validator will be "required".
 */
export function doesFormControlHaveValidator(control: AbstractControl, nameOfValidator: string) {
  if (!control.validator) { return false; }
  const controlValidator = control.validator({} as AbstractControl);
  return !!controlValidator && !!controlValidator[nameOfValidator];
}

export function getIsIgnoreRequiredValidation(control: AbstractControl) {
  let isIgnored = false;
  let controlName = getControlName(control);

  for (let i = 0; i < ignoreRequiredChildControlNames.length; i++) {
      if (controlName.includes(ignoreRequiredChildControlNames[i])) {
        isIgnored = true;
        break;
      }
    }

  return isIgnored;
}

export function getChildCompositeControlDetail(control: AbstractControl): ICompositeControlDetail {
    let isChildOfComposite = false;
    let controlName = getControlName(control);

    for (let i = 0; i < childCompositeControlNames.length; i++) {
      if (controlName.includes(childCompositeControlNames[i])) {
        controlName = controlName.substring(childCompositeControlNames[i].length);
        isChildOfComposite = true;
        break;
      }
    }

    const compositeControl = isChildOfComposite ? control.parent.get(controlName) : null;

    return {
      isChildOfComposite,
      compositeControl,
      controlName
    }
}

/**
 * Get the name of the form group.
 * @param control - Angular form control
 */
export function getFormGroupName(control: AbstractControl) {
  const parentGroup = <FormGroup>control.parent.parent;

  if (!parentGroup) {
    return null;
  }

  let name: string;

  Object.keys(parentGroup.controls).forEach(key => {
    const childGroup = parentGroup.get(key);

    if (childGroup !== control.parent) {
      return;
    }

    name = key;
  });

  return name;
}

/**
 * Get the name of the form control.
 * @param control - Angular form control
 */
export function getControlName(control: AbstractControl): string | null {
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

