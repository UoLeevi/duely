import { ChangeEvent, FocusEvent, useMemo, useState, useCallback, useEffect } from 'react';

function useRerender() {
  const [, setCounter] = useState(0);
  return useCallback(() => setCounter((i) => i + 1), []);
}

class Binding<T> {
  #value: T;
  #paused = false;
  #pending = false;
  #callback: (value: T) => void;

  constructor(value: T, callback: (value: T) => void) {
    this.#callback = callback;
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  set value(value: T) {
    if (this.#value === value) return;
    this.#value = value;

    if (this.#paused) {
      this.#pending = true;
      return;
    }

    this.#callback(this.#value);
  }

  pause() {
    if (this.#paused) return;
    this.#paused = true;
  }

  resume() {
    if (!this.#paused) return;
    this.#paused = false;

    if (this.#pending) {
      this.#pending = false;
      this.#callback(this.#value);
    }
  }
}

class ReactiveVar<T> {
  #value: T;
  #paused = false;
  #pending = false;
  #listeners: ((value: T, variable: ReactiveVar<T>) => void)[] = [];
  #linkedVars = new Set<ReactiveVar<unknown>>();

  constructor(value: T) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  set value(value: T) {
    if (this.#value === value) return;
    this.#value = value;

    if (this.#paused) {
      this.#pending = true;
      return;
    }

    this.#listeners.forEach((callback) => callback(value, this));
  }

  subscribe(callback: (value: T, variable: ReactiveVar<T>) => void): () => void {
    this.#listeners.push(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: (value: T, variable: ReactiveVar<T>) => void): void {
    const index = this.#listeners.indexOf(callback);
    if (index === -1) return;
    this.#listeners.splice(index, 1);
  }

  pause() {
    if (this.#paused) return;
    this.#paused = true;
    this.#linkedVars.forEach((variable) => variable.pause());
  }

  resume() {
    if (!this.#paused) return;
    this.#paused = false;
    this.#linkedVars.forEach((variable) => variable.resume());

    if (this.#pending) {
      const value = this.value;
      this.#listeners.forEach((callback) => callback(value, this));
    }
  }

  static link(...vars: ReactiveVar<any>[]) {
    vars.forEach((variable) => vars.forEach(variable.#linkedVars.add, variable));
    return () => ReactiveVar.unlink(...vars);
  }

  static unlink(...vars: ReactiveVar<any>[]) {
    vars.forEach((variable) => vars.forEach(variable.#linkedVars.delete, variable));
  }
}

class ComputedVar<T, TArgs extends readonly any[]> extends ReactiveVar<T> {
  #selector: (...args: TArgs) => T;
  #args: any[];
  #detach: null | (() => void);

  constructor(
    selector: (...args: TArgs) => T,
    ...variables: {
      [i in keyof TArgs]: ReactiveVar<TArgs[i]>;
    }
  ) {
    super(selector(...(variables.map((variable) => variable.value) as unknown as TArgs)));
    this.#args = variables.map((variable) => variable.value);
    this.#selector = selector;

    const unlink = ReactiveVar.link(this, ...variables);

    const unsubscribes = variables.map((variable, i) =>
      variable.subscribe((value) => {
        this.#args[i] = value;
        this.value = this.#selector(...(this.#args as unknown as TArgs));
      })
    );

    this.#detach = () => {
      this.#detach = null;
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      unlink();
    };
  }

  detach() {
    this.#detach?.();
  }
}

export enum FormState {
  isDirty,
  isSubmitting,
  dirtyFields,
  touchedFields
}

export type FormFieldRegisterOptions = {
  required?: boolean;
};

const formFieldInfo = {
  checkbox: {
    props: {
      type: 'checkbox'
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
  select: {
    props: {}
  },
  textarea: {
    props: {}
  }
};

type FormFieldHTMLElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export class FormFieldControl<T> {
  #name: string;
  #element: FormFieldHTMLElement | undefined | null;
  #props:
    | undefined
    | {
        name: string;
        ref(el: FormFieldHTMLElement): void;
        onChange(event: ChangeEvent<FormFieldHTMLElement>): void;
        onBlur(event: FocusEvent<FormFieldHTMLElement>): void;
      };

  #updatePaused = false;
  #updatePending = false;
  #error: string | null = null;
  #isDirty = false;
  #isTouched = false;
  #valueChangedListeners: ((value: T) => void)[] = [];
  #stateChangedListeners: ((field: FormFieldControl<T>) => void)[] = [];

  options: FormFieldRegisterOptions;

  constructor(name: string, options: FormFieldRegisterOptions | undefined) {
    this.#name = name;
    this.options = options ?? {};
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
    return this.#elementControl?.type;
  }

  get value() {
    return this.#elementControl?.value;
  }

  set value(value: any) {
    if (!this.#elementControl) return;
    const convertedValue = this.#elementControl.convertValue(value);
    if (this.value === convertedValue) return;
    this.#elementControl.value = convertedValue;
    this.update();
  }

  get hasValue(): boolean {
    return this.#elementControl?.hasValue ?? false;
  }

  get defaultValue() {
    return this.#elementControl?.defaultValue;
  }

  set defaultValue(value: any) {
    if (!this.#elementControl) return;
    this.#elementControl.defaultValue = value;
  }

  get isDirty() {
    return this.#isDirty;
  }

  set isDirty(value: boolean) {
    if (this.#isDirty === value) return;
    this.#isDirty = value;
    this.update();
  }

  get isTouched() {
    return this.#isTouched;
  }

  set isTouched(value: boolean) {
    if (this.#isTouched === value) return;
    this.#isTouched = value;
    this.update();
  }

  get error() {
    return this.#error;
  }

  set error(value: string | null) {
    if (this.#error === value) return;
    this.#error = value;
    this.update();
  }

  #onChange(event: ChangeEvent<FormFieldHTMLElement>) {
    this.#pauseUpdate();
    this.isDirty = true;
    if (this.isTouched) this.validate();
    this.update();
    this.#resumeUpdate();
  }

  #onBlur(event: FocusEvent<FormFieldHTMLElement>) {
    this.#pauseUpdate();
    this.isTouched = true;
    if (this.isDirty) this.validate();
    this.#resumeUpdate();
  }

  #pauseUpdate() {
    this.#updatePaused = true;
  }

  #resumeUpdate() {
    this.#updatePaused = false;

    if (this.#updatePending) {
      this.update();
    }
  }

  #attachElement(element: FormFieldHTMLElement) {
    if (!this.#element) {
      this.#element = element;
    }
  }

  #detachElement() {
    this.#element = null;
  }

  subscribeToValueChanged(callback: (value: T) => void) {
    this.#valueChangedListeners.push(callback);
    return () => {
      const index = this.#valueChangedListeners.indexOf(callback);
      if (index === -1) return;
      this.#valueChangedListeners.splice(index, 1);
    };
  }

  subscribeToStateChanged(callback: (field: FormFieldControl<T>) => void) {
    this.#stateChangedListeners.push(callback);
    return () => {
      const index = this.#stateChangedListeners.indexOf(callback);
      if (index === -1) return;
      this.#stateChangedListeners.splice(index, 1);
    };
  }

  update() {
    if (this.#updatePaused) {
      this.#updatePending = true;
      return;
    }

    this.#updatePending = false;
    this.changeCallbacks.forEach((watcher) => watcher());
  }

  validate(): boolean {
    if (this.options.required && !this.hasValue) {
      this.error = useForm.options.errorMessages.required;
      return false;
    }

    this.error = null;
    return true;
  }

  reset() {
    this.#pauseUpdate();
    this.value = this.defaultValue;
    this.error = null;
    this.isDirty = false;
    this.isTouched = false;
    this.#resumeUpdate();
  }

  focus() {
    this.#elementControl?.focus();
  }
}

const specialFormFieldElementControlConstructors = new Map([
  ['checkbox', CheckBoxFormFieldElementControl]
]);

class FormControl<TFormFields extends Record<string, any> = Record<string, any>> {
  #isSubmitting = false;
  #element: FormFieldHTMLElement | undefined | null;
  #stateChangedListeners: ((field: FormControl<TFormFields>) => void)[] = [];
  #fields: Partial<
    {
      [TName in keyof TFormFields]: FormFieldControl<TFormFields[TName]>;
    }
  > = {};

  #getOrAddField<TName extends string & keyof TFormFields>(
    name: TName,
    options?: FormFieldRegisterOptions
  ): FormFieldControl<TFormFields[TName]> {
    let field = this.#fields[name];

    if (field === undefined) {
      field = new FormFieldControl(name, options);
      this.#fields[name] = field;
    }

    if (options) {
      field.options = options;
    }

    return field;
  }

  #subscribeToStateChanged(callback: (control: FormControl<TFormFields>) => void) {
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

  useFormState(control: FormControl<TFormFields>) {
    const rerender = useRerender();
    useEffect(() => control.#subscribeToStateChanged(rerender), []);
    return control;
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
    Object.values(this.#fields).forEach((field) => field.reset());
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

      this.#isSubmitting = true;
      await onSubmit(data, event);
      this.#isSubmitting = false;
    };
  }

  setValue<TName extends string & keyof TFormFields>(name: TName, value: TFormFields[TName]) {
    const field = this.#getOrAddField(name);
    field.value = value;
  }

  setDefaultValue<TName extends string & keyof TFormFields>(
    name: TName,
    value: TFormFields[TName]
  ) {
    const field = this.#getOrAddField(name);
    field.defaultValue = value;
    field.value = value;
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
  useFormField<TName extends string & keyof TFormFields>(
    name: TName
  ): FormFieldControl<TFormFields[TName]>;
  useFormFieldValue<TName extends string & keyof TFormFields>(name: TName): TFormFields[TName];
  useFormState(): FormState;
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
      useFormField: control.useFormFieldState.bind(control),
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

export function useFormWatch<
  TNames extends readonly ((string & keyof TFormFields) | FormState)[],
  TFormFields extends Record<string, any> = Record<string, any>
>(control: FormControl<TFormFields>, ...names: TNames) {
  return control.useFormWatch(...names);
}

useForm.options = {
  errorMessages: {
    required: 'Required',
    fallback: 'Invalid value'
  }
};
