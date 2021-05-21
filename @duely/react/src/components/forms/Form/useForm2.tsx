import { ChangeEvent, FocusEvent } from 'react';
import { useCallback, useRef } from 'react';
import { useRerender } from '../../../hooks';
import { Util } from '@duely/core';
import { useEffect } from 'react';

export type FormFieldHTMLElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | null;

export type FormFieldInfo<T = any> = {
  name: string;
  defaultValue?: T;
  watchValue: T;
  domElement?: FormFieldHTMLElement;
  notify(): void;
  watchCounter: number;
};

function attachElement(field: FormFieldInfo, el: NonNullable<FormFieldHTMLElement>) {
  field.domElement = el;
  setFieldValue(field, field.defaultValue);
}

function detachElement(field: FormFieldInfo) {
  field.domElement = null;
}

function isCheckBoxElement(el: NonNullable<FormFieldHTMLElement>): el is HTMLInputElement {
  return el.type === 'checkbox';
}

function getFieldValue(field: FormFieldInfo) {
  const el = field.domElement;
  if (!el) return undefined;
  return isCheckBoxElement(el) ? el.checked : el.value;
}

function setFieldValue(field: FormFieldInfo, value: any) {
  const el = field.domElement;
  if (!el) return;

  if (isCheckBoxElement(el)) {
    el.checked = value ?? false;
  } else {
    el.value = value ?? '';
  }
}

function onFieldChange(field: FormFieldInfo, event: ChangeEvent<FormFieldHTMLElement>) {
  field.notify();
}

function onFieldBlur(field: FormFieldInfo, event: FocusEvent<FormFieldHTMLElement>) {}

function createField(name: string, rerenderForm: () => void): FormFieldInfo {
  const field = {
    name,
    watchValue: undefined,
    notify: () => {
      if (field.watchCounter === 0) return;
      if (field.watchValue === getFieldValue(field)) return;
      rerenderForm();
    },
    watchCounter: 0
  };

  return field;
}

export function useForm2<TFormFields extends Record<string, any> = Record<string, any>>() {
  const fieldsRef = useRef(new Map<string, FormFieldInfo>());
  const rerenderForm = useRerender();
  const setDefaultValue = useCallback((name: string, value: any) => {
    const fields = fieldsRef.current;
    let field = fields.get(name);

    if (field === undefined) {
      field = createField(name, rerenderForm);
      fields.set(name, field);
    }

    field.defaultValue = value;

    if (field.domElement) {
      field.domElement.value = value ?? '';
      if (field!.watchCounter != 0) rerenderForm();
    }
  }, []);

  const register = useCallback(
    Util.memo((name: string) => {
      const fields = fieldsRef.current;
      let field = fields.get(name);

      if (field === undefined) {
        field = createField(name, rerenderForm);
        fields.set(name, field);
      }

      return {
        name,
        // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
        ref(el: FormFieldHTMLElement) {
          if (el) {
            attachElement(field!, el);
          } else {
            detachElement(field!);
          }
        },
        onChange(event: ChangeEvent<FormFieldHTMLElement>) {
          onFieldChange(field!, event);
        },
        onBlur(event: FocusEvent<FormFieldHTMLElement>) {
          onFieldBlur(field!, event);
        }
      };
    }),
    []
  );

  const watch = useCallback((name: string) => {
    const fields = fieldsRef.current;
    let field = fields.get(name);

    if (field === undefined) {
      field = createField(name, rerenderForm);
      fields.set(name, field);
    }

    useEffect(() => {
      ++field!.watchCounter;
      return () => {
        --field!.watchCounter;
      };
    }, []);

    field.watchValue = getFieldValue(field);
    return field.watchValue;
  }, []);

  return {
    control: fieldsRef,
    register,
    setDefaultValue,
    watch
  };
}
