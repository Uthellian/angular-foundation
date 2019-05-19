export class QuestionBase<T> {
  value: T;
  key: string
  label: string;
  order: number;
  controlType: string;

  constructor(
    options: {
      value?: T,
      key?: string,
      label?: string,
      order?: number,
      controlType?: string
    } = {}
  ) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.order = options.order ? options.order : null;
      this.controlType = options.controlType || '';
  }
}