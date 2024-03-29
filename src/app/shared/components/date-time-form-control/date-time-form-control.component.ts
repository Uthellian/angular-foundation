import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl, FormGroupDirective, Validators, ValidatorFn, FormBuilder } from '@angular/forms';
import { CompositeControlErrorMatcher } from '../../form-helpers/composite-control-error-state-matcher';
import { QuestionControlService } from '../../services/question-control.service';
import { filter, tap, startWith, debounceTime } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { IDateTimeOptions, doesFormControlHaveValidator, getIsGroupContainChildComposite } from '../../form-helpers/reactive-form-helper';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

/**
 * Common date / time component that has been created to try and make devs lives easier by:
 *  1. Handling both date and "optionally" time without requiring devs to explicilty create
 *     up to two form controls and the plumbling that goes with it. 
 *  2. Common component so that if a wide spread change is required it only needs to be made in one spot.
 *  3. Common date / time validation built in.
 *  4. Has current date and time keyboard shortcut "n".
 *  5. Has blur workout around for FormControl "updateOn blur bug" see https://github.com/angular/components/issues/16461 
 *     Although blur workaround currently does not work with "n" shortcut 
 */
@Component({
  selector: 'app-date-time-form-control',
  templateUrl: './date-time-form-control.component.html',
  styleUrls: ['./date-time-form-control.component.css']/*,
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]*/
})
export class DateTimeFormControlComponent implements OnInit {

  /** Composite control name */
  @Input() controlName: string;

  /** Composite control form group */
  @Input() group: FormGroup;

  /** Date / time component options */
  @Input() options: IDateTimeOptions = {
    includeTime: false,
    dateLabel: '',
    timeLabel: ''
  };

  @Input() parentFormRef: FormGroupDirective;

  /** Override angular validation. */
  errorMatcher;

  /** We need this to participate in angular validation when form is submitted. */
  @ViewChild('formRef', null) formRef: FormGroupDirective;

  /** Name of dummy date form control name. */
  tempDateCtrlName: string = 'date';

  /** Name of dummy time form control name. */
  tempTimeCtrlName: string = 'time';

  /** Does the composite control have required validation */
  isDateTimeRequired: boolean = false;
  
  /** For date and time only if the user fills either one than both form controls needs required validation. */
  isTempCtrlRequired: boolean = false;

  /** 
   * Behaviour subject to hold the value of the date control when the user blurs away from it. 
   * We can't use the form control and set it's "updateOn to blur" because it doesn't work see 
   * https://github.com/angular/components/issues/16461
   */
  tempDateCtrlValue$: BehaviorSubject<Date> = new BehaviorSubject(null);
  
  /** 
   * We're trying to do two way binding between dummy controls and real control so we need this 
   * to prevent infinite loops.
   */
  isUpdateCompositeControl: boolean = false;

  /** 
   * If the user decides to fill in today's date in the dummy date control with the "n" shortcut key
   * we need this to prevent the time from participating as well. 
   */
  isUpdateDateFromDirective: boolean = false;

  tempFormGroup: FormGroup;

  get compositeControl() { return this.group.get(this.controlName); }
  get tempDateCtrl() { return this.tempFormGroup.get(this.tempDateCtrlName); }
  get tempTimeCtrl() { return this.tempFormGroup.get(this.tempTimeCtrlName); }

