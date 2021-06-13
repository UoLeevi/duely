import { useEffect } from 'react';
import { useRerender } from './hooks/useRerender';
import { FormFieldControl, FormFieldRegisterOptions } from './FormFieldControl';

export class FormControl<TFormFields extends Record<string, any> = Record<string, any>> {
  #isSubmitting = false;
  #isDirty = false;
  #valueChanged = false;
  #valueChangedListeners: (() => void)[] = [];
  #stateChanged = false;
  #stateChangedListeners: (() => void)[] = [];
  #updateCounter = 0;
  #defaultValues: Partial<TFormFields>;
  #fields: Partial<
    {
      [TName in keyof TFormFields]: FormFieldControl<TFormFields[TName]>;
    }
  > = {};

  constructor(options?: { defaultValues?: Partial<TFormFields> }) {
    this.#defaultValues = options?.defaultValues ?? {};
  }

  get value(): Partial<TFormFields> {
    return Object.fromEntries(
      Object.entries(this.#fields).map(([name, field]) => [name, field.value])
    ) as any;
  }

  get isDirty() {
    return this.#isDirty;
  }

  set isDirty(value: boolean) {
    if (this.#isDirty === value) return;
    this.startUpdate();
    this.#isDirty = value;
    this.#stateChanged = true;
    this.endUpdate();
  }

  get isSubmitting() {
    return this.#isSubmitting;
  }

  startUpdate() {
    ++this.#updateCounter;
  }

  endUpdate() {
    if (--this.#updateCounter !== 0) return;

    if (this.#valueChanged) {
      this.#valueChanged = false;
      this.#valueChangedListeners.forEach((callback) => callback());
    }

    if (this.#stateChanged) {
      this.#stateChanged = false;
      this.#stateChangedListeners.forEach((callback) => callback());
    }
  }

  #getOrAddField<TName extends string & keyof TFormFields>(
    name: TName,
    options?: FormFieldRegisterOptions<TFormFields[TName]>
  ): FormFieldControl<TFormFields[TName]> {
    let field = this.#fields[name];
    const defaultValue = this.#defaultValues[name];

    if (options && options.defaultValue === undefined && defaultValue !== undefined) {
      options.defaultValue = defaultValue!;
    }

    if (field === undefined) {
      field = new FormFieldControl(name, this);
      this.#fields[name] = field;
      field.subscribeToValueChanged(() => {
        this.startUpdate();
        this.#valueChanged = true;
        this.endUpdate();
      });
    }

    if (options) {
      field.options = options;
    }

    return field;
  }

  #subscribeToValueChanged(callback: () => void) {
    this.#valueChangedListeners.push(callback);
    return () => {
      const index = this.#valueChangedListeners.indexOf(callback);
      if (index === -1) return;
      this.#valueChangedListeners.splice(index, 1);
    };
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
    options?: FormFieldRegisterOptions<TFormFields[TName]>
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

  useFormValue() {
    const rerender = useRerender();
    useEffect(() => this.#subscribeToValueChanged(rerender), []);
    return this.value;
  }

  reset(defaultValues?: Partial<TFormFields>) {
    this.startUpdate();

    if (defaultValues) {
      this.#defaultValues = defaultValues;
    }

    Object.entries(this.#fields).forEach(([name, field]) => field.reset(defaultValues?.[name]));
    this.isDirty = false;
    this.endUpdate();
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

      this.startUpdate();
      this.#isSubmitting = true;
      this.#stateChanged = true;
      this.endUpdate();

      await onSubmit(data, event);

      this.startUpdate();
      this.#isSubmitting = false;
      this.#stateChanged = true;
      this.endUpdate();
    };
  }

  setValue<TName extends string & keyof TFormFields>(name: TName, value: TFormFields[TName] | undefined) {
    const field = this.#getOrAddField(name);
    field.setValue(value);
  }

  setDefaultValue<TName extends string & keyof TFormFields>(
    name: TName,
    value: TFormFields[TName] | undefined
  ) {
    const field = this.#getOrAddField(name);
    field.setDefaultValue(value);
  }
}
