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

export type FormFieldControl = TextFormField | PasswordFormField | CheckBoxFormField;

class FormFieldBase<THTMLElement extends HTMLElement> {
  #name: string;
  #props:
    | undefined
    | (Partial<React.HTMLAttributes<THTMLElement>> & {
        name: string;
        ref(el: THTMLElement): void;
        onChange(event: ChangeEvent<THTMLElement>): void;
        onBlur(event: FocusEvent<THTMLElement>): void;
      });
  #updatePaused = false;
  #updatePending = false;
  #error: string | null = null;
  #isDirty = false;
  #isTouched = false;

  element: THTMLElement | undefined | null;
  options: FormFieldRegisterOptions;
  watchers: Set<FormWatcher>;

  constructor(name: string, options: FormFieldRegisterOptions | undefined) {
    if (new.target === FormFieldBase) {
      throw new TypeError('Cannot construct FormFieldBase instances directly');
    }

    this.#name = name;

    this.options = options ?? {};
    this.watchers = new Set();
  }

  get props(): Partial<React.HTMLAttributes<THTMLElement>> & {
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
        },
        ...this.createProps()
      };
    }

    return this.#props;
  }

  get type(): string {
    throw new Error('Abstract method should be implemented by subclass');
  }

  get value() {
    throw new Error('Abstract method should be implemented by subclass');
  }

  set value(value: any) {
    throw new Error('Abstract method should be implemented by subclass');
  }

  get hasValue(): boolean {
    throw new Error('Abstract method should be implemented by subclass');
  }

  get defaultValue() {
    throw new Error('Abstract method should be implemented by subclass');
  }

  set defaultValue(value: any) {
    throw new Error('Abstract method should be implemented by subclass');
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

  #attachElement(element: THTMLElement | null) {
    this.element = element;
    this.value = this.defaultValue;
  }

  #detachElement() {
    this.element = null;
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
    this.element?.focus();
  }

  createProps(): object {
    throw new Error('Abstract method should be implemented by subclass');
  }
}

export class TextFormField extends FormFieldBase<HTMLInputElement> {
  #defaultValue = '';

  constructor(name: string, options?: FormFieldRegisterOptions) {
    super(name, options);
  }

  get type() {
    return 'text';
  }

  get value() {
    return this.element?.value;
  }

  set value(value: string | undefined) {
    if (!this.element) return;
    if (this.element.value === value) return;
    this.element.value = value ?? '';
    this.update();
  }

  get hasValue() {
    return ![undefined, ''].includes(this.element?.value);
  }

  get defaultValue() {
    return this.#defaultValue;
  }

  set defaultValue(value: string) {
    this.#defaultValue = value;
  }

  createProps() {
    return {
      type: this.type,
      defaultValue: this.defaultValue
    };
  }
}

export class PasswordFormField extends TextFormField {
  constructor(name: string, options?: FormFieldRegisterOptions) {
    super(name, options);
  }

  get type() {
    return 'password';
  }
}

export class CheckBoxFormField extends FormFieldBase<HTMLInputElement> {
  #defaultValue = false;

  constructor(name: string, options?: FormFieldRegisterOptions) {
    super(name, options);
  }

  get type() {
    return 'checkbox';
  }

  get value() {
    return this.element?.checked;
  }

  set value(value: boolean | undefined) {
    if (!this.element) return;
    if (this.element.checked === value) return;
    this.element.checked = value ?? false;
    this.update();
  }

  get hasValue() {
    return ![undefined, ''].includes(this.element?.value);
  }

  get defaultValue() {
    return this.#defaultValue;
  }

  set defaultValue(value: boolean) {
    this.#defaultValue = value;
  }

  createProps() {
    return {
      type: 'checkbox',
      defaultChecked: this.defaultValue
    };
  }
}

const formFieldConstructors = {
  // standard input types
  // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input

  // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
  checkbox: CheckBoxFormField,
  // color: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'color';
  //   };
  // };
  // date: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'date';
  //   };
  // };
  // 'datetime-local': {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'datetime-local';
  //   };
  // };
  // email: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'email';
  //   };
  // };

  // // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
  // file: {
  //   elementType: HTMLInputElement;
  //   valueType: FileList;
  //   attributes: {
  //     type: 'file';
  //   };
  // };
  // month: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'month';
  //   };
  // };
  // number: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'number';
  //   };
  // };
  password: PasswordFormField,
  // radio: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'radio';
  //   };
  // };
  // range: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'range';
  //   };
  // };
  // search: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'search';
  //   };
  // };
  // tel: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'tel';
  //   };
  // };
  text: TextFormField
  // time: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'time';
  //   };
  // };
  // url: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'url';
  //   };
  // };
  // week: {
  //   elementType: HTMLInputElement;
  //   valueType: string;
  //   attributes: {
  //     type: 'week';
  //   };
  // };

  // // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  // select: {
  //   elementType: HTMLSelectElement;
  //   valueType: string;
  //   attributes: {};
  // };

  // // see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
  // textarea: {
  //   elementType: HTMLTextAreaElement;
  //   valueType: string;
  //   attributes: {};
  // };
};

export type FormFieldTypes = {
  [TypeKey in keyof typeof formFieldConstructors]: InstanceType<
    typeof formFieldConstructors[TypeKey]
  >;
};

class FormControl<
  TFormFields extends Record<string, keyof typeof formFieldConstructors> = Record<
    string,
    keyof typeof formFieldConstructors
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
      field = new formFieldConstructors[type](name, options) as FormFieldTypes[TFormFields[TName]];
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
