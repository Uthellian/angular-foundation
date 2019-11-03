import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl, FormGroupDirective } from '@angular/forms';
import { CrossFieldErrorMatcher } from '../../form-helpers/custom-error-state-matcher';
import { QuestionControlService } from '../../services/question-control.service';
import { filter, tap } from 'rxjs/operators';

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
          console.log('testsdfdsf');
          (this.formRef.submitted as any) = true;
        })
      ).subscribe();
  }

}