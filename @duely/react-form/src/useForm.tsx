import { ChangeEvent, FocusEvent, useMemo, useState, useCallback, useEffect } from 'react';

function useRerender() {
  const [, setCounter] = useState(0);
  return useCallback(() => setCounter((i) => i + 1), []);
}

// see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
// see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
// see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
export type FormFieldHTMLElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | null;

export enum FormState {
  isDirty,
  isSubmitting,
  dirtyFields,
  touchedFields
}

export type FormFieldRegisterOptions = {
  required?: boolean;
};

function isCheckBoxElement(el: NonNullable<FormFieldHTMLElement>): el is HTMLInputElement {
  return el.type === 'checkbox';
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

export class FormFieldControl<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> {
  #domElement?: FormFieldHTMLElement;
  #control: FormControl<TFormFields>;
  #updatePaused: boolean;
  #updatePending: boolean;
  #error: string | null;
  #isDirty: boolean;
  #isTouched: boolean;
  name: TName;
  props: {
    name: TName;
    ref(el: FormFieldHTMLElement): void;
    onChange(event: ChangeEvent<FormFieldHTMLElement>): void;
    onBlur(event: FocusEvent<FormFieldHTMLElement>): void;
  };
  options: FormFieldRegisterOptions;
  defaultValue?: TFormFields[TName];
  watchers: Set<FormWatcher>;

  constructor(name: TName, control: FormControl<TFormFields>, options?: FormFieldRegisterOptions) {
    this.#control = control;
    this.name = name;
    this.options = options ?? {};
    this.#updatePaused = false;
    this.#updatePending = false;
    this.#error = null;
    this.#isDirty = false;
    this.#isTouched = false;
    this.watchers = new Set();
    this.props = {
      name: this.name,
      // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      ref: (el: FormFieldHTMLElement) => {
        if (el) {
          this.#attachElement(el);
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

  #attachElement(el: NonNullable<FormFieldHTMLElement>) {
    this.#domElement = el;
    this.value = this.defaultValue;
  }

  #detachElement() {
    this.#domElement = null;
  }

  #onChange(event: ChangeEvent<FormFieldHTMLElement>) {
    this.#pauseUpdate();
    this.isDirty = true;
    if (this.isTouched) this.validate();
    this.#update();
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

  get value() {
    const el = this.#domElement;
    if (!el) return undefined;
    return (isCheckBoxElement(el) ? el.checked : el.value) as TFormFields[TName]; // TODO: Fix typings
  }

  set value(value: TFormFields[TName] | undefined) {
    const el = this.#domElement;
    if (!el) return;

    if (isCheckBoxElement(el)) {
      const newValue = value ?? false;
      if (el.checked === value) return;
      el.checked = newValue;
      this.#update();
    } else {
      const newValue = value ?? '';
      if (el.value === value) return;
      el.value = newValue;
      this.#update();
    }
  }

  get hasValue() {
    return ![undefined, ''].includes(this.value);
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
