import { Form_FieldFragment } from '@duely/core';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SkeletonFormField } from '../../skeletons/SkeletonFormField';
import { FormField } from '../FormField';

export type DynamicFormFieldsProps = {
  form: UseFormReturn;
  fields: Form_FieldFragment[] | undefined;
  loading?: boolean;
  skeletonFieldCount?: number
};

export function DynamicFormFields({
  form,
  fields,
  loading,
  skeletonFieldCount,
  ...props
}: DynamicFormFieldsProps) {

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
