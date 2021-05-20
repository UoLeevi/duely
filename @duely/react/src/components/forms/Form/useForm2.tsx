import { ChangeEvent, FocusEvent } from 'react';
import { useCallback, useRef } from 'react';
import { useRerender } from '../../../hooks';

export type FormFieldHTMLElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | null;

export type FormFieldInfo<T = any> = {
  name: string;
  defaultValue?: T;
  value?: T;
  domElement?: FormFieldHTMLElement;
  rerender(): void;
};

function registerElement(field: FormFieldInfo, el: NonNullable<FormFieldHTMLElement>) {
  field.domElement = el;
  setElementValue(el, field.defaultValue);
  console.log('registered', field.name)
}

function unregisterElement(field: FormFieldInfo) {
  console.log('unregistered', field.name)
  field.domElement = null;
}

function isCheckBoxElement(el: NonNullable<FormFieldHTMLElement>): el is HTMLInputElement {
  return el.type === 'checkbox';
}

function getElementValue(el: NonNullable<FormFieldHTMLElement>) {
  return isCheckBoxElement(el) ? el.checked : el.value;
}

function setElementValue(el: NonNullable<FormFieldHTMLElement>, value: any) {
  if (isCheckBoxElement(el)) {
    el.checked = value ?? false;
  } else {
    el.value = value ?? '';
  }
}

function onFieldChange(field: FormFieldInfo, event: ChangeEvent<FormFieldHTMLElement>) {
  field.value = getElementValue(event.target);
}

function onFieldBlur(field: FormFieldInfo, event: FocusEvent<FormFieldHTMLElement>) {}

export function useForm2<TFormFields extends Record<string, any> = Record<string, any>>() {
  const fieldsRef = useRef(new Map<string, FormFieldInfo>());
  const rerender = useRerender();
  const setDefaultValue = useCallback((name: string, value: any) => {
    const fields = fieldsRef.current;
    let field = fields.get(name);

    if (field === undefined) {
      field = {
        name,
        rerender
      };
      fields.set(name, field);
    }

    field.defaultValue = value;

    if (field.domElement) {
      field.domElement.value = value ?? '';
      rerender();
    }
  }, []);

  const register = useCallback((name: string) => {
    const fields = fieldsRef.current;
    let field = fields.get(name);

    if (field === undefined) {
      field = {
        name,
        rerender
      };
      fields.set(name, field);
    }

    return {
      name,
      // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      ref(el: FormFieldHTMLElement) {
        if (el) {
          registerElement(field!, el);
        } else {
          unregisterElement(field!);
        }
      },
      onChange(event: ChangeEvent<FormFieldHTMLElement>) {
        onFieldChange(field!, event);
      },
      onBlur(event: FocusEvent<FormFieldHTMLElement>) {
        onFieldBlur(field!, event);
      }
    };
  }, []);

  const watch = useCallback((name: string) => {
    const fields = fieldsRef.current;
    let field = fields.get(name);
    return field && field.domElement && getElementValue(field.domElement);
  }, []);

  return {
    control: fieldsRef,
    register,
    setDefaultValue,
    watch
  };
}
