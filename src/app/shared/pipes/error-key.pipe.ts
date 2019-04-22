import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'errorKey'
})
export class ErrorKeyPipe implements PipeTransform {
  
  transform(errors: ValidationErrors): any {
    return errors ? Object.keys(errors) : [];
  }
  
}