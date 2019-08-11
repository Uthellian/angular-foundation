import { FormGroup, AbstractControl } from '@angular/forms';

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

