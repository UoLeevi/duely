import { ChangeEvent, FocusEvent, useMemo, useState, useCallback, useEffect } from 'react';

function useRerender() {
  const [, setCounter] = useState(0);
  return useCallback(() => setCounter((i) => i + 1), []);
}

export type FormFieldRegisterOptions = {
  required?: boolean;
};

function defaultGetElementValue(element: FormFieldHTMLElement): any {
  return element.value;
}

function defaultSetElementValue(element: FormFieldHTMLElement, value: any) {
  if (element.value === value) return false;
  element.value = value;
  return true;
}

const formFieldInfo: Record<
  FormFieldHTMLElement['type'],
  {
    props: Record<string, any>;
    getElementValue?: (element: any) => any;
    setElementValue?: (element: any, value: any) => boolean;
  }
> = {
  checkbox: {
    props: {
      type: 'checkbox'
    },
    getElementValue: (element: HTMLInputElement) => element.checked,
    setElementValue: (element: HTMLInputElement, value: boolean) => {
      if (element.checked === value) return false;
      element.checked = value;
      return true;
    }
  },
  color: {
    props: {
      type: 'color'
    }
  },
  date: {
    props: {
      type: 'date'
    }
  },
  'datetime-local': {
    props: {
      type: 'datetime-local'
    }
  },
  email: {
    props: {
      type: 'email'
    }
  },
  file: {
    props: {
      type: 'file'
    }
  },
  month: {
    props: {
      type: 'month'
    }
  },
  number: {
    props: {
      type: 'number'
    }
  },
  password: {
    props: {
      type: 'password'
    }
  },
  radio: {
    props: {
      type: 'radio'
    }
  },
  range: {
    props: {
      type: 'range'
    }
  },
  search: {
    props: {
      type: 'search'
    }
  },
  tel: {
    props: {
      type: 'tel'
    }
  },
  text: {
    props: {
      type: 'text'
    }
  },
  time: {
    props: {
      type: 'time'
    }
  },
  url: {
    props: {
      type: 'url'
    }
  },
  week: {
    props: {
      type: 'week'
    }
  },
  'select-one': {
    props: {}
  },
  'select-multiple': {
    props: {}
  },
  textarea: {
    props: {}
  }
};

type FormFieldHTMLElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export class FormFieldControl<T> {
  #name: string;
  #form: FormControl;
  #element: FormFieldHTMLElement | undefined | null;
  #props:
    | undefined
    | {
        name: string;
        ref(el: FormFieldHTMLElement): void;
        onChange(event: ChangeEvent<FormFieldHTMLElement>): void;
        onBlur(event: FocusEvent<FormFieldHTMLElement>): void;
      };

  #value: T | undefined;
  #defaultValue: T | undefined;
  #getElementValue: ((element: FormFieldHTMLElement) => T) | undefined;
  #setElementValue: ((element: FormFieldHTMLElement, value: T) => boolean) | undefined;
  #error: string | null = null;
  #isDirty = false;
  #isTouched = false;
  #valueChanged = false;
  #valueChangedListeners: (() => void)[] = [];
  #stateChanged = false;
  #stateChangedListeners: (() => void)[] = [];
  #opCounter = 0;

  options: FormFieldRegisterOptions;

  constructor(name: string, form: FormControl, options: FormFieldRegisterOptions | undefined) {
    this.#name = name;
    this.#form = form;
    this.options = options ?? {};
  }

  get #hasValue() {
    return ![undefined, ''].includes(this.#element?.value);
  }

  get props(): {
    name: string;
    ref(el: FormFieldHTMLElement): void;
    onChange(event: ChangeEvent<FormFieldHTMLElement>): void;
    onBlur(event: FocusEvent<FormFieldHTMLElement>): void;
  } {
    if (!this.#props) {
      this.#props = {
        name: this.#name,
        // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
        ref: (element: FormFieldHTMLElement) => {
          if (element) {
            this.#attachElement(element);
          } else {
            this.#detachElement();
          }
        },
        onChange: (event: ChangeEvent<FormFieldHTMLElement>) => {
          this.#onChange(event);
        },
        onBlur: (event: FocusEvent<FormFieldHTMLElement>) => {
          this.#onBlur(event);
        }
      };
    }

    return this.#props;
  }

  get type() {
    return this.#element?.type;
  }

  get value(): T | undefined {
    if (this.#element === undefined) return undefined;

    if (this.#element !== null) {
      this.#value = this.#getElementValue!(this.#element);
    }

    return this.#value;
  }

  get defaultValue() {
    return this.#defaultValue;
  }

  get isDirty() {
    return this.#isDirty;
  }

  set isDirty(value: boolean) {
    if (this.#isDirty === value) return;
    this.#opStart();
    this.#isDirty = value;
    this.#stateChanged = true;
    this.#opEnd();
    this.#form.isDirty ||= value;
  }

  get isTouched() {
    return this.#isTouched;
  }

  set isTouched(value: boolean) {
    if (this.#isTouched === value) return;
    this.#opStart();
    this.#isTouched = value;
    this.#stateChanged = true;
    this.#opEnd();
  }

  get error() {
    return this.#error;
  }

  set error(value: string | null) {
    if (this.#error === value) return;
    this.#opStart();
    this.#error = value;
    this.#stateChanged = true;
    this.#opEnd();
  }

  #opStart() {
    ++this.#opCounter;
  }

  #opEnd() {
    if (--this.#opCounter !== 0) return;

    if (this.#valueChanged) {
      this.#valueChanged = false;
      this.#valueChangedListeners.forEach((callback) => callback());
    }

    if (this.#stateChanged) {
      this.#stateChanged = false;
      this.#stateChangedListeners.forEach((callback) => callback());
    }
  }

  #onChange(event: ChangeEvent<FormFieldHTMLElement>) {
    this.#opStart();
    this.isDirty = true;
    this.#valueChanged = true;
    if (this.isTouched) this.validate();
    this.#opEnd();
  }

  #onBlur(event: FocusEvent<FormFieldHTMLElement>) {
    this.#opStart();
    this.isTouched = true;
    if (this.isDirty) this.validate();
    this.#opEnd();
  }

  #attachElement(element: FormFieldHTMLElement) {
    if (!this.#element) {
      this.#element = element;
      this.#getElementValue = formFieldInfo[element.type].getElementValue ?? defaultGetElementValue;
      this.#setElementValue = formFieldInfo[element.type].setElementValue ?? defaultSetElementValue;
      if (this.defaultValue !== undefined) {
        this.setValue(this.defaultValue);
      }
    }
  }

  #detachElement() {
    this.#element = null;
  }

  setValue(value: T) {
    if (!this.#element) return;

    this.#opStart();
    this.#valueChanged ||= this.#setElementValue!(this.#element, value);
    this.#opEnd();
  }

  setDefaultValue(value: T) {
    this.#defaultValue = value;

    if (this.#element && this.#hasValue) {
      this.setValue(this.defaultValue!);
    }
  }

  subscribeToValueChanged(callback: () => void) {
    this.#valueChangedListeners.push(callback);
    return () => {
      const index = this.#valueChangedListeners.indexOf(callback);
      if (index === -1) return;
      this.#valueChangedListeners.splice(index, 1);
    };
  }

  subscribeToStateChanged(callback: () => void) {
    this.#stateChangedListeners.push(callback);
    return () => {
      const index = this.#stateChangedListeners.indexOf(callback);
      if (index === -1) return;
      this.#stateChangedListeners.splice(index, 1);
    };
  }

  validate(): boolean {
    this.#opStart();

    if (this.options.required && !this.#hasValue) {
      this.error = useForm.options.errorMessages.required;
      this.#opEnd();
      return false;
    }

    this.error = null;
    this.#opEnd();
    return true;
  }

  reset() {
    this.#opStart();
    this.#error = null;
    this.#isDirty = false;
    this.#isTouched = false;

    if (this.#element && this.defaultValue !== undefined) {
      this.#setElementValue!(this.#element, this.defaultValue);
    }

    this.#valueChanged = true;
    this.#stateChanged = true;
    this.#opEnd();
  }

  focus() {
    this.#element?.focus();
  }
}

class FormControl<TFormFields extends Record<string, any> = Record<string, any>> {
  #isSubmitting = false;
  #isDirty = false;
  #stateChanged = false;
  #stateChangedListeners: (() => void)[] = [];
  #opCounter = 0;
  #fields: Partial<
    {
      [TName in keyof TFormFields]: FormFieldControl<TFormFields[TName]>;
    }
  > = {};

  get isDirty() {
    return this.#isDirty;
  }

  set isDirty(value: boolean) {
    if (this.#isDirty === value) return;
    this.#opStart();
    this.#isDirty = value;
    this.#stateChanged = true;
    this.#opEnd();
  }

  get isSubmitting() {
    return this.#isSubmitting;
  }

  #opStart() {
    ++this.#opCounter;
  }

  #opEnd() {
    if (--this.#opCounter !== 0) return;

    if (this.#stateChanged) {
      this.#stateChanged = false;
      this.#stateChangedListeners.forEach((callback) => callback());
    }
  }

