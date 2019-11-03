import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl, FormGroupDirective } from '@angular/forms';
import { CrossFieldErrorMatcher } from '../../form-helpers/custom-error-state-matcher';
import { QuestionControlService } from '../../services/question-control.service';
import { filter, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
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

  tempDateCtrlName: string;
  tempTimeCtrlName: string;

  errorMatcher = new CrossFieldErrorMatcher();

  @ViewChild('formRef', null) formRef: FormGroupDirective;

  get compositeControl() {
    return this.group.get(this.controlName);
  }

  get tempDateCtrl() {
    return this.group.get(this.tempDateCtrlName);
  }

  get tempTimeCtrl() {
    return this.group.get(this.tempTimeCtrlName);
  }

  constructor(private qcs: QuestionControlService) { }

  ngOnInit() {
    this.tempDateCtrlName = `tempDate${this.controlName}`;
    this.tempTimeCtrlName = `tempTime${this.controlName}`;

    this.group.addControl(this.tempDateCtrlName, new FormControl(''));
    this.group.addControl(this.tempTimeCtrlName, new FormControl(''));

    this.qcs.isFormSubmitted$
      .pipe(
        filter(f => f),
        tap(() => {
          (this.formRef.submitted as any) = true;
        })
      ).subscribe();

    combineLatest(
      this.tempDateCtrl.valueChanges,
      this.tempTimeCtrl.valueChanges
    ).subscribe(([tempDateCtrlValue, tempTimeCtrlValue]) => {
      this.compositeControl.setValue(tempDateCtrlValue.toString() + tempTimeCtrlValue);
    });
  }

}