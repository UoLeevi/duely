import React, { useEffect, useId, useRef } from 'react';
import { LoadingBar } from '../../LoadingBar';
import { FormContext, useFormContext } from '../Form';
import {
  FormFieldCheckboxElement,
  FormFieldCheckboxElementProps,
  FormFieldDefaultElement,
  FormFieldDefaultElementProps,
  FormFieldFileElement,
  FormFieldFileElementProps,
  FormFieldImageElement,
  FormFieldImageElementProps,
  FormFieldMultiSelectElement,
  FormFieldMultiSelectElementProps,
  FormFieldRadioBlocksElement,
  FormFieldRadioBlocksElementProps,
  FormFieldRadioElement,
  FormFieldRadioElementProps,
  FormFieldRadioToggleElement,
  FormFieldRadioToggleElementProps,
  FormFieldSelectElement,
  FormFieldSelectElementProps,
  FormFieldTextAreaElement,
  FormFieldTextAreaElementProps
} from './elements';
import { createClassName } from '@duely/util';
import { FormLabel } from '../FormLabel';
import { icons, Tooltip } from '../..';
import { FormFieldRegisterOptions, UseFormReturn } from '../../../form';

type FormFieldPropsPartial<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>,
  TType extends string = string
> = {
  form?: UseFormReturn<TFormFields>;
  name: TName;
  type?: TType;
  defaultValue?: TFormFields[TName];
  label?: React.ReactNode;
  registerOptions?: FormFieldRegisterOptions<TFormFields[TName]>;
  hint?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  dense?: boolean;
  tooltip?: boolean;
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

type FormFieldMultiSelectProps<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
> = FormFieldPropsPartial<TName, TFormFields> &
  FormFieldMultiSelectElementProps<TName, TFormFields> & {
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
> = { form?: UseFormReturn<TFormFields> } & (
  | Omit<FormFieldTextAreaProps<TName, TFormFields>, 'hintRef' | 'form'>
  | Omit<FormFieldFileProps<TName, TFormFields>, 'hintRef' | 'form'>
  | Omit<FormFieldImageProps<TName, TFormFields>, 'hintRef' | 'form'>
  | Omit<FormFieldRadioToggleProps<TName, TFormFields>, 'hintRef' | 'form'>
  | Omit<FormFieldRadioBlocksProps<TName, TFormFields>, 'hintRef' | 'form'>
  | Omit<FormFieldSelectProps<TName, TFormFields>, 'hintRef' | 'form'>
  | Omit<FormFieldMultiSelectProps<TName, TFormFields>, 'hintRef' | 'form'>
  | Omit<FormFieldDefaultProps<TName, TFormFields, TType>, 'hintRef' | 'form'>
);

export function FormField<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>,
  TType extends string = string
>({
  name,
  form,
  defaultValue,
  label,
  type,
  hint,
  actions,
  loading,
  className,
  dense,
  tooltip,
  ...props
}: FormFieldProps<TName, TFormFields, TType>) {
  const formContext = useFormContext<TFormFields>();
  form ??= formContext;

  const fieldState = form.useFormFieldState(name);
  let errorMessage = fieldState?.error;

  const [longErrorMessage, shortErrorMessage] =
    errorMessage?.length! > 20 ? [errorMessage, null] : [null, errorMessage];

  let element;
  let hintRef = useRef(hint);
  const tooltipId = useId();

  useEffect(() => {
    if (defaultValue === undefined) return;
    form!.setDefaultValue(name, defaultValue);
  }, [name, defaultValue]);

  switch (type) {
    case 'radio-toggle': {
      element = (
        <FormFieldRadioToggleElement
          {...({
            name,
            loading,
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
            loading,
            ...props
          } as FormFieldRadioBlocksElementProps<TName, TFormFields>)}
        />
      );
      break;
    }

    case 'radio': {
      element = (
        <FormFieldRadioElement
          {...({
            name,
            loading,
            dense,
            ...props
          } as FormFieldRadioElementProps<TName, TFormFields>)}
        />
      );

      className = createClassName('flex flex-col relative', className);

      return (
        <FormContext.Provider value={form as any}>
          <div className={className} data-formfield={encodeURIComponent(name)}>
            <div className="flex items-center">
              {element}
              {label && (
                <FormLabel className="!pl-2.5 text-sm" htmlFor={`radio-${name}-${props.value}`}>
                  {label}
                </FormLabel>
              )}
            </div>

            <LoadingBar className="h-px px-1" loading={!!loading} />

            {errorMessage ? (
              <p className="pt-1 pl-px m-0 text-xs text-red-500 min-h-[1rem] box-content">
                {errorMessage}
              </p>
            ) : (
              (hintRef.current || !dense) && (
                <p className="pt-1 pl-px m-0 text-xs text-gray-500 min-h-[1rem] box-content">
                  {hintRef.current}
                </p>
              )
            )}
          </div>
        </FormContext.Provider>
      );
    }

    case 'checkbox': {
      element = (
        <FormFieldCheckboxElement
          {...({
            name,
            loading,
            dense,
            ...props
          } as FormFieldCheckboxElementProps<TName, TFormFields>)}
        />
      );

      className = createClassName('flex flex-col relative', className);

      return (
        <FormContext.Provider value={form as any}>
          <div className={className} data-formfield={encodeURIComponent(name)}>
            <div className="flex items-center">
              {element}
              {label && (
                <FormLabel className="!pl-2.5 text-sm" htmlFor={name}>
                  {label}
                </FormLabel>
              )}
            </div>

            <LoadingBar className="h-px px-1" loading={!!loading} />

            {errorMessage ? (
              <p className="pt-1 pl-px m-0 text-xs text-red-500 min-h-[1rem] box-content">
                {errorMessage}
              </p>
            ) : (
              (hintRef.current || !dense) && (
                <p className="pt-1 pl-px m-0 text-xs text-gray-500 min-h-[1rem] box-content">
                  {hintRef.current}
                </p>
              )
            )}
          </div>
        </FormContext.Provider>
      );
    }

    case 'select': {
      if ((props as any).multiple) {
        element = (
          <FormFieldMultiSelectElement
            {...({
              name,
              loading,
              ...props
            } as FormFieldMultiSelectElementProps<TName, TFormFields>)}
          />
        );
        break;
      } else {
        element = (
          <FormFieldSelectElement
            {...({
              name,
              loading,
              ...props
            } as FormFieldSelectElementProps<TName, TFormFields>)}
          />
        );
        break;
      }
    }

    case 'image': {
      element = (
        <FormFieldImageElement
          {...({
            name,
            hint,
            loading,
            hintRef,
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
            loading,
            hintRef,
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
            loading,
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
            loading,
            ...props
          } as FormFieldDefaultElementProps<TName, TFormFields>)}
        />
      );
    }
  }

  className = createClassName('flex flex-col relative', className);

  return (
    <FormContext.Provider value={form as any}>
      <div data-tooltip={tooltipId} className={className} data-formfield={encodeURIComponent(name)}>
        <div className="flex justify-between whitespace-nowrap">
          {label && (
            <FormLabel className="pb-1 text-sm" htmlFor={name}>
              {label}
            </FormLabel>
          )}

          {!tooltip && shortErrorMessage ? (
            <p className="text-xs font-medium leading-5 text-red-500">{shortErrorMessage}</p>
          ) : (
            actions
          )}
        </div>

        {element}

        <LoadingBar className="h-px px-1" loading={!!loading} />

        {!tooltip &&
          (longErrorMessage ? (
            <p className="pt-1 pl-px m-0 text-xs text-red-500 min-h-[1rem] box-content">
              {longErrorMessage}
            </p>
          ) : (
            (hintRef.current || !dense) && (
              <p className="pt-1 pl-px m-0 text-xs text-gray-500 min-h-[1rem] box-content">
                {hintRef.current}
              </p>
            )
          ))}

        {tooltip && (errorMessage ?? hintRef.current) && (
          <Tooltip id={tooltipId} className="px-2 py-1.5 text-sm flex">
            {errorMessage && (
              <>
                <span className="mr-1.5 text-red-400">{icons['exclamation-circle']}</span>
                {errorMessage}
              </>
            )}
            {!errorMessage && hintRef.current}
          </Tooltip>
        )}
      </div>
    </FormContext.Provider>
  );
}
