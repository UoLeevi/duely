import { FormControl } from './FormControl';

const globalOptions = {
  errorMessages: {
    required: 'Required',
    fallback: 'Invalid value'
  }
};

export type FormFieldRegisterOptions<T> = {
  required?: boolean;
  defaultValue?: T;
  rules?: ((value: T, element: FormFieldHTMLElement) => string | undefined)[];
  inputFilter?: RegExp;
};

type SetValueOptions = {
  preventValidate?: boolean;
};

const setValueDefaultOptions: SetValueOptions = {
  preventValidate: false
};

export function defaultGetElementValue(element: FormFieldHTMLElement): any {
  return element.value;
}

export function defaultSetElementValue(element: FormFieldHTMLElement, value: any) {
  if (value?.length === 0) value = undefined;
  value = value ?? '';
  if (element.value === value) return false;
  element.value = value;
  return true;
}

export const formFieldInfo: Record<
  FormFieldHTMLElement['type'],
  {
    props: Record<string, any>;
    shouldValidateOnChange?: boolean;
    getElementValue?: (element: any) => any;
    setElementValue?: (element: any, value: any) => boolean;
  }
> = {
  checkbox: {
    props: {
      type: 'checkbox'
    },
    getElementValue: (element: HTMLInputElement) => element.checked,
    setElementValue: (element: HTMLInputElement, value: boolean | undefined) => {
      value = value ?? false;
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
    },
    shouldValidateOnChange: true,
    getElementValue: (element: HTMLInputElement) => element.files
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
    shouldValidateOnChange: true,
    getElementValue: (element: HTMLInputElement) => {
      const control = element.form?.elements[element.name as keyof HTMLFormControlsCollection];
      if (!control) return undefined;
      const radioNodeList = control as unknown as RadioNodeList;
      return radioNodeList.value;
    },
    setElementValue: (element: HTMLInputElement, value: string | undefined) => {
      const control = element.form?.elements[element.name as keyof HTMLFormControlsCollection];
      if (!control) return false;
      const radioNodeList = control as unknown as RadioNodeList;
      value = value ?? '';
      if (radioNodeList.value === value) return false;

      if (value === '') {
        const input = Array.from(radioNodeList)
          .map((n) => n as HTMLInputElement)
          .find((n) => n.checked);
        if (!input) return false;
        input.checked = false;
      } else {
        radioNodeList.value = value;
      }

      return true;
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
  #form: FormControl;
  #element: FormFieldHTMLElement | undefined | null;
  #props:
    | undefined
    | {
        name: string;
        ref(el: FormFieldHTMLElement): void;
      };

  #value: T | undefined;
  #defaultValue: T | undefined;
  #getElementValue: ((element: FormFieldHTMLElement) => T) | undefined;
  #setElementValue: ((element: FormFieldHTMLElement, value: T | undefined) => boolean) | undefined;
  #error: string | null = null;
  #isDirty = false;
  #isTouched = false;
  #valueChanged = false;
  #valueChangedListeners: (() => void)[] = [];
  #stateChanged = false;
  #stateChangedListeners: (() => void)[] = [];
  #updateCounter = 0;
  #options: FormFieldRegisterOptions<T>;

  constructor(name: string, form: FormControl) {
    this.#name = name;
    this.#form = form;
    this.#options = {};
  }

  get #hasValue() {
    return ![undefined, ''].includes(this.value as any);
  }

  get #shouldValidate() {
    if (this.#isTouched) return true;

    if (this.#element && elementTypesWhichShouldValidateOnChange.includes(this.#element.type)) {
      return true;
    }

    return false;
  }

  get props(): {
    name: string;
    ref(el: FormFieldHTMLElement): void;
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
        }
      };
    }

    return this.#props;
  }

  get type() {
    return this.#element?.type;
  }

  get value(): T | undefined {
    if (this.#getElementValue && this.#element) {
      this.#value = this.#getElementValue(this.#element);
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
    if (this.#shouldValidate) this.validate();
    this.endUpdate();
  }

  #onBlur(event: FocusEvent) {
    this.startUpdate();
    this.isTouched = true;
    if (this.isDirty) this.validate();
    this.endUpdate();
  }

  #attachElement(element: FormFieldHTMLElement) {
    this.startUpdate();
    this.#element = element;

    // I encountered issues with react's SynteticEvents not firing in some cases.
    // For example if radio button was programatically changed and afterwards manually clicked (checked),
    // the onChange event would not be fired. There is no such issue with native DOM events.

    if (buttonElementTypes.includes(element.type)) {
      element.addEventListener('click', (event) => this.#onClick(event as MouseEvent));
    } else {
      element.addEventListener('beforeinput', (event) => this.#onBeforeInput(event as InputEvent));
      element.addEventListener('input', (event) => this.#onInput(event as InputEvent));
      element.addEventListener('blur', (event) => this.#onBlur(event as FocusEvent));

      this.#getElementValue = formFieldInfo[element.type].getElementValue ?? defaultGetElementValue;
      this.#setElementValue = formFieldInfo[element.type].setElementValue ?? defaultSetElementValue;
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
    if (this.#getElementValue && this.#element) {
      this.#value = this.#getElementValue(this.#element);
    }

    this.#element = null;
  }

  setValue(value: T | undefined, options?: SetValueOptions) {
    options ??= setValueDefaultOptions;
    this.startUpdate();

    if (this.#setElementValue && this.#element) {
      this.#valueChanged ||= this.#setElementValue(this.#element, value);
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

    if (this.#element) {
      const previousDefaultValue = this.defaultValue;
      this.#defaultValue = value;

      if (!this.#hasValue || previousDefaultValue === this.value) {
        this.setValue(this.defaultValue, options);
      }
    } else {
      this.setValue(value, options);
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
    this.startUpdate();

    if (this.options.required && !this.#hasValue) {
      this.error = globalOptions.errorMessages.required;
      this.endUpdate();
      return false;
    }

    if (this.#element && this.#hasValue) {
      for (const rule of this.#options.rules ?? []) {
        const value = this.value;
        const error = rule(value!, this.#element);

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