  constructor(
    private qcs: QuestionControlService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.isDateTimeRequired = doesFormControlHaveValidator(this.compositeControl, 'required');

    this.tempFormGroup = this.options.includeTime ? 
      this.fb.group({
        date: this.isDateTimeRequired ? [null, [Validators.required]] : [null, []],
        time: this.isDateTimeRequired ? [null, { validators: [Validators.required, this.invalidTimeValidator()], updateOn: 'blur' }] : [null, { validators: [this.invalidTimeValidator()], updateOn: 'blur' }]
      }) : 
      this.fb.group({
        date: this.isDateTimeRequired ? [null, [Validators.required]] : [null, []]
      });

    this.errorMatcher = new CompositeControlErrorMatcher(this.controlName, this.group);

    const compositeControlValue = this.compositeControl.value;

		// Populate our dummy controls with the initial composite control value
		if (compositeControlValue) {
			const date = moment(this.getDateString(compositeControlValue), 'DD/MM/YYYY').toDate();

			this.tempDateCtrl.setValue(date, { emitEvent: false });
			this.tempDateCtrlValue$.next(date);

			if (this.options.includeTime) {
				const timeString = this.getTimeString(compositeControlValue);
				this.tempTimeCtrl.setValue(timeString, { emitEvent: false });
			}
		}

    /** 
     * When the form is submitted display validations where applicable for 
     * any controls that havn't been touched.
     */
    this.qcs.isFormSubmitted$
      .pipe(
        filter(f => f),
        tap(() => {
          /** 
           * If we have a parent form reference we'll only programmatically trigger a form submit if the parent 
           * has been as well.
           */ 
          if (!!this.parentFormRef && !this.parentFormRef.submitted) { return; }
          (this.formRef.submitted as any) = true;
        })
      ).subscribe();

    /** Code to keep our composite control value up to date based on our dummy controls. */
    if (this.options.includeTime) {
      
      // Keep composite control up to date based on date and time control.
      combineLatest(
        [this.tempDateCtrlValue$,
        this.tempTimeCtrl.valueChanges]
      ).pipe(debounceTime(500))
      .subscribe(([tempDateCtrlValue, ignoredTimeCtrlValue]) => {
        const tempTimeCtrlValue = this.tempTimeCtrl.value;

        // We need required validation for our dummy controls if either one is filled in. 
        this.isTempCtrlRequired = !!tempDateCtrlValue || !!tempTimeCtrlValue; 

        /** 
         * If the user has entered something in full we'll do nothing but
         * if they partially entered something like "1" we'll turn it into "01:00".
         */  
        if (tempTimeCtrlValue) {
          const timeString = this.getTimeString(tempTimeCtrlValue);
          this.tempTimeCtrl.setValue(timeString, { emitEvent: false });
        }

        this.isUpdateCompositeControl = true;

        // Do nothing if both our dummy and composite control don't have any value.
        if (!tempDateCtrlValue || !tempTimeCtrlValue) {
          if (this.compositeControl.value) {
            //this.compositeControl.setValue(null);
            this.setCompositeControlValue(null);
          } else {
            this.isUpdateCompositeControl = false;
          }
          return; 
        }

        const dateTime = this.getCombineDateTime(tempDateCtrlValue, tempTimeCtrlValue);
        
        //this.compositeControl.setValue(dateTime);
        this.setCompositeControlValue(dateTime);
      });
    } else {

      // Keep composite control up to date based on date control.
      this.tempDateCtrlValue$.subscribe(s => {
        this.isUpdateCompositeControl = true;

        if (!this.compositeControl.value && !s) { return; }

        // Do nothing if both the dummy and composite date don't have any value
        if (!s) {
          //this.compositeControl.setValue(null);
          this.setCompositeControlValue(null); 
          return; 
        }

        const date = moment(this.getDateString(s), 'DD/MM/YYYY').toDate(); 
        //this.compositeControl.setValue(date);
        this.setCompositeControlValue(date);
      });
    }

    /**
     * When there are changes to our composite control we want to keep our
     * dummy controls up to date.
     */
    this.compositeControl.valueChanges.subscribe(s => {
        /**  
         * We don't want to update our dummy controls when the composite control
         * was just updated from it.
         */ 
        if (this.isUpdateCompositeControl) { 
          this.isUpdateCompositeControl = false;
          return;
        }

        // Clear out our dummy controls if it doesn't have any value.
        if (!s) {
          /** 
           * If the composite control or it's form group has been reset then we want to do the same 
           * for our dummy controls because we want to be in sync by removing all values as well as resetting
           * validations.
           */
          const isTempDateUiInteracted = !this.tempDateCtrl.pristine || !this.tempDateCtrl.untouched;
          const isTempTimeUiInteracted = !this.tempTimeCtrl.pristine || !this.tempTimeCtrl.untouched;

          if (this.compositeControl.pristine && (isTempDateUiInteracted || isTempTimeUiInteracted)) {
            this.tempDateCtrl.reset(null, { emitEvent: false });

            if (this.options.includeTime) {
              this.tempTimeCtrl.reset(null, { emitEvent: false });
            }

            return;
          }
          
          this.tempDateCtrl.setValue(null, { emitEvent: false });

          if (this.options.includeTime) {
            this.tempTimeCtrl.setValue(null, { emitEvent: false });
          }

          return;
        }

        const date = moment(this.getDateString(s), 'DD/MM/YYYY').toDate();
        
        this.tempDateCtrl.setValue(date, { emitEvent: false });
        this.tempDateCtrlValue$.next(date);

        if (this.options.includeTime) {
          const timeString = this.getTimeString(s);
          this.tempTimeCtrl.setValue(timeString, { emitEvent: false });
        }
      });

    /** Code to keep our dummy controls in sync with the composite control disable state. */
    this.compositeControl.statusChanges.subscribe(s => {
      const disabled = 'DISABLED';

      if (s === disabled && !this.tempDateCtrl.disabled) {
        this.tempDateCtrl.disable({ emitEvent: false });

        if (this.options.includeTime) {
          this.tempTimeCtrl.disable({ emitEvent: false });
        }
      }
      
      if (s !== disabled && this.tempDateCtrl.disabled) {
        this.tempDateCtrl.enable({ emitEvent: false });

        if (this.options.includeTime) {
          this.tempTimeCtrl.enable({ emitEvent: false });
        }
      }
    });
  }

