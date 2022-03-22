import { hasProperty, identity } from '@duely/util';
import { FormControl } from './FormControl';

const globalOptions = {
  errorMessages: {
    required: 'Required',
    fallback: 'Invalid value'
  }
};

export type FormFieldRawValueGet =
  | undefined
  | {
      value: string;
      valueAsNumber?: number;
      valueAsDate?: Date | null;
      files?: FileList | null;
      checked?: boolean;
    };

export type FormFieldRawValueSet =
  | undefined
  | null
  | string
  | boolean
  | number
  | Date
  | {
      value: string;
    }
  | {
      valueAsNumber: number;
    }
  | {
      valueAsDate: Date | null;
    }
  | {
      files: FileList | null;
    }
  | {
      checked: boolean;
    };

export type ValueConverter<T> = {
  get: (value: FormFieldRawValueGet) => T | undefined;
  set: (value: T | undefined | null) => FormFieldRawValueSet;
};

export type FormFieldRegisterOptions<T> = {
  ref?: React.MutableRefObject<FormFieldHTMLElement | undefined>;
  required?: boolean;
  defaultValue?: T;
  rules?: ((value: FormFieldRawValueGet, element: FormFieldHTMLElement) => string | undefined)[];
  inputFilter?: RegExp;
  valueConverter?: ValueConverter<T>;
};

type SetValueOptions = {
  preventValidate?: boolean;
};

const setValueDefaultOptions: SetValueOptions = {
  preventValidate: false
};

export const formFieldInfo: Record<
  FormFieldHTMLElement['type'],
  {
    props: Record<string, any>;
    shouldValidateOnChange?: boolean;
  }
> = {
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
    },
    shouldValidateOnChange: true
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
    },
    shouldValidateOnChange: true
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
    props: {},
    shouldValidateOnChange: true
  },
  'select-multiple': {
    props: {},
    shouldValidateOnChange: true
  },
  textarea: {
    props: {}
  }
};

const buttonElementTypes = ['button', 'submit', 'reset', 'menu', 'image'];

const elementTypesWhichShouldValidateOnChange = Object.entries(formFieldInfo)
  .filter(([, info]) => info.shouldValidateOnChange)
  .map(([type]) => type);

export type FormFieldHTMLElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement;

export class FormFieldControl<T> {
  #name: string;
  #type?: string;
  #form: FormControl;
  #element: FormFieldHTMLElement | undefined;
  #nodeList: RadioNodeList | undefined;
  #props:
    | undefined
    | {
        name: string;
        ref(el: FormFieldHTMLElement | null): void;
      };

  #value: T | undefined;
  #defaultValue: T | undefined;
  #error: string | null = null;
  #isDirty = false;
  #isTouched = false;
  #valueChanged = false;
  #valueChangedListeners: (() => void)[] = [];
  #stateChanged = false;
  #stateChangedListeners: (() => void)[] = [];
  #updateCounter = 0;
  #options: FormFieldRegisterOptions<T>;
  #refCount = 0;

  constructor(name: string, form: FormControl) {
    this.#name = name;
    this.#form = form;
    this.#options = {};
  }

  get #hasValue() {
    if (this.#getElementRawValue()?.value === '') return false;
    return true;
  }

