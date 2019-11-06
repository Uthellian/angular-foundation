import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl, FormGroupDirective, Validators } from '@angular/forms';
import { CrossFieldErrorMatcher } from '../../form-helpers/custom-error-state-matcher';
import { QuestionControlService } from '../../services/question-control.service';
import { filter, tap, startWith, debounceTime } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { IDateTimeOptions, doesFormControlHaveValidator } from '../../form-helpers/reactive-form-helper';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-date-time-form-control',
  templateUrl: './date-time-form-control.component.html',
  styleUrls: ['./date-time-form-control.component.css']
})
export class DateTimeFormControlComponent implements OnInit {

  @Input() controlName: string;
  @Input() group: FormGroup;
  @Input() options: IDateTimeOptions;

  errorMatcher = new CrossFieldErrorMatcher();
  @ViewChild('formRef', null) formRef: FormGroupDirective;

  tempDateCtrlName: string;
  tempTimeCtrlName: string;

  tempDateCtrlValue$: BehaviorSubject<Date> = new BehaviorSubject(null);

  get compositeControl() { return this.group.get(this.controlName); }
  get tempDateCtrl() { return this.group.get(this.tempDateCtrlName); }
  get tempTimeCtrl() { return this.group.get(this.tempTimeCtrlName); }

  constructor(private qcs: QuestionControlService) { }

  ngOnInit() {
    this.tempDateCtrlName = `tempDate${this.controlName}`;
    this.group.addControl(this.tempDateCtrlName, new FormControl(''));
    const isDateRequired = doesFormControlHaveValidator(this.compositeControl, 'required');

    if (isDateRequired) {
        this.tempDateCtrl.setValidators(Validators.required);
      }

    if (this.options.includeTime) {
      this.tempTimeCtrlName = `tempTime${this.controlName}`;
      this.group.addControl(this.tempTimeCtrlName, new FormControl('', { updateOn: 'blur' }));

      const isTimeRequired = doesFormControlHaveValidator(this.compositeControl, 'required');
      
      if (isTimeRequired) {
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

    combineLatest(
      this.tempDateCtrlValue$,
      this.tempTimeCtrl.valueChanges.pipe(startWith(''))
    ).pipe(debounceTime(500))
    .subscribe(([tempDateCtrlValue, tempTimeCtrlValue]) => {
      if (!tempDateCtrlValue && !tempTimeCtrlValue) {
        this.compositeControl.setValue(null); 
        return; 
      }

      const dateTime = this.combineDateTime(tempDateCtrlValue, tempTimeCtrlValue);
      
      this.compositeControl.setValue(dateTime);
    });

    this.compositeControl.valueChanges.subscribe(s => {


      this.tempDateCtrl.setValue(s, { emitEvent: false });
      this.tempTimeCtrl.setValue(s, { emitEvent: false });
    });
  }

  combineDateTime(dateValue: Date, timeValue: string) {
    const dateString = moment(dateValue).isValid() ? 
        moment(dateValue, 'DD/MM/YYYY').format('DD/MM/YYYY').toString() : '01/01/0001';
      
      const timeString = moment(timeValue, 'HH:mm').isValid() ? 
        moment(timeValue, 'HH:mm').format('HH:mm').toString() : '00:00';

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

}