import { Component, OnInit, Input } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl } from '@angular/forms';
import { CrossFieldErrorMatcher } from '../../form-helpers/custom-error-state-matcher';

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

  constructor() { }

  ngOnInit() {
    this.tempDateCtrlName = `tempDate${this.controlName}`;
    this.tempTimeCtrlName = `tempTime${this.controlName}`;

    this.group.addControl(this.tempDateCtrlName, new FormControl(''));
    this.group.addControl(this.tempTimeCtrlName, new FormControl(''));
  }

}