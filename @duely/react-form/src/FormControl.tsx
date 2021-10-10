import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRerender } from './hooks/useRerender';
import { FormFieldControl, FormFieldRegisterOptions } from './FormFieldControl';
import { ElementType, isString, push, randomKey, remove, removeAt } from '@duely/util';

export type FieldArrayItem<TItem> = {
  key: string;
  item: TItem | undefined;
  getName: (name: string) => string;
};

export class FormControl<TFormFields extends Record<string, any> = Record<string, any>> {
  #isSubmitting = false;
  #isDirty = false;
  #valueChanged = false;
  #valueChangedListeners: (() => void)[] = [];
  #stateChanged = false;
  #stateChangedListeners: (() => void)[] = [];
  #updateCounter = 0;
  #defaultValues: Partial<TFormFields>;
  #fields: Partial<{
    [TName in keyof TFormFields]: FormFieldControl<TFormFields[TName]>;
  }> = {};

  #arrayFields: Partial<{
    [TName in keyof TFormFields]: string[];
  }> = {};

  constructor(options?: { defaultValues?: Partial<TFormFields> }) {
    this.#defaultValues = options?.defaultValues ?? {};
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
      const keys = this.#arrayFields[arrayName];

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

  unregister<TName extends string & keyof TFormFields>(name: TName) {
    if (this.#fields.hasOwnProperty(name)) {
      this.startUpdate();
      delete this.#fields[name];
      this.#valueChanged = true;
      this.#stateChanged = true;
      this.endUpdate();
    }
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
      this.#arrayFields[name] = items;
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

  handleSubmit(
    onSubmit: (data: TFormFields, event?: React.BaseSyntheticEvent) => any | Promise<any>
  ) {
    const control = this;
    return async (event?: React.BaseSyntheticEvent) => {
      event?.preventDefault();

      for (const field of Object.values(control.#fields)) {
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

      await onSubmit(data, event);

      this.startUpdate();
      this.#isSubmitting = false;
      this.#isDirty = false;
      Object.values(this.#fields).forEach((field) => (field.isDirty = false));
      this.#stateChanged = true;
      this.endUpdate();
    };
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
