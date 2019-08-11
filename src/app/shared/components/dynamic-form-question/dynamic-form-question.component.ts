import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { QuestionBase } from '../../base/question-base';
import { QuestionControlService } from '../../services/question-control.service';
import { CrossFieldErrorMatcher } from '../../customErrorStateMatcher/custom-error-matcher';

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css']
})
export class DynamicFormQuestionComponent implements OnInit {

  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() rootForm: FormGroup;

  errorMatcher = new CrossFieldErrorMatcher();

  @ViewChild('formRef', null) formRef: FormGroupDirective;

  constructor(private qcs: QuestionControlService) { }

  ngOnInit() {
    this.qcs.isFormSubmitted$
      .pipe(
        filter(f => f),
        tap(() => {
          (this.formRef.submitted as any) = true;
        })
      ).subscribe();
  }

}