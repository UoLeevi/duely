import { ChangeEvent, FocusEvent, useMemo, useState } from 'react';
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
  control: FormControl;
};

class FormControl<TFormFields extends Record<string, any> = Record<string, any>> {
  rerenderForm: () => void;
  fields: Map<string & keyof TFormFields, FormFieldInfo>;
  formState: {
    isDirty: boolean;
  };

  constructor(rerenderForm: () => void) {
    this.rerenderForm = rerenderForm;
    this.fields = new Map();
    this.formState = { isDirty: false };
  }

  attachElement(field: FormFieldInfo, el: NonNullable<FormFieldHTMLElement>) {
    field.domElement = el;
    this.setFieldValue(field, field.defaultValue);
  }

  detachElement(field: FormFieldInfo) {
    field.domElement = null;
  }

  isCheckBoxElement(el: NonNullable<FormFieldHTMLElement>): el is HTMLInputElement {
    return el.type === 'checkbox';
  }

  getFieldValue(field: FormFieldInfo) {
    const el = field.domElement;
    if (!el) return undefined;
    return this.isCheckBoxElement(el) ? el.checked : el.value;
  }

  setFieldValue(field: FormFieldInfo, value: any) {
    const el = field.domElement;
    if (!el) return;

    if (this.isCheckBoxElement(el)) {
      el.checked = value ?? false;
    } else {
      el.value = value ?? '';
    }
  }

  onFieldChange(field: FormFieldInfo, event: ChangeEvent<FormFieldHTMLElement>) {
    field.notify();
    this.formState.isDirty = true;
  }

  onFieldBlur(field: FormFieldInfo, event: FocusEvent<FormFieldHTMLElement>) {}

  getOrAddField(name: string & keyof TFormFields): FormFieldInfo {
    let field = this.fields.get(name);

    if (field === undefined) {
      field = {
        name,
        watchValue: undefined,
        notify: () => {
          if (field!.watchCounter === 0) return;
          if (field!.watchValue === this.getFieldValue(field!)) return;
          this.rerenderForm();
        },
        watchCounter: 0,
        control: this as FormControl
      };

      this.fields.set(name, field);
    }

    return field;
  }
}

export function useForm2<TFormFields extends Record<string, any> = Record<string, any>>() {
  const rerenderForm = useRerender();
  const control = useState(() => new FormControl(rerenderForm))[0];
  const setDefaultValue = useCallback((name: string, value: any) => {
    const field = control.getOrAddField(name);
    field.defaultValue = value;

    if (field.domElement) {
      field.domElement.value = value ?? '';
      if (field!.watchCounter != 0) rerenderForm();
    }
  }, []);

  const register = useCallback(
    Util.memo((name: string) => {
      const field = control.getOrAddField(name);

      return {
        name,
        // see: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
        ref(el: FormFieldHTMLElement) {
          if (el) {
            control.attachElement(field!, el);
          } else {
            control.detachElement(field!);
          }
        },
        onChange(event: ChangeEvent<FormFieldHTMLElement>) {
          control.onFieldChange(field!, event);
        },
        onBlur(event: FocusEvent<FormFieldHTMLElement>) {
          control.onFieldBlur(field!, event);
        }
      };
    }),
    []
  );

  const watch = useCallback((name: string) => {
    const field = control.getOrAddField(name);

    useEffect(() => {
      ++field!.watchCounter;
      return () => {
        --field!.watchCounter;
      };
    }, []);

    field.watchValue = control.getFieldValue(field);
    return field.watchValue;
  }, []);

  const reset = useCallback(() => {
    const { fields, formState } = control;
    fields.forEach((field) => {
      control.setFieldValue(field, field.defaultValue);
    });
    formState.isDirty = false;
    rerenderForm();
  }, []);

  const handleSubmit = useCallback(
    (onSubmit: (data: TFormFields, event?: React.BaseSyntheticEvent) => any | Promise<any>) => {
      return async (event?: React.BaseSyntheticEvent) => {
        event?.preventDefault();
        console.log(event);
        const { fields } = control;
        const data: any = {};
        fields.forEach((field, name) => {
          data[name] = control.getFieldValue(field);
        });
        await onSubmit(data, event);
      };
    },
    []
  );

  const formState = useMemo(() => {
    const { formState } = control;
    return new Proxy<typeof formState>(formState, {
      get(target, p, receiver) {
        return target[p as keyof typeof target];
      }
    });
  }, []);

  return {
    control,
    register,
    setDefaultValue,
    watch,
    reset,
    handleSubmit,
    formState
  };
}
