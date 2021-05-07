import { Form_FieldFragment } from '@duely/core';
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Util } from '../../../util';
import { FormField } from '../FormField';

export type DynamicFormFieldsProps = {
  form: UseFormReturn;
  fields: Form_FieldFragment[] | undefined;
  values?: object | undefined;
};

export function DynamicFormFields({ form, fields, values, ...props }: DynamicFormFieldsProps) {
  const reset = form.reset;
  const valueArray =
    values && fields
      ? Object.values(
          Util.pick(
            values,
            fields.map((field) => field.name)
          )
        )
      : [];

  useEffect(() => {
    if (!values || !fields) return;
    reset(valueArray);
  }, [reset, fields, valueArray]);

  return (
    <React.Fragment>
      {fields?.map((field) => (
        <FormField
          key={field.id}
          form={form}
          type={field.type}
          name={field.name}
          label={field.label}
        />
      ))}
    </React.Fragment>
  );
}
