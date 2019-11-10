import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl, FormGroupDirective, Validators } from '@angular/forms';
import { CompositeControlErrorMatcher } from '../../form-helpers/composite-control-error-state-matcher';
import { QuestionControlService } from '../../services/question-control.service';
import { filter, tap, startWith, debounceTime } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { IDateTimeOptions, doesFormControlHaveValidator } from '../../form-helpers/reactive-form-helper';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;


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

  @Input() controlName: string;
  @Input() group: FormGroup;
  @Input() options: IDateTimeOptions;

  errorMatcher = new CompositeControlErrorMatcher();
  @ViewChild('formRef', null) formRef: FormGroupDirective;

  tempDateCtrlName: string;
  tempTimeCtrlName: string;

  isDateTimeRequired: boolean = false;
  tempDateCtrlValue$: BehaviorSubject<Date> = new BehaviorSubject(null);
  isUpdateCompositeControl: boolean = false;
  isUpdateDateFromDirective: boolean = false;

  get compositeControl() { return this.group.get(this.controlName); }
  get tempDateCtrl() { return this.group.get(this.tempDateCtrlName); }
  get tempTimeCtrl() { return this.group.get(this.tempTimeCtrlName); }

  constructor(private qcs: QuestionControlService) { }

  ngOnInit() {
    // Create a dummy form control fopr our date.
    this.tempDateCtrlName = `tempDate${this.controlName}`;
    this.group.addControl(this.tempDateCtrlName, new FormControl(''));
    this.isDateTimeRequired = doesFormControlHaveValidator(this.compositeControl, 'required');

    // Check if date needs required validation.
    if (this.isDateTimeRequired) {
        this.tempDateCtrl.setValidators(Validators.required);
      }

    if (this.options.includeTime) {
      this.tempTimeCtrlName = `tempTime${this.controlName}`;
      this.group.addControl(this.tempTimeCtrlName, new FormControl('', { updateOn: 'blur' }));

      if (this.isDateTimeRequired) {
        this.tempTimeCtrl.setValidators(Validators.required);
      }
    }

    this.qcs.isFormSubmitted$
      .pipe(
        filter(f => f),
        tap(() => {
          (this.formRef.submitted as any) = true;
        })
      ).subscribe();

    if (this.options.includeTime) {
      combineLatest(
        this.tempDateCtrlValue$,
        this.tempTimeCtrl.valueChanges.pipe(startWith(''))
      ).pipe(debounceTime(500))
      .subscribe(([tempDateCtrlValue, tempTimeCtrlValue]) => {
        this.isUpdateCompositeControl = true;

        if (!tempDateCtrlValue && !tempTimeCtrlValue) {
          this.compositeControl.setValue(null); 
          return; 
        }

        const dateTime = this.combineDateTime(tempDateCtrlValue, tempTimeCtrlValue);
        
        this.compositeControl.setValue(dateTime);
      });
    } else {
      this.tempDateCtrlValue$.subscribe(s => {
        this.isUpdateCompositeControl = true;

        if (!this.compositeControl.value && !s) { return; }

        if (!s) {
          this.compositeControl.setValue(null); 
          return; 
        }

        const date = moment(this.getDateString(s), 'DD/MM/YYYY').toDate(); 
        this.compositeControl.setValue(date);
      });
    }

    this.compositeControl.valueChanges.subscribe(s => {
        if (this.isUpdateCompositeControl) { 
          this.isUpdateCompositeControl = false;
          return;
        }

        if (!s) {
          this.tempDateCtrl.setValue(null, { emitEvent: false });

          if (this.options.includeTime) {
            this.tempTimeCtrl.setValue(null, { emitEvent: false });
          }
          
          return;
        }

        const date = moment(this.getDateString(s), 'DD/MM/YYYY').toDate();
        
        this.tempDateCtrl.setValue(date, { emitEvent: false });

        if (this.options.includeTime) {
          const timeString = this.getTimeString(s);
          this.tempTimeCtrl.setValue(timeString, { emitEvent: false });
        }
      });

    this.compositeControl.statusChanges.subscribe(s => {
      const disabled = 'DISABLED';
      const valid = 'VALID';

      if (s === disabled && !this.tempDateCtrl.disabled) {
        this.tempDateCtrl.disable({ emitEvent: false });
        this.tempTimeCtrl.disable({ emitEvent: false });
      }

      if (s === valid && this.tempDateCtrl.disabled) {
        this.tempDateCtrl.enable({ emitEvent: false });
        this.tempTimeCtrl.enable({ emitEvent: false });
      }
    });
  }

  getDateString(dateValue: Date) {
    const dateString = moment(dateValue).isValid() ? 
        moment(dateValue, 'DD/MM/YYYY').format('DD/MM/YYYY').toString() : '01/01/0001';
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

      if (!this.isUpdateDateFromDirective) {
        this.tempTimeCtrl.setValue(threeDigitTimeValue, { emitEvent: false });
      }

      this.isUpdateDateFromDirective = false;
      return threeDigitTimeValue;
		}

    const timeString = moment(timeValue, 'HH:mm').isValid() ? 
        moment(timeValue, 'HH:mm').format('HH:mm').toString() : null;

    if (!this.isUpdateDateFromDirective) {
      this.tempTimeCtrl.setValue(timeString, { emitEvent: false });
    }
    
    this.isUpdateDateFromDirective = false;
    return timeString;
  }

  combineDateTime(dateValue: Date, timeValue: string) {
    const dateString = this.getDateString(dateValue);
    const timeString = this.getTimeString(timeValue);
    const dateTime = moment(`${dateString} ${timeString}`, 'DD/MM/YYYY HH:mm');

    return dateTime;
  }

  tempDateChange(event: MatDatepickerInputEvent<Date>) {
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

}