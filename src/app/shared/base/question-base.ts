export class QuestionBase<T> {
  value: T;
  key: string
  placeholder: string;
  order: number;
  controlType: string;

  constructor(
    options: {
      value?: T,
      key?: string,
      placeholder?: string,
      order?: number,
      controlType?: string
    } = {}
  ) {
      this.value = options.value;
      this.key = options.key || '';
      this.placeholder = options.placeholder || '';
      this.order = options.order ? options.order : null;
      this.controlType = options.controlType || '';
  }
}