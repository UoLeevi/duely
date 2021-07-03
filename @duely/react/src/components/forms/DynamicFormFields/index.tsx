import { Form_FieldFragment } from '@duely/core';
import React from 'react';
import { SkeletonFormField } from '../../skeletons/SkeletonFormField';
import { FormField } from '../FormField';

export type DynamicFormFieldsProps = {
  fields: Form_FieldFragment[] | undefined;
  loading?: boolean;
  skeletonFieldCount?: number
  defaultValues?: Record<string, any>
};

export function DynamicFormFields({
  fields,
  loading,
  skeletonFieldCount,
  defaultValues,
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
          type={field.type}
          name={field.name}
          label={field.label}
          defaultValue={defaultValues?.[field.name]}
        />
      ))}
    </React.Fragment>
  );
}
