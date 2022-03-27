import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRerender } from './hooks/useRerender';
import {
  FormFieldControl,
  FormFieldHTMLElement,
  FormFieldRegisterOptions
} from './FormFieldControl';
import { isString, push, randomKey, remove, removeAt } from '@duely/util';

export type FieldArrayItem<TItem = undefined> = {
  key: string;
  item: TItem | undefined;
  getName: (name: string) => string;
};

export type FormRegisterOptions<TFormFields extends Record<string, any> = Record<string, any>> = {
  ref?: React.MutableRefObject<HTMLFormElement | undefined>;
  onReset: (e: Event) => void;
  onSubmit: (data: TFormFields, event?: SubmitEvent) => any | Promise<any>;
};

export class FormControl<TFormFields extends Record<string, any> = Record<string, any>> {
  #id = 'form-' + randomKey();
  #element?: HTMLFormElement;
  #isSubmitting = false;
  #isDirty = false;
  #valueChanged = false;
  #valueChangedListeners: (() => void)[] = [];
  #fieldValueChangedListeners = new Map<
    string & keyof TFormFields,
    ((defer?: boolean) => void)[]
  >();
  #stateChanged = false;
  #stateChangedListeners: (() => void)[] = [];
  #fieldStateChangedListeners = new Map<
    string & keyof TFormFields,
    ((defer?: boolean) => void)[]
  >();
  #updateCounter = 0;
  #options?: FormRegisterOptions<TFormFields>;
  #props:
    | undefined
    | {
        id: string;
        ref(el: HTMLFormElement): void;
      };
  #defaultValues: Partial<TFormFields>;
  #fields: Partial<{
    [TName in keyof TFormFields]: FormFieldControl<TFormFields[TName]>;
  }> = {};

  #arrayFields: Partial<{
    [TName in keyof TFormFields]: {
      options: {
        returnTrueValues?: boolean;
      };
      items: string[];
    };
  }> = {};

  constructor(options?: { defaultValues?: Partial<TFormFields> }) {
    this.#defaultValues = options?.defaultValues ?? {};
  }

  get props(): {
    ref(el: HTMLFormElement): void;
  } {
    if (!this.#props) {
      this.#props = {
        id: this.#id,
        // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
        ref: (element: HTMLFormElement) => {
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

  get id() {
    return this.#id;
  }

  get value(): Partial<TFormFields> {
    const value: Record<string, any> = {};
    const fieldsByArray: Record<string, Set<string>> = {};

    for (const [name, field] of Object.entries(this.#fields)) {
      const leftBracketIndex = name.indexOf('[');
      if (leftBracketIndex === -1) {
        value[name] = field.value;
        continue;
      }

      const arrayName = name.slice(0, leftBracketIndex);
      const keys = this.#arrayFields[arrayName]?.items;

      if (!keys) {
        value[name] = field.value;
        continue;
      }

      const rightBracketIndex = name.indexOf(']', leftBracketIndex);
      const itemName = name.slice(rightBracketIndex + 2);

      let fieldSet = fieldsByArray[arrayName];

      if (!fieldSet) {
        fieldSet = new Set();
        fieldsByArray[arrayName] = fieldSet;
      }

      if (fieldSet.has(itemName)) continue;

      fieldSet.add(itemName);
      let arrayField = value[arrayName];

      if (this.#arrayFields[arrayName]?.options.returnTrueValues) {
        if (!arrayField) {
          arrayField = [];
          value[arrayName] = arrayField;
        }

        for (let i = 0; i < keys.length; ++i) {
          const key = keys[i];
          const field = this.#fields[`${arrayName}[${key}].${itemName}`];
          if (field !== undefined && field.value === true) {
            arrayField.push(itemName);
            break;
          }
        }
      } else {
        if (!arrayField) {
          arrayField = keys.map((_) => ({}));
          value[arrayName] = arrayField;
        }

        for (let i = 0; i < keys.length; ++i) {
          const key = keys[i];
          const field = this.#fields[`${arrayName}[${key}].${itemName}`];
          if (field !== undefined) {
            arrayField[i][itemName] = field.value;
          }
        }
      }
    }

    return value as any;
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

  async #onSubmit(event: SubmitEvent) {
    event?.preventDefault();

    for (const field of Object.values(this.#fields)) {
      if (!field.validate()) {
        field.focus();
        return;
      }
    }

    const data = this.value as TFormFields;

    this.startUpdate();
    this.#isSubmitting = true;
    this.#stateChanged = true;
    this.endUpdate();

    await this.#options?.onSubmit(data, event);

    this.startUpdate();
    this.#isSubmitting = false;
    this.#isDirty = false;
    Object.values(this.#fields).forEach((field) => (field.isDirty = false));
    this.#stateChanged = true;
    this.endUpdate();
  }

  async #onReset(event: Event) {
    await this.#options?.onReset(event);
  }

  #attachElement(element: HTMLFormElement) {
    this.#element = element;

    if (this.#options?.ref) {
      this.#options.ref.current = element;
    }

    element.addEventListener('submit', (event) => this.#onSubmit(event));
    element.addEventListener('reset', (event) => this.#onReset(event));
  }

  #detachElement() {
    if (this.#options?.ref) {
      this.#options.ref.current = undefined;
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
      field = new FormFieldControl(name, this as any);
      this.#fields[name] = field;
      field.subscribeToValueChanged(() => {
        this.startUpdate();
        this.#valueChanged = true;
        this.endUpdate();
      });

      field.subscribeToValueChanged(() => {
        const callbacks = this.#fieldValueChangedListeners.get(name);
        callbacks?.forEach((callback) => callback());
      });

      field.subscribeToStateChanged(() => {
        const callbacks = this.#fieldStateChangedListeners.get(name);
        callbacks?.forEach((callback) => callback());
      });

      this.#fieldValueChangedListeners.get(name)?.forEach((callback) => callback(true));
      this.#fieldStateChangedListeners.get(name)?.forEach((callback) => callback(true));

      const leftBracketIndex = name.indexOf('[');

      if (leftBracketIndex !== -1) {
        const arrayName = name.slice(0, leftBracketIndex);
        field.subscribeToValueChanged(() => {
          const callbacks = this.#fieldValueChangedListeners.get(arrayName);
          callbacks?.forEach((callback) => callback());
        });

        field.subscribeToStateChanged(() => {
          const callbacks = this.#fieldStateChangedListeners.get(arrayName);
          callbacks?.forEach((callback) => callback());
        });

        this.#fieldValueChangedListeners.get(arrayName)?.forEach((callback) => callback(true));
        this.#fieldStateChangedListeners.get(arrayName)?.forEach((callback) => callback(true));
      }
    }

    if (options) {
      field.options = options;
    }

    return field;
  }

  #subscribeToFieldValueChanged(
    name: string & keyof TFormFields,
    callback: () => void
  ): () => void {
    let callbacks = this.#fieldValueChangedListeners.get(name);
    if (!callbacks) {
      callbacks = [];
      this.#fieldValueChangedListeners.set(name, callbacks);
    }
    callbacks.push(callback);

    const unsubscribe = () => {
      const index = callbacks!.indexOf(callback);
      if (index === -1) return;
      callbacks!.splice(index, 1);
    };

    return unsubscribe;
  }

  #subscribeToFieldStateChanged(
    name: string & keyof TFormFields,
    callback: () => void
  ): () => void {
    let callbacks = this.#fieldStateChangedListeners.get(name);
    if (!callbacks) {
      callbacks = [];
      this.#fieldStateChangedListeners.set(name, callbacks);
    }
    callbacks.push(callback);

    const unsubscribe = () => {
      const index = callbacks!.indexOf(callback);
      if (index === -1) return;
      callbacks!.splice(index, 1);
    };

    return unsubscribe;
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

  register(options: FormRegisterOptions<TFormFields>): {
    id: string;
    ref(el: HTMLFormElement): void;
  };
  register<TName extends string & keyof TFormFields>(
    name: TName,
    options?: FormFieldRegisterOptions<TFormFields[TName]>
  ): {
    name: string;
    form: string;
    ref(el: FormFieldHTMLElement | null): void;
  };
  register<TName extends string & keyof TFormFields>(
    nameOrOptions: TName | FormRegisterOptions<TFormFields>,
    options?: FormFieldRegisterOptions<TFormFields[TName]>
  ) {
    if (typeof nameOrOptions === 'string') {
      const field = this.#getOrAddField(nameOrOptions, options);
      return field.props;
    } else {
      this.#options = nameOrOptions;
      return this.props;
    }
  }

  unregister<TName extends string & keyof TFormFields>(name: TName) {
    if (this.#fields.hasOwnProperty(name)) {
      this.startUpdate();
      delete this.#fields[name];
      this.#valueChanged = true;
      this.#stateChanged = true;
      this.endUpdate();
    }
  }

  requestSubmit() {
    this.#element?.requestSubmit();
  }

  useFormState() {
    const subscriptionRef = useRef<() => void>();
    const rerender = useRerender();

    if (!subscriptionRef.current) {
      subscriptionRef.current = this.#subscribeToStateChanged(rerender);
    }

    // unsubsribe on unmount
    useEffect(() => () => subscriptionRef.current?.(), []);
    return this;
  }

  useFormFieldState<TName extends string & keyof TFormFields>(name: TName) {
    const subscriptionRef = useRef<() => void>();
    const rerender = useRerender();

    if (!subscriptionRef.current) {
      subscriptionRef.current = this.#subscribeToFieldStateChanged(name, rerender);
    }

    // unsubsribe on unmount
    useEffect(() => () => subscriptionRef.current?.(), []);

    return this.#fields[name];
  }

  useFormFieldValue<TName extends string & keyof TFormFields>(name: TName) {
    const subscriptionRef = useRef<() => void>();
    const rerender = useRerender();

    if (!subscriptionRef.current) {
      subscriptionRef.current = this.#subscribeToFieldValueChanged(name, rerender);
    }

    // unsubsribe on unmount
    useEffect(() => () => subscriptionRef.current?.(), []);

    return this.#fields[name]?.value;
  }

  useFieldArrayValue<TName extends string & keyof TFormFields>(name: TName) {
    const [subscriptions] = useState(() => new Map<string, () => void>());
    const rerender = useRerender();

    Object.entries(this.#fields)
      .filter(([fieldName]) => !subscriptions.has(fieldName) && fieldName.startsWith(`${name}[`))
      .forEach(([fieldName, field]) =>
        subscriptions.set(fieldName, field.subscribeToValueChanged(rerender))
      );

    // unsubsribe on unmount
    useEffect(() => () => subscriptions.forEach((unsubscribe) => unsubscribe()), []);

    return this.value[name];
  }

  useFormValue() {
    const subscriptionRef = useRef<() => void>();
    const rerender = useRerender();

    if (!subscriptionRef.current) {
      subscriptionRef.current = this.#subscribeToValueChanged(rerender);
    }

    // unsubsribe on unmount
    useEffect(() => () => subscriptionRef.current?.(), []);
    return this.value;
  }

  useFieldArray<
    TName extends string & keyof TFormFields,
    TItem,
    TKeyField extends string & keyof TItem
  >(
    name: TName,
    bind?: {
      keyField: TKeyField | ((item: TItem) => string);
      items: TItem[] | undefined;
      loading?: boolean;
      returnTrueValues?: boolean;
    }
  ) {
    const bindItems = bind?.items ?? [];
    const bindKeys: string[] = bindItems.map((item) =>
      typeof bind!.keyField === 'function'
        ? bind!.keyField(item)
        : (item[bind!.keyField] as unknown as string)
    );

    const bindItemsByKeys: Record<string, TItem> = {};

    for (let i = 0; i < bindItems.length; ++i) {
      bindItemsByKeys[bindKeys[i]] = bindItems[i];
    }

    const [items, setItems] = useState<string[]>(bindKeys);

    useEffect(() => {
      if (bind && !bind.loading) {
        setItems((items) => [
          ...bindKeys,
          ...items.filter((key) => bindItemsByKeys[key] === undefined)
        ]);
      }
    }, [bind?.loading]);

    const addItem = useCallback(() => setItems((items) => push(items, randomKey())), [name]);
    const removeItem = useCallback(
      (item: number | string) =>
        setItems((items) =>
          isString(item) ? remove(items, (key) => key === item) : removeAt(items, item)
        ),
      [name]
    );

    const arrayName = name;

    if (items.length === 0) {
      delete this.#arrayFields[name];
    } else {
      this.#arrayFields[name] = {
        items,
        options: { returnTrueValues: bind?.returnTrueValues }
      };
    }

    return {
      fields: useMemo(
        () =>
          items.map((key) => ({
            key,
            item: bindItemsByKeys[key] as TItem | undefined,
            getName: (name: string) => `${arrayName}[${key}].${name}`
          })),
        [items]
      ),
      addItem,
      removeItem
    };
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

  setValue<TName extends string & keyof TFormFields>(
    name: TName,
    value: TFormFields[TName] | undefined
  ) {
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
