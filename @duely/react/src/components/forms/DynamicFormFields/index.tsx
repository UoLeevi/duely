import { Form_FieldFragment, Util } from '@duely/core';
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LoadingSpinner } from '../../LoadingSpinner';
import { SkeletonFormField } from '../../skeletons/SkeletonFormField';
import { FormField } from '../FormField';

export type DynamicFormFieldsProps = {
  form: UseFormReturn;
  fields: Form_FieldFragment[] | undefined;
  loading?: boolean;
  values?: object | undefined;
  skeletonFieldCount?: number
};

export function DynamicFormFields({
  form,
  fields,
  values,
  loading,
  skeletonFieldCount,
  ...props
}: DynamicFormFieldsProps) {
  const { reset, getValues } = form;
  const fieldNames = fields?.map((field) => field.name) ?? [];
  const valueArray = values && fields ? Object.values(Util.pick(values, fieldNames)) : [];

  useEffect(() => {
    if (loading || !values || !fields) return;
    reset(values);
  }, [loading, !values, !fields, JSON.stringify(valueArray)]);

  // replace spinner with skeleton fields
  if (loading)
    return (
      <React.Fragment>
        {[...Array(skeletonFieldCount ?? 3).keys()]?.map((i) => (
          <SkeletonFormField key={i} />
        ))}
      </React.Fragment>
    );

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
