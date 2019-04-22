import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formErrorMessage'
})
export class FormErrorMessagePipe implements PipeTransform {
  
  transform(errorKey: string, control: any): any {
    return this.getErrorMessage(errorKey, control);
  }

  getErrorMessage(errorKey: string, control: any): string {
    const errorObj = control;
    let errorMessage = '';

    switch (errorKey) {
      case 'required': 
        errorMessage = 'This is required';
        break;
      case 'email':
        errorMessage = 'This email is invalid';
        break;
      case 'minlength':
        errorMessage = `You must enter a minimum of ${errorObj.requiredLength} characters. You have entered ${errorObj.actualLength}.`;
        break;
      case 'matDatepickerParse':
        errorMessage = 'Invalid date format';
        break;
      default:
        errorMessage = !!errorObj && typeof errorObj === 'object' && errorObj.message 
        ? errorObj.message : 'Invalid error';
    }

    return errorMessage;
  }

}