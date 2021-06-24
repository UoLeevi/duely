import React, { useEffect, useRef } from 'react';
import { FormFieldRegisterOptions } from '@duely/react-form';
import { Util } from '../../../util';
import { LoadingBar } from '../../LoadingBar';
import { useFormContext } from '../Form';
import {
  FormFieldDefaultElement,
  FormFieldDefaultElementProps,
  FormFieldFileElement,
  FormFieldFileElementProps,
  FormFieldImageElement,
  FormFieldImageElementProps,
  FormFieldRadioBlocksElement,
  FormFieldRadioBlocksElementProps,
  FormFieldRadioToggleElement,
  FormFieldRadioToggleElementProps,
  FormFieldSelectElement,
  FormFieldSelectElementProps,
  FormFieldTextAreaElement,
  FormFieldTextAreaElementProps
} from './elements';

type FormFieldPropsPartial<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>,
  TType extends string = string
> = {
  name: TName;
  type?: TType;
  defaultValue?: TFormFields[TName];
  label?: React.ReactNode;
  registerOptions?: FormFieldRegisterOptions<TFormFields[TName]>;
  hint?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
};

type FormFieldRadioToggleProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> = FormFieldPropsPartial<TName, TFormFields> &
  FormFieldRadioToggleElementProps<TName, TFormFields> & {
    type: 'radio-toggle';
  };

type FormFieldRadioBlocksProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> = FormFieldPropsPartial<TName, TFormFields> &
  FormFieldRadioBlocksElementProps<TName, TFormFields> & {
    type: 'radio-blocks';
  };

type FormFieldSelectProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> = FormFieldPropsPartial<TName, TFormFields> &
  FormFieldSelectElementProps<TName, TFormFields> & {
    type: 'select';
  };

type FormFieldImageProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> = FormFieldPropsPartial<TName, TFormFields> &
  FormFieldImageElementProps<TName, TFormFields> & {
    type: 'image';
  };

type FormFieldFileProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> = FormFieldPropsPartial<TName, TFormFields> &
  FormFieldFileElementProps<TName, TFormFields> & {
    type: 'file';
  };

type FormFieldTextAreaProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> = FormFieldPropsPartial<TName, TFormFields> &
  FormFieldTextAreaElementProps<TName, TFormFields> & {
    type: 'textarea';
  };

type FormFieldDefaultProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>,
  TType extends string = string
> = FormFieldPropsPartial<TName, TFormFields> &
  FormFieldDefaultElementProps<TName, TFormFields> & {
    type?: Exclude<
      TType,
      'radio-toggle' | 'radio-blocks' | 'select' | 'image' | 'file' | 'textarea'
    >;
  };

type FormFieldProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>,
  TType extends string = string
> =
  | Omit<FormFieldTextAreaProps<TName, TFormFields>, 'hintOrInfoRef'>
  | Omit<FormFieldFileProps<TName, TFormFields>, 'hintOrInfoRef'>
  | Omit<FormFieldImageProps<TName, TFormFields>, 'hintOrInfoRef'>
  | Omit<FormFieldRadioToggleProps<TName, TFormFields>, 'hintOrInfoRef'>
  | Omit<FormFieldRadioBlocksProps<TName, TFormFields>, 'hintOrInfoRef'>
  | Omit<FormFieldSelectProps<TName, TFormFields>, 'hintOrInfoRef'>
  | Omit<FormFieldDefaultProps<TName, TFormFields, TType>, 'hintOrInfoRef'>;

export function FormField<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>,
  TType extends string = string
>({
  name,
  defaultValue,
  label,
  type,
  hint,
  prefix,
  suffix,
  actions,
  loading,
  className,
  ...props
}: FormFieldProps<TName, TFormFields, TType>) {
  const form = useFormContext();
  const fieldState = form.useFormFieldState(name);
  let errorMessage = fieldState.error;

  const [longErrorMessage, shortErrorMessage] =
    errorMessage?.length! > 20 ? [errorMessage, null] : [null, errorMessage];

  let element;
  let hintOrInfoRef = useRef(hint);

  useEffect(() => {
    if (defaultValue === undefined) return;
    form.setDefaultValue(name, defaultValue);
  }, [name, defaultValue]);

  switch (type) {
    case 'radio-toggle': {
      element = (
        <FormFieldRadioToggleElement
          {...({
            name,
            hint,
            loading,
            hintOrInfoRef,
            prefix,
            suffix,
            ...props
          } as FormFieldRadioToggleElementProps<TName, TFormFields>)}
        />
      );
      break;
    }

    case 'radio-blocks': {
      element = (
        <FormFieldRadioBlocksElement
          {...({
            name,
            hint,
            loading,
            hintOrInfoRef,
            prefix,
            suffix,
            ...props
          } as FormFieldRadioBlocksElementProps<TName, TFormFields>)}
        />
      );
      break;
    }

    case 'select': {
      element = (
        <FormFieldSelectElement
          {...({
            name,
            hint,
            loading,
            hintOrInfoRef,
            prefix,
            suffix,
            ...props
          } as FormFieldSelectElementProps<TName, TFormFields>)}
        />
      );
      break;
    }

    case 'image': {
      element = (
        <FormFieldImageElement
          {...({
            name,
            hint,
            loading,
            hintOrInfoRef,
            prefix,
            suffix,
            ...props
          } as FormFieldImageElementProps<TName, TFormFields>)}
        />
      );
      break;
    }

    case 'file': {
      element = (
        <FormFieldFileElement
          {...({
            name,
            hint,
            loading,
            hintOrInfoRef,
            prefix,
            suffix,
            ...props
          } as FormFieldFileElementProps<TName, TFormFields>)}
        />
      );
      break;
    }

    case 'textarea': {
      element = (
        <FormFieldTextAreaElement
          {...({
            name,
            hint,
            loading,
            hintOrInfoRef,
            prefix,
            suffix,
            ...props
          } as FormFieldTextAreaElementProps<TName, TFormFields>)}
        />
      );
      break;
    }

    default: {
      element = (
        <FormFieldDefaultElement
          {...({
            name,
            type,
            hint,
            loading,
            hintOrInfoRef,
            prefix,
            suffix,
            ...props
          } as FormFieldDefaultElementProps<TName, TFormFields>)}
        />
      );
    }
  }

  className = Util.createClassName('flex flex-col relative', className);

  return (
    <div className={className}>
      <div className="flex justify-between whitespace-nowrap">
        {label && (
          <label className="pb-1 pl-px text-sm font-medium text-gray-700" htmlFor={name}>
            {label}
          </label>
        )}

        {shortErrorMessage ? (
          <p className="text-xs font-medium leading-5 text-red-500">{shortErrorMessage}</p>
        ) : (
          actions
        )}
      </div>

      {element}

      <LoadingBar className="h-px px-1" loading={!!loading} />

      {longErrorMessage ? (
        <p className="pt-1 pl-px m-0 text-xs text-red-500 min-h-[1rem] box-content">
          {longErrorMessage}
        </p>
      ) : (
        <p className="pt-1 pl-px m-0 text-xs text-gray-500 min-h-[1rem] box-content">
          {hintOrInfoRef.current}
        </p>
      )}
    </div>
  );
}