  #getOrAddField<TName extends string & keyof TFormFields>(
    name: TName,
    options?: FormFieldRegisterOptions
  ): FormFieldControl<TFormFields[TName]> {
    let field = this.#fields[name];

    if (field === undefined) {
      field = new FormFieldControl(name, this, options);
      this.#fields[name] = field;
    }

    if (options) {
      field.options = options;
    }

    return field;
  }

  #subscribeToStateChanged(callback: () => void) {
    this.#stateChangedListeners.push(callback);
    return () => {
      const index = this.#stateChangedListeners.indexOf(callback);
      if (index === -1) return;
      this.#stateChangedListeners.splice(index, 1);
    };
  }

  register<TName extends string & keyof TFormFields>(
    name: TName,
    options?: FormFieldRegisterOptions
  ) {
    const field = this.#getOrAddField(name, options);
    return field.props;
  }

  useFormState() {
    const rerender = useRerender();
    useEffect(() => this.#subscribeToStateChanged(rerender), []);
    return this;
  }

  useFormFieldState<TName extends string & keyof TFormFields>(name: TName) {
    const rerender = useRerender();
    const field = this.#getOrAddField(name);
    useEffect(() => field.subscribeToStateChanged(rerender), []);
    return field;
  }

  useFormFieldValue<TName extends string & keyof TFormFields>(name: TName) {
    const rerender = useRerender();
    const field = this.#getOrAddField(name);
    useEffect(() => field.subscribeToValueChanged(rerender), []);
    return field.value;
  }

  reset() {
    this.#opStart();
    Object.values(this.#fields).forEach((field) => field.reset());
    this.isDirty = false;
    this.#opEnd();
  }

  handleSubmit(
    onSubmit: (data: TFormFields, event?: React.BaseSyntheticEvent) => any | Promise<any>
  ) {
    const control = this;
    return async (event?: React.BaseSyntheticEvent) => {
      event?.preventDefault();
      const data: any = {};

      for (const [name, field] of Object.entries(control.#fields)) {
        if (!field.validate()) {
          field.focus();
          return;
        }

        data[name] = field.value;
      }

      this.#opStart();
      this.#isSubmitting = true;
      this.#stateChanged = true;
      this.#opEnd();

      await onSubmit(data, event);

      this.#opStart();
      this.#isSubmitting = false;
      this.#stateChanged = true;
      this.#opEnd();
    };
  }

  setValue<TName extends string & keyof TFormFields>(name: TName, value: TFormFields[TName]) {
    const field = this.#getOrAddField(name);
    field.setValue(value);
  }

  setDefaultValue<TName extends string & keyof TFormFields>(
    name: TName,
    value: TFormFields[TName]
  ) {
    const field = this.#getOrAddField(name);
    field.setDefaultValue(value);
  }
}

export type UseFormReturn<TFormFields extends Record<string, any> = Record<string, any>> = {
  control: FormControl<TFormFields>;
  register<TName extends string & keyof TFormFields>(
    name: TName,
    options?: FormFieldRegisterOptions
  ): {
    name: string;
    ref(el: FormFieldHTMLElement | null): void;
    onChange(event: ChangeEvent<FormFieldHTMLElement>): void;
    onBlur(event: FocusEvent<FormFieldHTMLElement>): void;
  };
  useFormFieldState<TName extends string & keyof TFormFields>(
    name: TName
  ): {
    isDirty: boolean;
    isTouched: boolean;
    error: string | null;
  };
  useFormFieldValue<TName extends string & keyof TFormFields>(
    name: TName
  ): TFormFields[TName] | undefined;
  useFormState(): {
    isDirty: boolean;
    isSubmitting: boolean;
  };
  reset(): void;
  handleSubmit(
    onSubmit: (
      data: TFormFields,
      event?: React.BaseSyntheticEvent<object, any, any> | undefined
    ) => any | Promise<any>
  ): (event?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  setValue<TName extends string & keyof TFormFields>(name: TName, value: TFormFields[TName]): void;
  setDefaultValue<TName extends string & keyof TFormFields>(
    name: TName,
    value: TFormFields[TName]
  ): void;
};

export function useForm<
  TFormFields extends Record<string, any> = Record<string, any>
>(): UseFormReturn<TFormFields> {
  const control = useState(() => new FormControl<TFormFields>())[0];
  return useMemo(
    () => ({
      control,
      register: control.register.bind(control),
      useFormFieldState: control.useFormFieldState.bind(control),
      useFormFieldValue: control.useFormFieldValue.bind(control),
      useFormState: control.useFormState.bind(control),
      reset: control.reset.bind(control),
      handleSubmit: control.handleSubmit.bind(control),
      setValue: control.setValue.bind(control),
      setDefaultValue: control.setDefaultValue.bind(control)
    }),
    []
  );
}

useForm.options = {
  errorMessages: {
    required: 'Required',
    fallback: 'Invalid value'
  }
};
