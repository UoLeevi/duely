import { ChangeEvent, FocusEvent, useMemo, useState, useCallback, useEffect } from 'react';

function useRerender() {
  const [, setCounter] = useState(0);
  return useCallback(() => setCounter((i) => i + 1), []);
}

type FormFieldTypes = {
  // standard input types
  // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input

  // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
  checkbox: {
    elementType: HTMLInputElement;
    valueType: boolean;
    attributes: {
      type: 'checkbox';
    };
  };
  color: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'color';
    };
  };
  date: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'date';
    };
  };
  'datetime-local': {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'datetime-local';
    };
  };
  email: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'email';
    };
  };

  // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
  file: {
    elementType: HTMLInputElement;
    valueType: FileList;
    attributes: {
      type: 'file';
    };
  };
  month: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'month';
    };
  };
  number: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'number';
    };
  };
  password: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'password';
    };
  };
  radio: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'radio';
    };
  };
  range: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'range';
    };
  };
  search: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'search';
    };
  };
  tel: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'tel';
    };
  };
  text: {
    // default
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'text';
    };
  };
  time: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'time';
    };
  };
  url: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'url';
    };
  };
  week: {
    elementType: HTMLInputElement;
    valueType: string;
    attributes: {
      type: 'week';
    };
  };

  // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  select: {
    elementType: HTMLSelectElement;
    valueType: string;
    attributes: {};
  };

  // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
  textarea: {
    elementType: HTMLTextAreaElement;
    valueType: string;
    attributes: {};
  };
};

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

export class FormFieldControl<TType extends keyof FormFieldTypes = 'text'> {
  #type: TType;
  #domElement: FormFieldTypes[TType]['elementType'] | undefined | null;
  #updatePaused: boolean;
  #updatePending: boolean;
  #error: string | null;
  #isDirty: boolean;
  #isTouched: boolean;
  props: FormFieldTypes[TType]['attributes'] & {
    name: string;
    ref(el: FormFieldTypes[TType]['elementType']): void;
    onChange(event: ChangeEvent<FormFieldTypes[TType]['elementType']>): void;
    onBlur(event: FocusEvent<FormFieldTypes[TType]['elementType']>): void;
  };
  options: FormFieldRegisterOptions;
  defaultValue?: FormFieldTypes[TType]['valueType'];
  watchers: Set<FormWatcher>;

  constructor(name: string, type: TType, options?: FormFieldRegisterOptions) {
    this.#type = type;
    this.#updatePaused = false;
    this.#updatePending = false;
    this.#error = null;
    this.#isDirty = false;
    this.#isTouched = false;
    this.options = options ?? {};
    this.watchers = new Set();
    this.props = {
      name,
      type,
      // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      ref: (el: FormFieldTypes[TType]['elementType']) => {
        if (el) {
          this.#attachElement(el);
        } else {
          this.#detachElement();
        }
      },
      onChange: (event: ChangeEvent<FormFieldTypes[TType]['elementType']>) => {
        this.#onChange(event);
      },
      onBlur: (event: FocusEvent<FormFieldTypes[TType]['elementType']>) => {
        this.#onBlur(event);
      }
    };
  }

  #isCheckBox(): this is FormFieldControl<'checkbox'> {
    return this.#type === 'checkbox';
  }

  #isFileInput(): this is FormFieldControl<'file'> {
    return this.#type === 'file';
  }

  #attachElement(el: FormFieldTypes[TType]['elementType']) {
    this.#domElement = el;
    this.value = this.defaultValue;
  }

  #detachElement() {
    this.#domElement = null;
  }

  #onChange(event: ChangeEvent<FormFieldTypes[TType]['elementType']>) {
    this.#pauseUpdate();
    this.isDirty = true;
    if (this.isTouched) this.validate();
    this.#update();
    this.#resumeUpdate();
  }

  #onBlur(event: FocusEvent<FormFieldTypes[TType]['elementType']>) {
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
      this.#update();
    }
  }

  #update() {
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
    this.#domElement?.focus();
  }

  get isDirty() {
    return this.#isDirty;
  }

  set isDirty(value: boolean) {
    if (this.#isDirty === value) return;
    this.#isDirty = value;
    this.#update();
  }

  get isTouched() {
    return this.#isTouched;
  }

  set isTouched(value: boolean) {
    if (this.#isTouched === value) return;
    this.#isTouched = value;
    this.#update();
  }

  get error() {
    return this.#error;
  }

  set error(value: string | null) {
    if (this.#error === value) return;
    this.#error = value;
    this.#update();
  }

  get value(): FormFieldTypes[TType]['valueType'] | undefined {
    const el = this.#domElement;
    if (!el) return undefined;
    return isCheckBoxElement(el) ? el.checked : el.value
  }

  set value(value: FormFieldTypes[TType]['valueType'] | undefined) {
    if (!this.#domElement) return;

    if (this.#isCheckBox()) {
      const newValue = value ?? false;
      if (this.#domElement.checked === value) return;
      this.#domElement.checked = newValue as boolean;
      this.#update();
      return;
    }

    if (this.#isFileInput()) {
      // TODO
    }

    const newValue = value ?? '';
    if (this.#domElement.value === value) return;
    this.#domElement.value = newValue as string;
    this.#update();
  }

  get hasValue() {
    return this.#domElement && this.#domElement.value !== '';
  }
}

class FormControl<TFormFields extends Record<string, any> = Record<string, any>> {
  #isSubmitting: boolean;
  #fields: Map<
    string & keyof TFormFields,
    FormFieldControl<string & keyof TFormFields, TFormFields>
  >;
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
    options?: FormFieldRegisterOptions
  ): FormFieldControl<TName, TFormFields> {
    let field = this.#fields.get(name) as FormFieldControl<TName, TFormFields> | undefined;

    if (field === undefined) {
      field = new FormFieldControl(name, this, options);
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