  getDateString(dateValue: Date) {
    const dateString = moment(dateValue).isValid() ? 
        moment(dateValue, 'YYYY-MM-DD').format('DD/MM/YYYY').toString() : '01/01/0001';
    return dateString;
  }

  getTimeString(timeValue: any) {
    // For 3 digit input, follow the rules as listed in the DDD
		if (timeValue.length === 3 && moment(timeValue, 'H:mm').isValid()) {
      const threeDigitTime = moment(timeValue, 'HH:mm');

			const hour = timeValue.charAt(0); // The hour is the first character in a 3 digit input
			const minutes = timeValue.substring(1); // The minutes is the 2nd and 3rd characters in a 3 digit input
			threeDigitTime.hour(hour).minutes(minutes); // Alter the time object

      const threeDigitTimeValue = threeDigitTime.format('HH:mm').toString();

      return threeDigitTimeValue;
		}

    const timeString = moment(timeValue, 'HH:mm').isValid() ? 
        moment(timeValue, 'HH:mm').format('HH:mm').toString() : timeValue;
    
    this.isUpdateDateFromDirective = false;
    return timeString;
  }

  getCombineDateTime(dateValue: Date, timeValue: string) {
    const dateString = this.getDateString(dateValue);
    const timeString = this.getTimeString(timeValue);
    const dateTime = moment(`${dateString} ${timeString}`, 'DD/MM/YYYY HH:mm').toDate();

    return dateTime;
  }

  tempDateChangeFromBlur(event: MatDatepickerInputEvent<Date>) {
    if (!this.tempDateCtrl.valid) { 
      this.tempDateCtrlValue$.next(null);
      return; 
    }

    const tempDateValue = event.value;
    this.tempDateCtrlValue$.next(tempDateValue);
  }

  tempDateChangeFromDirective(event: Date) {
    this.isUpdateDateFromDirective = true;

    if (!this.tempDateCtrl.valid) { 
      this.tempDateCtrlValue$.next(null);
      return; 
    }

    const tempDateValue = event;
    this.tempDateCtrlValue$.next(tempDateValue);
  }

