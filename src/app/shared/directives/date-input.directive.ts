import { Directive, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { FormControl } from '@angular/forms';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

/**
 * 	Directive to prevent users from entering a value other than
 * 	Numbers and a forward slash ('/').
 */
@Directive({
  selector: '[dateInput]'
})
export class DateInputDirective {

  constructor(
		private element: ElementRef
	) { }

	@Input() dateInput: FormControl = null;
  @Input() compositeControl: FormControl = null;
  @Output() onDirectiveValueChanged = new EventEmitter<any>();

	@HostListener('keydown', ['$event']) onKeyDown(event: any) {
		this.onlyAllowNumericInputsOnKeyDown(event);
	}

	@HostListener('paste', ['$event']) onPaste(event: any) {
		this.preventNonNumericInputsOnPaste(event);
	}

	/** Prevents non numeric inputs on key press */
	private onlyAllowNumericInputsOnKeyDown(event: any) {
		if (!event || !event.key) {
			return;
		}

		// Allow backspaces or deletes
		if (event.key === 'Backspace' || event.key === 'Delete') {
			return;
		}

		// Allow tabs and Enters
		if (event.key === 'Tab' || event.key === 'Enter') {
			return;
		}

		// Allow left, right, home, end
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
			event.key === 'Home' || event.key === 'End') {
			return;
		}

		// Allow: Ctrl+A
		if ((event.keyCode === 65 && event.ctrlKey === true) ||
			// Allow: Ctrl+C
			(event.keyCode === 67 && event.ctrlKey === true) ||
			// Allow: Ctrl+V
			(event.keyCode === 86 && event.ctrlKey === true) ||
			// Allow: Ctrl+X
			(event.keyCode === 88 && event.ctrlKey === true) ) {
				return;
		}

		// Pressing 'n' should set the date to today
		// This only supports reactive forms
		if (event.key.toLowerCase() === 'n') {
			event.preventDefault();

			if (!this.dateInput) {
				return;
			}
			const today = moment(new Date(), 'DD/MM/YYYY').startOf('day').toDate();

			this.dateInput.setValue(today);

      if (this.compositeControl) {
        //this.compositeControl.setValue(today);
      }

      this.onDirectiveValueChanged.emit(today);

			return;

		}

		// Prevent keypress if non-numeric character
		if (!this.isDateInput(event.key)) {
			event.preventDefault();
		}
	}

	/** Prevents non numeric inputs on Paste */
	private preventNonNumericInputsOnPaste(event: any) {
		if (!event.clipboardData) {
			return;
		}

		const pasteData = (event.clipboardData).getData('text');
		if (!this.isDateInput(pasteData)) {
			event.preventDefault();
		}
	}

	/** Checks an input if it is numeric */
	private isDateInput(input: any) {
		const regExNumChars = '^[0-9/]*$';
		const regEx = new RegExp(regExNumChars);
		if (!regEx.test(input)) {
			return false;
		}
		return true;
	}

}