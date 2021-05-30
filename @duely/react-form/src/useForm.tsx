import { ChangeEvent, FocusEvent, useMemo, useState, useCallback, useEffect } from 'react';

function useRerender() {
  const [, setCounter] = useState(0);
  return useCallback(() => setCounter((i) => i + 1), []);
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

function isCheckBoxElement(el: any): el is HTMLInputElement {
  return el.type === 'checkbox';
}

function isFileInputElement(el: any): el is HTMLInputElement {
  return el.type === 'file';
}

function isFormStateEnum<TFormFields extends Record<string, any> = Record<string, any>>(
  value: (string & keyof TFormFields) | FormState
): value is FormState {
  return typeof value === 'number';
}

function isFormFieldName<TFormFields extends Record<string, any> = Record<string, any>>(
  value: (string & keyof TFormFields) | FormState
): value is string & keyof TFormFields {
  return typeof value === 'string';
}

type FormWatcher = () => void;

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

type HTMLFormFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

class FormFieldElementControl<THTMLElement extends HTMLFormFieldElement = HTMLFormFieldElement, TValue = string, TRawValue = TValue> {
  #element: THTMLElement | undefined | null;
  #defaultValue: TValue = '' as unknown as TValue;

  constructor(element: THTMLElement) {
    this.#element = element;
  }

  get element() {
    return this.#element;
  }

  get type() {
    return this.#element?.type;
  }

  get value() {
    if (!this.element) return undefined;
    return this.element.value as unknown as TValue;
  }

  set value(value: TValue | undefined) {
    if (!this.element) return;
    this.element.value = value as unknown as string ?? this.defaultValue;
  }

  get hasValue() {
    return ![undefined, ''].includes(this.element?.value);
  }

  get defaultValue() {
    return this.#defaultValue;
  }

  set defaultValue(value: TValue) {
    this.#defaultValue = value;
  }

  attachElement(element: THTMLElement) {
    this.#element = element;
    this.value = this.defaultValue;
  }

  detachElement() {
    this.#element = null;
  }

  focus() {
    this.#element?.focus();
  }

  convertValue(value: TRawValue): TValue {
    return value as unknown as TValue;
  }
}

export class CheckBoxFormFieldElementControl extends FormFieldElementControl<HTMLInputElement, boolean> {
  #defaultValue = false;

  get value() {
    return this.element?.checked;
  }

  set value(value) {
    if (!this.element) return;
    this.element.checked = value ?? this.defaultValue;;
  }

  get defaultValue() {
    return this.#defaultValue;
  }

  set defaultValue(value: boolean) {
    this.#defaultValue = value;
  }
}

class FormFieldControl<THTMLElement extends HTMLFormFieldElement = HTMLFormFieldElement, TGetValue = string> {
  #name: string;
  #elementControl: undefined | FormFieldElementControl;
  #props:
    | undefined
    | {
        name: string;
        ref(el: THTMLElement): void;
        onChange(event: ChangeEvent<THTMLElement>): void;
        onBlur(event: FocusEvent<THTMLElement>): void;
      };

  #updatePaused = false;
  #updatePending = false;
  #error: string | null = null;
  #isDirty = false;
  #isTouched = false;

  options: FormFieldRegisterOptions;
  watchers: Set<FormWatcher>;

  constructor(name: string, options: FormFieldRegisterOptions | undefined) {
    this.#name = name;

    this.options = options ?? {};
    this.watchers = new Set();
  }

  get props(): {
    name: string;
    ref(el: THTMLElement): void;
    onChange(event: ChangeEvent<THTMLElement>): void;
    onBlur(event: FocusEvent<THTMLElement>): void;
  } {
    if (!this.#props) {
      this.#props = {
        name: this.#name,
        // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
        ref: (element: THTMLElement) => {
          if (element) {
            this.#attachElement(element);
          } else {
            this.#detachElement();
          }
        },
        onChange: (event: ChangeEvent<THTMLElement>) => {
          this.#onChange(event);
        },
        onBlur: (event: FocusEvent<THTMLElement>) => {
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

  #onChange(event: ChangeEvent<THTMLElement>) {
    this.#pauseUpdate();
    this.isDirty = true;
    if (this.isTouched) this.validate();
    this.update();
    this.#resumeUpdate();
  }

  #onBlur(event: FocusEvent<THTMLElement>) {
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

  #attachElement(element: HTMLFormFieldElement) {
    if (!this.#elementControl) {
      const ctor = specialFormFieldElementControlConstructors.get(element.type) as any ?? FormFieldElementControl;
      this.#elementControl = new ctor(element);
    } else {
      this.#elementControl.attachElement(element);
    }
  }

  #detachElement() {
    this.#elementControl?.detachElement();
  }

  update() {
    if (this.#updatePaused) {
      this.#updatePending = true;
      return;
    }

    this.#updatePending = false;
    this.watchers.forEach((watcher) => watcher());
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

class FormControl<
  TFormFields extends Record<string, keyof typeof specialFormFieldElementControlConstructors> = Record<
    string,
    keyof typeof specialFormFieldElementControlConstructors
  >
> {
  #isSubmitting: boolean;
  #fields: Map<keyof TFormFields, FormFieldControl>;
  watchers: Map<FormState, Set<FormWatcher>>;

  constructor() {
    this.#isSubmitting = false;
    this.#fields = new Map();
    this.watchers = new Map();

    for (const formState of Object.values(FormState)) {
      this.watchers.set(formState as number, new Set());
    }
  }

  #getOrAddField<TName extends string & keyof TFormFields>(
    name: TName,
    type: TFormFields[TName],
    options?: FormFieldRegisterOptions
  ): FormFieldTypes[TFormFields[TName]] {
    let field = this.#fields.get(name) as FormFieldTypes[TFormFields[TName]] | undefined;

    if (field === undefined) {
      field = new specialFormFieldElementControlConstructors[type](name, options) as FormFieldTypes[TFormFields[TName]];
      this.#fields.set(name, field);
    }

    if (options) {
      field.options = options;
    }

    return field;
  }

  getFormState<TFormState extends FormState>(formState: TFormState) {
    switch (formState) {
      case FormState.isDirty:
        for (const field of this.#fields.values()) {
          if (field.isDirty) return true;
        }

        return false;

      case FormState.dirtyFields:
        const dirtyFields: (string & keyof TFormFields)[] = [];

        for (const [name, field] of this.#fields.entries()) {
          if (field.isDirty) return dirtyFields.push(name);
        }

        return dirtyFields;

      case FormState.touchedFields:
        const touchedFields: (string & keyof TFormFields)[] = [];

        for (const [name, field] of this.#fields.entries()) {
          if (field.isTouched) return touchedFields.push(name);
        }

        return touchedFields;

      case FormState.isSubmitting:
        return this.#isSubmitting;

      default:
        return undefined;
    }
  }

  register<TName extends string & keyof TFormFields>(
    name: TName,
    options?: FormFieldRegisterOptions
  ) {
    const field = this.#getOrAddField(name, options);
    return field.props;
  }

  useFormWatch<TNames extends readonly ((string & keyof TFormFields) | FormState)[]>(
    ...names: TNames
  ) {
    const rerender = useRerender();
    const fields = names.filter(isFormFieldName).map((name) => this.#getOrAddField(name));
    const formStates = names.filter(isFormStateEnum);

    useEffect(() => {
      formStates.forEach((formState) => this.watchers.get(formState)!.add(rerender));
      fields.forEach((field) => field.watchers.add(rerender));
      return () => {
        formStates.forEach((formState) => this.watchers.get(formState)!.delete(rerender));
        fields.forEach((field) => field.watchers.delete(rerender));
      };
    }, []);

    return names.map((name) =>
      isFormFieldName(name)
        ? this.#getOrAddField(name)
        : isFormStateEnum(name)
        ? this.getFormState(name)
        : undefined
    );
  }

  reset() {
    this.#fields.forEach((field) => field.reset());

    this.watchers.get(FormState.isDirty)!.forEach((watcher) => watcher());
    this.watchers.get(FormState.dirtyFields)!.forEach((watcher) => watcher());
    this.watchers.get(FormState.touchedFields)!.forEach((watcher) => watcher());
  }

  handleSubmit(
    onSubmit: (data: TFormFields, event?: React.BaseSyntheticEvent) => any | Promise<any>
  ) {
    const control = this;
    return async (event?: React.BaseSyntheticEvent) => {
      event?.preventDefault();
      const data: any = {};

      for (const [name, field] of control.#fields.entries()) {
        if (!field.validate()) {
          field.focus();
          return;
        }

        data[name] = field.value;
      }

      this.#isSubmitting = true;
      this.watchers.get(FormState.isSubmitting)!.forEach((watcher) => watcher());
      await onSubmit(data, event);
      this.#isSubmitting = false;
      this.watchers.get(FormState.isSubmitting)!.forEach((watcher) => watcher());
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
    name: TName;
    ref(el: FormFieldHTMLElement): void;
    onChange(event: ChangeEvent<FormFieldHTMLElement>): void;
    onBlur(event: FocusEvent<FormFieldHTMLElement>): void;
  };
  useFormWatch<TNames extends readonly ((string & keyof TFormFields) | FormState)[]>(
    ...names: TNames
  ): (
    | number
    | boolean
    | FormFieldControl<string & keyof TFormFields, TFormFields>
    | (string & keyof TFormFields)[]
    | undefined
  )[];
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
      useFormWatch: control.useFormWatch.bind(control),
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