  setCompositeControlValue(dateTime: Date) {
		const compositeControlValue = this.compositeControl.value;
		let compositeControlMoment = null;
		let dateTimeValueMoment = null;

		if (!dateTime && !compositeControlValue) { return; }
		if ((!dateTime && compositeControlValue) || (dateTime && !compositeControlValue)) {
			this.compositeControl.setValue(dateTime);

      /**
       * Our dummy control was updated through the UI so we need to programmatically do the same for
       * our composite control.
       */
      this.compositeControl.markAsDirty();
			return;
		}

		if (!this.options.includeTime) {
			compositeControlMoment = moment(this.getDateString(compositeControlValue), 'DD/MM/YYYY');
			dateTimeValueMoment = moment(this.getDateString(dateTime), 'DD/MM/YYYY');
		} else {
			compositeControlMoment = moment(compositeControlValue, 'DD/MM/YYYY HH:mm');
			dateTimeValueMoment = moment(dateTime, 'DD/MM/YYYY HH:mm');
		}

		if (!compositeControlMoment.isSame(dateTimeValueMoment)) {
			this.compositeControl.setValue(dateTime);

      /**
       * Our dummy control was updated through the UI so we need to programmatically do the same for
       * our composite control.
       */
      this.compositeControl.markAsDirty();
		}
	}

  /** Our date and time dummy controls will have required validation if either one is filled out. */
  dateTimeRequiredValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    // Our composite control has required validation so no need to proceed because our dummy controls will have it as well
    if (this.isDateTimeRequired || !this.options.includeTime) { return null; }

    const tempDateCtrl = formGroup.get(this.tempDateCtrlName);
    const tempTimeCtrl = formGroup.get(this.tempTimeCtrlName);

    if (!tempDateCtrl || !tempTimeCtrl) { return null; }

    const tempDateCtrlValue = tempDateCtrl.value;
    const tempTimeCtrlValue = tempTimeCtrl.value;

    let invalidControl = "";

    if (!!tempDateCtrlValue && !tempTimeCtrlValue) {
      invalidControl = this.tempTimeCtrlName;
    }

    if (!tempDateCtrlValue && !!tempTimeCtrlValue) {
      invalidControl = this.tempDateCtrlName;
    }

    return !invalidControl ? null :  { 'required': { associatedControl: invalidControl, message: 'This is required.' } }
  };

  /** Check if the entered time is valid 24 hour time. */
  invalidTimeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;

      if (!value) { return null; }

      const momentTime = moment(value, 'HH:mm');

      return !momentTime.isValid() ? { 'invalidTime': { message: 'Time entered is invalid it must be HH:mm' } } : null;
    }
  }

  /** Validation for the min and max date values in sql server */
	isDateValidWithMinimumAndMaximum(dateControlName: string): ValidatorFn {
		const validatorFunction = (control: FormControl) => {
			const date = !control ? null : control.value;

			// Sanity
			if (!date) {
				return null;
			}

			const sqlServerMinDate = moment('1753/01/01', 'YYYY/MM/DD').toDate();
			const isDateAfterMinDate = moment(date).isSameOrAfter(moment(sqlServerMinDate));

			// If date is before the min date
			if (!isDateAfterMinDate) {
				return {
					dateBeforeSqlServerMinDate: {
						associatedControl: dateControlName,
						message: 'The entered date cannot be before 01/01/1753'
					}
				};
			}

			const sqlServerMaxDate = moment('9999/12/31', 'YYYY/MM/DD').toDate();
			const isDateBeforeMaxDate = moment(date).isSameOrBefore(moment(sqlServerMaxDate));

			// If date is after the max date
			if (!isDateBeforeMaxDate) {

				// Angular material datepicker usually prevents this from happening
				return {
					dateAfterSqlServerMaxDate: {
						associatedControl: dateControlName,
						message: 'The entered date cannot be after 31/12/9999'
					}
				};
			}

			return null;
		};

		return validatorFunction;
	}

}