  get #shouldValidateOnChange() {
    return this.#element && elementTypesWhichShouldValidateOnChange.includes(this.#element.type);
  }

  get #shouldValidate() {
    return this.#isTouched || this.#shouldValidateOnChange;
  }

  get props(): {
    name: string;
    ref(el: FormFieldHTMLElement | null): void;
  } {
    if (!this.#props) {
      this.#props = {
        name: this.#name,
        // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
        ref: (element: FormFieldHTMLElement | null) => {
          if (element) {
            this.#attachElement(element);
          } else {
            this.#detachElement();
          }
        }
      };
    }

    return this.#props;
  }

  get type() {
    if (!this.#type) {
      this.#type = this.#element?.type;
    }

    return this.#type;
  }

  get value(): T | undefined {
    if (this.type === 'radio' ? this.#nodeList : this.#element) {
      this.#value = this.#getElementValue();
    }

    return this.#value;
  }

  get defaultValue() {
    return this.#defaultValue;
  }

  get options() {
    return this.#options;
  }

  set options(value: FormFieldRegisterOptions<T>) {
    if (this.#options === value) return;
    this.startUpdate();

    if (value.defaultValue !== undefined) {
      this.setDefaultValue(value.defaultValue);
    }

    this.#options = value;
    this.endUpdate();
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
    this.#form.isDirty ||= value;
  }

  get isTouched() {
    return this.#isTouched;
  }

  set isTouched(value: boolean) {
    if (this.#isTouched === value) return;
    this.startUpdate();
    this.#isTouched = value;
    this.#stateChanged = true;
    this.endUpdate();
  }

  get error() {
    return this.#error;
  }

  set error(value: string | null) {
    if (this.#error === value) return;
    this.startUpdate();
    this.#error = value;
    this.#stateChanged = true;
    this.endUpdate();
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

  #onClick(event: MouseEvent) {
    const element = event.currentTarget as FormFieldHTMLElement;
    this.setValue(element.value as any);
  }

  #onBeforeInput(event: InputEvent) {
    if (this.#options.inputFilter && event.data) {
      if (event.data.match(this.#options.inputFilter)?.[0].length !== event.data.length) {
        event.preventDefault();
      }
    }
  }

  #onInput(event: InputEvent) {
    this.startUpdate();
    this.isDirty = true;
    this.#valueChanged = true;
    if (this.#shouldValidateOnChange) this.validate();
    this.endUpdate();
  }

  #onBlur(event: FocusEvent) {
    this.startUpdate();
    this.isTouched = true;
    if (this.isDirty) {
      const focusedElement = event.relatedTarget as HTMLElement | null;
      const fieldContainer = this.#element?.closest(
        '[data-formfield="' + encodeURIComponent(this.#name) + '"]'
      );

      if (fieldContainer?.contains(focusedElement)) {
        const self = this;
        function delayedBlur() {
          focusedElement?.removeEventListener('blur', delayedBlur);
          self.startUpdate();
          self.validate();
          self.endUpdate();
        }
        focusedElement?.addEventListener('blur', delayedBlur);
      } else {
        this.startUpdate();
        this.validate();
        this.endUpdate();
      }
    }
    this.endUpdate();
  }

  #attachElement(element: FormFieldHTMLElement) {
    this.startUpdate();
    ++this.#refCount;
    this.#element = element;

    if (this.#options.ref) {
      this.#options.ref.current = element;
    }

    if (element.type === 'radio') {
      const control = element.form?.elements[this.#name as keyof HTMLFormControlsCollection];
      if (!control) return undefined;
      this.#nodeList = control as unknown as RadioNodeList;
    }

    // I encountered issues with react's SynteticEvents not firing in some cases.
    // For example if radio button was programatically changed and afterwards manually clicked (checked),
    // the onChange event would not be fired. There is no such issue with native DOM events.

    if (buttonElementTypes.includes(element.type)) {
      element.addEventListener('click', (event) => this.#onClick(event as MouseEvent));
    } else {
      element.addEventListener('beforeinput', (event) => this.#onBeforeInput(event as InputEvent));
      element.addEventListener('input', (event) => this.#onInput(event as InputEvent));
      element.addEventListener('blur', (event) => this.#onBlur(event as FocusEvent));
    }

    if (this.defaultValue !== undefined) {
      this.setValue(this.defaultValue);
    }

    if (this.value !== undefined) {
      if (this.defaultValue === undefined) {
        this.#defaultValue = this.value;
      }

      this.#valueChanged = true;
    }

    this.endUpdate();
  }

  #detachElement() {
    // TODO: make unregistration conditional on FormFieldRegisterOptions
    if (--this.#refCount === 0) {
      if (this.#element) {
        this.#value = this.#getElementValue();
      }

      if (this.#options.ref) {
        this.#options.ref = undefined;
      }

      this.#form.unregister(this.#name);
      this.#element = undefined;
      this.#nodeList = undefined;
    }
  }

  #getElementRawValue(): FormFieldRawValueGet {
    return this.#nodeList ?? this.#element;
  }

  #getElementValue(): T | undefined {
    const rawValue = this.#getElementRawValue();
    if (this.#options.valueConverter?.get) {
      return this.#options.valueConverter.get(rawValue);
    }

    if (rawValue?.value === '') return undefined;

    switch (this.type) {
      case 'checkbox':
        return rawValue?.checked as T | undefined;

      case 'file':
        return rawValue?.files as T | undefined;

      case 'datetime-local':
        return rawValue?.valueAsDate as T | undefined;

      case 'date':
        return rawValue?.valueAsDate as T | undefined;

      default:
        return rawValue?.value as T | undefined;
    }
  }

  #clearElementValue(): boolean {
    if (this.type === 'radio') {
      if (!this.#nodeList) return false;
      const input = Array.from(this.#nodeList!)
        .map((n) => n as HTMLInputElement)
        .find((n) => n.checked);
      if (!input) return false;
      input.checked = false;
      return true;
    } else {
      if (!this.#element) return false;
      if (this.#element.value === '') return false;
      this.#element.value = '';
      return true;
    }
  }

  #setElementValue(value: T | undefined | null): boolean {
    const convertValue = this.#options.valueConverter?.set ?? identity;
    let rawValue: FormFieldRawValueSet = convertValue(value) as FormFieldRawValueSet;

    if (rawValue == null) {
      return this.#clearElementValue();
    }

    if (this.type === 'radio') {
      if (this.#nodeList === undefined) {
        throw new Error('Cannot set element value for form field that is detached.');
      }

      const value = hasProperty(rawValue, 'value') ? rawValue.value : rawValue.toString();
      if (this.#nodeList.value === value) return false;
      this.#nodeList.value = value;
      return true;
    } else {
      if (!this.#element) {
        throw new Error('Cannot set element value for form field that is detached.');
      }

      switch (typeof rawValue) {
        case 'string': {
          if (this.#element.value === rawValue) return false;
          this.#element.value = rawValue;
          return true;
        }

        case 'number': {
          if (this.#element.value === rawValue.toString()) return false;
          this.#element.value = rawValue.toString();
          return true;
        }

        case 'boolean': {
          if (this.#element instanceof HTMLInputElement) {
            if (this.#element.checked === rawValue) return false;
            this.#element.checked = rawValue;
            return true;
          } else {
            throw new Error('Cannot set element checked value of non-input element.');
          }
        }

        default: {
          if (hasProperty(rawValue, 'value')) {
            if (this.#element.value === rawValue.value) return false;
            this.#element.value = rawValue.value;
            return true;
          } else if (this.#element instanceof HTMLInputElement) {
            if (rawValue instanceof Date) {
              if (this.#element.valueAsDate === rawValue) return false;
              this.#element.valueAsDate = rawValue;
              return true;
            } else if (hasProperty(rawValue, 'valueAsNumber')) {
              if (this.#element.value === rawValue.valueAsNumber.toString()) return false;
              this.#element.value = rawValue.valueAsNumber.toString();
              return true;
            } else if (hasProperty(rawValue, 'valueAsDate')) {
              if (this.#element.valueAsDate === rawValue.valueAsDate) return false;
              this.#element.valueAsDate = rawValue.valueAsDate;
              return true;
            } else if (hasProperty(rawValue, 'files')) {
              if (this.#element.files === rawValue.files) return false;
              this.#element.files = rawValue.files;
              return true;
            } else if (hasProperty(rawValue, 'checked')) {
              if (this.#element.checked === rawValue.checked) return false;
              this.#element.checked = rawValue.checked;
              return true;
            } else {
              debugger;
              throw new Error('Cannot set element value to specified value.');
            }
          } else {
            throw new Error('Cannot set element value to specified value for non-input element.');
          }
        }
      }
    }
  }

  setValue(value: T | undefined, options?: SetValueOptions) {
    options ??= setValueDefaultOptions;
    this.startUpdate();

    if (this.#nodeList || this.#element) {
      this.#valueChanged ||= this.#setElementValue(value);
      if (!options.preventValidate && this.#valueChanged && this.#shouldValidate) this.validate();
    } else {
      const previousValue = this.value;
      this.#defaultValue = value;
      this.#value = value;
      this.#valueChanged ||= previousValue !== this.value;
    }

    this.endUpdate();
  }

  setDefaultValue(value: T | undefined, options?: SetValueOptions) {
    options ??= setValueDefaultOptions;

    if (this.#nodeList || this.#element) {
      const previousDefaultValue = this.defaultValue;
      this.#defaultValue = value;

      if (!this.#hasValue || previousDefaultValue === this.value) {
        this.setValue(this.defaultValue, options);
      }
    } else {
      this.setValue(value, options);
    }
  }

  subscribeToValueChanged(callback: () => void): () => void {
    this.#valueChangedListeners.push(callback);

    const unsubscribe = () => {
      const index = this.#valueChangedListeners.indexOf(callback);
      if (index === -1) return;
      this.#valueChangedListeners.splice(index, 1);
    };

    return unsubscribe;
  }

  subscribeToStateChanged(callback: () => void): () => void {
    this.#stateChangedListeners.push(callback);

    const unsubscribe = () => {
      const index = this.#stateChangedListeners.indexOf(callback);
      if (index === -1) return;
      this.#stateChangedListeners.splice(index, 1);
    };

    return unsubscribe;
  }

  validate(): boolean {
    this.startUpdate();

    if (this.options.required && !this.#hasValue) {
      this.error = globalOptions.errorMessages.required;
      this.endUpdate();
      return false;
    }

    if (this.#element && this.#hasValue) {
      const rawValue = this.#getElementRawValue();
      for (const rule of this.#options.rules ?? []) {
        const error = rule(rawValue, this.#element);

        if (error) {
          this.error = error;
          this.endUpdate();
          return false;
        }
      }
    }

    this.error = null;
    this.endUpdate();
    return true;
  }

  reset(defaultValue?: T) {
    this.startUpdate();
    this.#error = null;
    this.#isDirty = false;
    this.#isTouched = false;

    if (defaultValue !== undefined) {
      this.setDefaultValue(defaultValue, { preventValidate: true });
    }

    this.setValue(this.defaultValue, { preventValidate: true });
    this.#stateChanged = true;
    this.endUpdate();
  }

  focus() {
    this.#element?.focus();
  }
}
