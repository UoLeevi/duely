import { ChangeEvent, FocusEvent, useMemo, useState } from 'react';
import { useRerender } from '../../../hooks';
import { useEffect } from 'react';

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

class FormWatcher<TFormFields extends Record<string, any> = Record<string, any>> {
  #control: FormControl<TFormFields>;

  #fieldSubscriptions: {
    field: FormFieldControl<string & keyof TFormFields, TFormFields>;
    value: any;
  }[];

  #formStateSubscriptions: {
    formState: FormState;
    value: any;
  }[];

  #rerender: () => void;

  constructor(
    control: FormControl<TFormFields>,
    fields: FormFieldControl<string, TFormFields>[],
    formStates: FormState[],
    rerender: () => void
  ) {
    this.#control = control;
    this.#fieldSubscriptions = fields.map((field) => ({ field, value: field.value }));
    this.#formStateSubscriptions = formStates.map((formState) => ({
      formState,
      value: JSON.stringify(this.#control.getFormState(formState))
    }));

    this.#rerender = rerender;
  }

  update() {
    let shouldRerender = false;

    for (const subscription of this.#fieldSubscriptions) {
      const value = subscription.field.value;
      if (subscription.value !== value) shouldRerender = true;
      subscription.value = value;
    }

    for (const subscription of this.#formStateSubscriptions) {
      const value = JSON.stringify(this.#control.getFormState(subscription.formState));
      if (subscription.value !== value) shouldRerender = true;
      subscription.value = value;
    }

    if (!shouldRerender) return;
    this.#rerender();
  }
}

class FormFieldControl<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> {
  #domElement?: FormFieldHTMLElement;
  #control: FormControl<TFormFields>;
  name: TName;
  props: {
    name: TName;
    ref(el: FormFieldHTMLElement): void;
    onChange(event: ChangeEvent<FormFieldHTMLElement>): void;
    onBlur(event: FocusEvent<FormFieldHTMLElement>): void;
  };
  defaultValue?: TFormFields[TName];
  isDirty: boolean;
  isTouched: boolean;
  watchers: Set<FormWatcher<TFormFields>>;

  constructor(name: TName, control: FormControl<TFormFields>) {
    this.#control = control;
    this.name = name;
    this.isDirty = false;
    this.isTouched = false;
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
    this.isDirty = true;
    this.#update();
  }

  #onBlur(event: FocusEvent<FormFieldHTMLElement>) {
    this.isTouched = true;
  }

  #update() {
    this.watchers.forEach((watcher) => watcher.update());
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
      el.checked = value ?? false;
    } else {
      el.value = value ?? '';
    }

    this.#update();
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
    name: TName
  ): FormFieldControl<TName, TFormFields> {
    let field = this.#fields.get(name) as FormFieldControl<TName, TFormFields> | undefined;

    if (field === undefined) {
      field = new FormFieldControl(name, this);
      this.#fields.set(name, field);
    }

    return field;
  }

  getFormState<TFormState extends FormState>(formState: TFormState) {
    switch (formState) {
      case FormState.isDirty:
        for (const [, field] of this.#fields.entries()) {
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

  register<TName extends string & keyof TFormFields>(name: TName) {
    const field = this.#getOrAddField(name);
    return field.props;
  }

  useWatch<TNames extends readonly ((string & keyof TFormFields) | FormState)[]>(...names: TNames) {
    const rerender = useRerender();
    const fields = names.filter(isFormFieldName).map((name) => this.#getOrAddField(name));
    const formStates = names.filter(isFormStateEnum);

    useEffect(() => {
      const watcher = new FormWatcher(this, fields, formStates, rerender) as any; // TODO: Fix typings
      formStates.forEach((formState) => this.watchers.get(formState)!.add(watcher));
      fields.forEach((field) => field.watchers.add(watcher));
      return () => {
        formStates.forEach((formState) => this.watchers.get(formState)!.delete(watcher));
        fields.forEach((field) => field.watchers.delete(watcher));
      };
    }, []);

    return names.map((name) =>
      isFormFieldName(name)
        ? this.#getOrAddField(name).value
        : isFormStateEnum(name)
        ? this.getFormState(name)
        : undefined
    );
  }

  reset() {
    this.#fields.forEach((field) => {
      field.value = field.defaultValue;
      field.isDirty = false;
      field.isTouched = false;
    });

    this.watchers.get(FormState.isDirty)!.forEach((watcher) => watcher.update());
    this.watchers.get(FormState.dirtyFields)!.forEach((watcher) => watcher.update());
    this.watchers.get(FormState.touchedFields)!.forEach((watcher) => watcher.update());
  }

  handleSubmit(
    onSubmit: (data: TFormFields, event?: React.BaseSyntheticEvent) => any | Promise<any>
  ) {
    const control = this;
    return async (event?: React.BaseSyntheticEvent) => {
      event?.preventDefault();
      console.log(event);
      const data: any = {};
      control.#fields.forEach((field, name) => {
        data[name] = field.value;
      });

      this.#isSubmitting = true;
      this.watchers.get(FormState.isSubmitting)!.forEach((watcher) => watcher.update());
      await onSubmit(data, event);
      this.#isSubmitting = false;
      this.watchers.get(FormState.isSubmitting)!.forEach((watcher) => watcher.update());
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

export type UseForm2Return<TFormFields extends Record<string, any> = Record<string, any>> = {
  control: FormControl<TFormFields>;
  register<TName extends string & keyof TFormFields>(
    name: TName
  ): {
    name: TName;
    ref(el: FormFieldHTMLElement): void;
    onChange(event: ChangeEvent<FormFieldHTMLElement>): void;
    onBlur(event: FocusEvent<FormFieldHTMLElement>): void;
  };
  useWatch<TNames extends readonly ((string & keyof TFormFields) | FormState)[]>(
    ...names: TNames
  ): any; // TODO: Fix typings
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

export function useForm2<
  TFormFields extends Record<string, any> = Record<string, any>
>(): UseForm2Return<TFormFields> {
  const control = useState(() => new FormControl<TFormFields>())[0];
  return useMemo(
    () => ({
      control,
      register: control.register.bind(control),
      useWatch: control.useWatch.bind(control),
      reset: control.reset.bind(control),
      handleSubmit: control.handleSubmit.bind(control),
      setValue: control.setValue.bind(control),
      setDefaultValue: control.setDefaultValue.bind(control)
    }),
    []
  );
}
