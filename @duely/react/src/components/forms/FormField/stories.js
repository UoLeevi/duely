import React from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '.';
import { Util } from '../../../util';

export default {
  title: 'Forms/FormField',
  component: FormField,
  argTypes: {},
};

const Template = (args) => {
  const form = useForm();
  return <FormField form={form} {...args} />;
};

export const Text = Template.bind({});
Text.args = {
  className: 'max-w-xs sm:max-w-sm',
  label: 'Brand name',
  name: 'name',
  type: 'text',
  registerOptions: { required: true }
};

export const Loading = Template.bind({});
Loading.args = {
  className: 'max-w-xs sm:max-w-sm',
  label: 'Brand name',
  name: 'name',
  type: 'text',
  loading: true,
  registerOptions: { required: true }
};

export const Subdomain = Template.bind({});
Subdomain.args = {
  className: 'max-w-xs sm:max-w-sm',
  label: 'Subdomain URL',
  name: 'subdomain_name',
  type: 'text',
  prefix: 'https://',
  suffix: '.duely.app',
  hint: 'Choose a subdomain for your brand',
  registerOptions: { required: true }
};

export const Image = Template.bind({});
Image.args = {
  className: 'max-w-xs sm:max-w-sm',
  label: 'Logo image',
  name: 'image_logo_file_list',
  type: 'file',
  accept: 'image/jpeg, image/png',
  hint: 'PNG, JPG up to 512kb, and minimum 128px by 128px.',
  registerOptions: { required: true }
};

const countries = ['FI', 'SG', 'US', 'GB', 'JP']
  .map(countryByCode)
  .sort((a, b) => (a.name).localeCompare(b.name))
  .map(c => ({ value: c.alpha2code, element: c.shortName || c.name ? `${c.shortName || c.name} ${c.flag}` : c.alpha2code }));

export const Countries = Template.bind({});
Countries.args = {
  className: 'max-w-xs sm:max-w-sm',
  label: 'Country',
  name: 'country_code',
  type: 'select',
  options: countries,
  registerOptions: { required: true }
};
